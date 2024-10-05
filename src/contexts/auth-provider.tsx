import React, { createContext, useContext, useMemo, useEffect, ReactNode, useCallback, useState } from 'react';
import { useSolveChallengeMutation, useRequestChallengeMutation, useRefreshTokenMutation } from '@store/auth/api';
import { useGetUserBotsAndEventsQuery } from '@store/transactions/api';
import { setLoginStatus, LoginStatus } from '@slices/appSlice';
import { useGetUserUsdcBalanceQuery } from '@store/transactions/api';
import { setBots, setUsdcBalance } from '@store/transactions/slice';
import { useAppDispatch } from '@shared/hooks/useStore';
import { useWallet } from '@solana/wallet-adapter-react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import LogRocket from 'logrocket';
import bs58 from 'bs58';
import { toast } from 'sonner';
import { IBotData } from '@pages/overview-bots/hooks/useProfile';

interface AuthContextType {
  address: string;
  usdcBalance: number | null;
  botsData: IBotData[] | null;
  resetAuth: () => void;
}

interface JwtPayload {
  iss?: string;
  exp?: number;
  sub?: string;
}

interface ChallengeResponse {
  address: string;
  chain: string;
  valid_til: number;
  token: string;
}

const defaultContextValue: AuthContextType = {
  address: '',
  usdcBalance: null,
  botsData: null,
  resetAuth: () => {}
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const cookies = new Cookies();
  const dispatch = useAppDispatch();
  const [solveAuthChallenge] = useSolveChallengeMutation();
  const [requestAuthChallenge] = useRequestChallengeMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  const token = cookies.get("bearerToken");
  const { publicKey, signMessage, disconnect } = useWallet();
  const [address, setAddress] = useState('');
  const { data: usdcBalanceData, refetch: refetchUsdcBalance } = useGetUserUsdcBalanceQuery({ user: address }, { skip: !address });
  const { data: botsData, refetch: refetchBotData } = useGetUserBotsAndEventsQuery({ userAddress: address }, { skip: !address });

  useEffect(() => {
    if (usdcBalanceData) {
      dispatch(setUsdcBalance(usdcBalanceData.balance));
      if(usdcBalanceData.balance == 0) {
        toast.message('You dont have USDC')
      } else {
        console.log(usdcBalanceData)
        if ((usdcBalanceData as any).error) toast.message((usdcBalanceData as any).error);
      }
    }
  }, [usdcBalanceData, dispatch]);

  useEffect(() => {
    console.log(botsData)
    if (botsData) {
      dispatch(setBots(botsData.data));
    }
  }, [botsData, dispatch]);

  const resetAuth = useCallback(async () => {
    cookies.remove('bearerToken');
    await disconnect();
    setAddress('');
    dispatch(setBots([]));
    dispatch(setUsdcBalance(0));
    dispatch(setLoginStatus(LoginStatus.OUT));
  }, [disconnect, cookies, dispatch]);

  const handleTokenValidation = useCallback(async (token: string, address: string) => {
    try {
      const decoded = jwt_decode<JwtPayload>(token);
      
      if (decoded.sub !== address) {
        resetAuth();
        return false;
      }
  
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        const refreshedToken = await refreshTokenMutation({ token }).unwrap();
        token = refreshedToken.token;
      }
  
      // Set the cookie here
      cookies.set('bearerToken', token, {
        path: '/',
        maxAge: decoded.exp ? decoded.exp * 1000 - Date.now() : undefined,
        expires: decoded.exp ? new Date(decoded.exp * 1000) : undefined,
        secure: true,
        sameSite: 'strict'
      });
  
      setAddress(address);
      dispatch(setLoginStatus(LoginStatus.IN));
      LogRocket.identify(address);
  
      refetchUsdcBalance();
      refetchBotData();

      return true;
    } catch (error) {
      console.error("Failed to validate or refresh token", error);
      resetAuth();
      return false;
    }
  }, [cookies, dispatch, refetchUsdcBalance, resetAuth, refreshTokenMutation]);
  
  const handleChallenge = useCallback(async (challenge: string, address: string) => {
    try {
      if (!signMessage) return;

      const message = new TextEncoder().encode(challenge);
      const signedMessage = await signMessage(message);
      const signature = bs58.encode(signedMessage);

      const challengeResponse = await solveAuthChallenge({ address, signature }).unwrap();
      handleTokenValidation(challengeResponse.token, challengeResponse.address);
    } catch (e) {
      console.error("Failed to solve authentication challenge", e);
      resetAuth();
    }
  }, [signMessage, handleTokenValidation]);

  const handleAuth = useCallback(async (address: string) => {
    if (token) {
      try {
        const decoded = jwt_decode<JwtPayload>(token);
        if (decoded.sub !== address) {
          console.error("Token address mismatch");
          const { challenge } = await requestAuthChallenge({ address }).unwrap();
          await handleChallenge(challenge, address);
          return;
        }
        
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          await handleTokenValidation(token, address);
        } else {
          setAddress(address);
          dispatch(setLoginStatus(LoginStatus.IN));
          // refresh? refetchUsdcBalance(); refetchBotData();
        }
      } catch (error) {
        console.error("Failed to decode token", error);
        resetAuth();
      }
      return;
    }
  
    try {
      const { challenge } = await requestAuthChallenge({ address }).unwrap();
      await handleChallenge(challenge, address);
    } catch (error) {
      console.error("Failed to handle authentication challenge", error);
      resetAuth();
    }
  }, [token, handleChallenge, handleTokenValidation, resetAuth, dispatch]);

  useEffect(() => {
    const address = publicKey?.toBase58();
    if (!address) return;

    handleAuth(address);
  }, [publicKey]);

  const contextValue = useMemo(() => ({
    address,
    usdcBalance: usdcBalanceData?.balance ?? null,
    botsData: botsData?.data ?? null,
    resetAuth
  }), [address, usdcBalanceData, botsData, resetAuth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  
  return context;
}

export { AuthProvider, useAuth };
