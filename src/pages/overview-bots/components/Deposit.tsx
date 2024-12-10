import React, { useCallback, useMemo, useState } from 'react';
import TextInput from '@components/form/TextInput';
import CustomBtn from '@components/ui/CustomBtn';
import CustomDropdown from './CustomDropdown';
import { useTransactions } from '@shared/hooks/useTransaction';

interface ExchangeOption {
    label: string;
    value: string;
  }
  
  interface DepositProps {
    exchanges: ExchangeOption[];
  }
  
  interface DepositInfo {
    tradingDays: number;
    solanaFees: string;
  }

  const SOLANA_FEE_PER_DAY = 0.1;

const Deposit: React.FC<DepositProps> = ({ exchanges }) => {
  const [solAmount, setSolAmount] = useState(0);
  const [usdcAmount, setUsdcAmount] = useState(0);
  const [endDate, setEndDate] = useState<string>('');
  const { deposit } = useTransactions();

  const handleDeposit = async () => {
      await deposit({
        balanceA: solAmount,
        balanceB: usdcAmount,
        feesAmount: depositInfo.solanaFees,
        mintA: 'SOL',
        mintB: 'USDC',
      });
  };

  const depositInfo = useMemo<DepositInfo>(() => {
    if (!endDate) {
      return {
        tradingDays: 0,
        solanaFees: '0.00'
      };
    }

    const end = new Date(endDate);
    const start = new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const tradingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const solanaFees = (tradingDays * SOLANA_FEE_PER_DAY).toFixed(2);

    return {
      tradingDays,
      solanaFees
    };
  }, [endDate]); // Only recalculate when endDate changes

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEndDate(e.target.value);
  }, []);
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      {/* Form Section - 70% width on desktop */}
      <div className="w-full lg:w-[70%] space-y-8">
        {/* Exchange and Trading Time in same row */}
        <h2 className="text-xl mb-4">Deposit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-2">Exchange</label>
            <CustomDropdown
              options={exchanges}
              onSelect={(value) => console.log(value)}
              placeholder="Select Exchange"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">End Date of Trading</label>
            <TextInput
              type="date"
              placeholder="dd/mm/yyyy"
              value={endDate}
              onChange={handleDateChange}
            />
          </div>
        </div>

        {/* Deposit Form */}
        <div>
          <div className="space-y-6">
            {/* SOL Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block">Coin</label>
                <CustomDropdown
                  options={[{ label: 'SOL', value: 'SOL' }]}
                  onSelect={(value) => console.log(value)}
                  placeholder="SOL"
                  disabled={true}
                />
              </div>
              <div>
                <label className="mb-2 block">Amount</label>
                <TextInput
                  type="number"
                  value={solAmount}
                  onChange={(e) => setSolAmount(Number(e.target.value))}
                  placeholder="Amount"
                />
              </div>
            </div>

            {/* USDC Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block">Coin</label>
                <CustomDropdown
                  options={[{ label: 'USDC', value: 'USDC' }]}
                  onSelect={(value) => console.log(value)}
                  placeholder="USDC"
                  disabled={true}
                />
              </div>
              <div>
                <label className="mb-2 block">Amount</label>
                <TextInput
                  type="number"
                  value={usdcAmount}
                  onChange={(e) => setUsdcAmount(Number(e.target.value))}
                  placeholder="Amount"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Info Card */}
      <div className="w-full lg:w-[30%] space-y-4">
        <CustomBtn
          text="Deposit & Start"
          className="w-full bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600 transition-colors"
          onClick={handleDeposit}
        />
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-lg">Deposit Info</h3>
              <div className="space-y-1 text-gray-600">
              <p>Number of trading days: {depositInfo.tradingDays}</p>
              <p>Solana fees: ${depositInfo.solanaFees}</p>
                <p>SOL: {solAmount}</p>
                <p>USDC: {usdcAmount}</p>
              </div>
            </div>
          </div>
        </div>      
      </div>
    </div>
  );
};

export default Deposit;