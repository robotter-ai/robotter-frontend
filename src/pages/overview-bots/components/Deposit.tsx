import React, { useCallback, useMemo, useState, Fragment } from 'react';
import TextInput from '@components/form/TextInput';
import CustomBtn from '@components/ui/CustomBtn';
import CustomDropdown from './CustomDropdown';
import CustomText from './CustomText';
import { MangoLogo, SolanaLogo, USDCLogo } from '@assets/icons';
import CustomInput from '@components/ui/CustomInput';
import CustomDatePicker from './CustomDatePicker';
import { IDepositInfo } from '../hooks/useProfile';

interface ExchangeOption {
  label: string;
  value: string;
}

interface DepositProps {
  exchanges: ExchangeOption[];
  depositInfo: IDepositInfo[];
  endDateUnix: (unix: number) => void;
  coinValue: { [key: string]: string };
  handleOnCoinInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FeesInfo {
  tradingDays: number;
  solanaFees: string;
}

const SOLANA_FEE_PER_DAY = 0.1;

const Deposit: React.FC<DepositProps> = ({ 
  exchanges, 
  depositInfo, 
  endDateUnix, 
  coinValue, 
  handleOnCoinInputChange 
}) => {
  return (
    <div className="mt-14 flex justify-between flex-wrap">
      <div id="left">
        <div className="grid grid-cols-2 gap-x-6">
          <div className="w-[20.3125rem]">
            <h1 className="mb-7 font-semibold text-dark-300 text-2xl">
              Connect exchange
            </h1>
            <CustomText
              text="Exchange"
              toolTipWidth="w-[14rem]"
              toolTipText={`Robotter need an exchange to trade.`}
              xtraStyle="mb-4 font-semibold text-xs uppercase"
            />
            <CustomInput
              icon={<MangoLogo />}
              disabled
              defaultValue={'Mango Market'}
            />
          </div>

          <div className="w-[20.3125rem]">
            <h1 className="mb-7 font-semibold text-dark-300 text-2xl">
              Trading time limit
            </h1>
            <CustomText
              text="End date of trading"
              toolTipWidth="w-[14rem]"
              toolTipText={`Select the date when trading will stop. Trading duration impacts Compute expenses and Solana fees.`}
              xtraStyle="mb-4 font-semibold text-xs uppercase"
            />
            <CustomDatePicker getUnixTimeStamp={endDateUnix} isEmpty />
          </div>
        </div>

        <h1 className="mt-7 mb-5 font-semibold text-dark-300 !text-2xl">
          Deposit both coins to start
        </h1>

        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          {[
            { icon: <SolanaLogo />, text: 'SOL' },
            { icon: <USDCLogo />, text: 'USDC' },
          ].map(({ icon, text }, idx) => (
            <Fragment key={idx}>
              <div className="w-full max-w-[20.3125rem]">
                <CustomText
                  text="Coin"
                  hasQuestionMark={false}
                  xtraStyle="mb-3 font-semibold text-xs uppercase"
                />
                <CustomInput icon={icon} disabled defaultValue={text} />
              </div>
              <div className="w-full max-w-[20.3125rem]">
                <CustomText
                  text="Amount"
                  hasQuestionMark={false}
                  xtraStyle="mb-3 font-semibold text-xs uppercase"
                />
                <CustomInput
                  type="number"
                  placeholder="0"
                  name={text}
                  value={coinValue[text]}
                  onChange={handleOnCoinInputChange}
                  min="0"
                  step="any"
                />
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      <div
        id="right"
        className="max-w-[20.3125rem] w-full bg-light-300 rounded-[22px] p-6 h-fit"
      >
        <h1 className="mb-7 font-semibold text-blue-400 text-xs text-center uppercase">
          Deposit Info
        </h1>

        <div id="table" className="grid grid-cols-[auto_6.2rem]">
          {depositInfo.map(({ l, r, icon }, i) => (
            <Fragment key={i}>
              <span
                className={`font-normal text-sm text-dark-200 text-left ${
                  i == 0 ? 'border-t' : 'border-y'
                } p-[0.5rem] border-white`}
              >
                {l}
              </span>
              <span
                className={`flex items-center justify-end gap-x-2 font-normal text-sm text-dark-300 text-right ${
                  i == 0 ? 'border-t' : 'border-y'
                } p-[0.5rem] border-white ${
                  depositInfo.length === i + 1
                    ? 'text-base font-medium'
                    : ''
                }`}
              >
                {r} {icon && icon}
              </span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deposit;