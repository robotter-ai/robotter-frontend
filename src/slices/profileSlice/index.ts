import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import type { RootState } from 'src/store';
import profileService, { UserProps } from './profileService';

export const getUserInfo = createAsyncThunk(
  'profile/getUserInfo',
  async (_, thunkAPI) => {
    try {
      const { profile } = thunkAPI.getState() as RootState;
      return await profileService.getUserInfo(profile.auth.address);
    } catch (err: any) {
      const errMsg =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  'profile/updateUserInfo',
  async (data: UserProps, thunkAPI) => {
    try {
      return await profileService.updateUserInfo(data);
    } catch (err: any) {
      const errMsg =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

interface ProfileSliceProps {
  isLoading: boolean;
  success: boolean | null;
  error: any;
  userInfo: UserProps | any;
  auth: { address: any; isConnected: boolean };
  updateActions: { isLoading: boolean; success: boolean | null; error: any };
}

const initialState: ProfileSliceProps = {
  isLoading: false,
  success: null,
  error: null,
  userInfo: null,
  auth: { address: null, isConnected: false },
  updateActions: { isLoading: false, success: null, error: null },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ address: any; isConnected: boolean }>
    ) => {
      state.auth = action.payload;
    },
    logoutUser: (state) => {
      state.auth = { address: '', isConnected: false };
    },
    resetProfileSlice: (state) => {
      state.success = null;
      state.error = null;
    },
    resetUpdateSlice: (state) => {
      state.updateActions.success = null;
      state.updateActions.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.userInfo = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload as string);
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.updateActions.isLoading = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.updateActions.isLoading = false;
        state.updateActions.success = true;
        state.userInfo = action.payload;
        toast.success('Profile have been updated!');
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.updateActions.isLoading = false;
        state.updateActions.error = action.payload;
        toast.error(action.payload as string);
      });
  },
});

export const { setAuth, resetUpdateSlice, resetProfileSlice } =
  profileSlice.actions;

export default profileSlice;