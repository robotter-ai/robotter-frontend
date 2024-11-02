import { MetaMaskIcon, PhantomIcon } from '@assets/icons';
import CustomBtn from '@components/ui/CustomBtn';
import { useEffect, useRef } from 'react';

interface ISwitchWalletModalProps {
  phantomAddress: React.ReactElement;
  setShowWallet: React.Dispatch<React.SetStateAction<boolean>>;
}

const SwitchWalletModal: React.FC<ISwitchWalletModalProps> = ({
  phantomAddress,
  setShowWallet,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(evt.target as Node)) {
        setShowWallet(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={divRef}
      className="absolute bg-white top-12 right-0 z-40 flex flex-col w-[20.3125rem] h-64 rounded-[22px] p-6 shadow-custom gap-5"
    >
      <h2 className="text-center text-blue-400 font-bold text-xl">
        Switch wallet
      </h2>

      <div className="font-normal text-sm text-dark-300">
        <span className="flex items-center cursor-pointer gap-x-2 h-[2.0625rem] border-t border-light-400 hover:text-blue-300">
          <PhantomIcon /> <span>{phantomAddress}</span>
        </span>
        <span className="flex items-center cursor-pointer gap-x-2 h-[2.0625rem] border-y border-light-400 hover:text-blue-300">
          <MetaMaskIcon />
          <span>L1Bt...9yWz</span>
        </span>
      </div>

      <div className="flex flex-col items-center gap-y-3 justify-center">
        <CustomBtn
          text="Add New Wallet"
          xtraStyles="max-w-[8.75rem] w-full h-[31px] !font-semibold !text-xs"
        />

        <CustomBtn
          text="Log out"
          btnStyle="outline-secondary"
          xtraStyles="max-w-[5.75rem] w-full h-[31px] !font-semibold !text-xs"
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default SwitchWalletModal;
