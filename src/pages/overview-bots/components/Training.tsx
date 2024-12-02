import { strategiesConfigData as config } from '../../../utils/strategyConfigData';
import {
  ArrowDown2Icon,
  ArrowUp2Icon,
  MangoLogo,
  SolanaLogo,
  USDCLogo,
} from '@assets/icons';
import { useGetHistoricalCandlesMutation } from '@store/market/api';
import { defaultType } from '../../../utils/defaultType.util';
import { transformData } from '../../../utils/transformData';
import { updateDefaults } from '../../../utils/updateDefault';
import { SetURLSearchParams } from 'react-router-dom';
import CandlestickChart from './CandlestickChart';
import CustomDatePicker from './CustomDatePicker';
import CustomBtn from '@components/ui/CustomBtn';
import CustomDropdown from './CustomDropdown';
import GroupedConfig from './GroupedConfig';
import { FadeLoader } from 'react-spinners';
import ButtonList from './ButtonList';
import CustomText from './CustomText';
import Pagination from './Pagination';
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ICardBotData,
  IDepositInfo,
  IResultStrat,
  ITabs,
  ITimeTab,
} from '../hooks/useProfile';
import Stepper from './Stepper';
import Switcher from './Switcher';
import CardBot from './CardBot';
import GoBack from './GoBack';
import LineTab from './LineTab';
import CustomInput from '@components/ui/CustomInput';

export interface ITrainingProps {
  timeQuery: ITimeTab;
  resultStatTab: ITabs[];
  timeTabs: ITabs[];
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  cardBotData: ICardBotData[];
  resultStatQuery: IResultStrat;
  bigStatTable: string[][];
  bigResultTable: string[][];
  depositInfo: IDepositInfo[];
}

interface ValueType {
  [key: string]: number | string | boolean;
}

const Training: React.FC<ITrainingProps> = ({
  timeQuery,
  resultStatQuery,
  bigStatTable,
  bigResultTable,
  resultStatTab,
  timeTabs,
  searchParams,
  setSearchParams,
  cardBotData,
  depositInfo,
}) => {
  const [historicalCandlesData, { isLoading, data, error }] =
    useGetHistoricalCandlesMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [cfgName, setCfgName] = useState('supertrendconfig');
  const getReStatQuery = searchParams.get('resultStat') || 'result';
  const strategiesOpt = Object.keys(config).map((key) => ({
    label: key,
    value: key,
  }));
  const updateConfig = updateDefaults(config, cfgName);
  const valueArr = Object.keys(updateConfig[cfgName]).map((key) => {
    const cfgD = config[cfgName][key].default;
    return [key, cfgD];
  });
  const [advancedSettingsOpen, setAdancedSettingsOpen] = useState(false);
  const [value, setValue] = useState<ValueType>(Object.fromEntries(valueArr));
  const [tradePair, setTradePair] = useState('SOL/BNB');
  const [timeStamp, setTimeStamp] = useState({
    startTime: 1727771877,
    endTime: 1728376677,
    endDate: 0,
  });
  const [coinValue, setCoinValue] = useState<{ [key: string]: string }>({
    SOL: '',
    USDC: '',
  });

  const uniqueGroups = Array.from(
    new Set(Object.values(config[cfgName]).map((item) => item.group))
  );

  const solData = [
    { name: 'SOL/USDC', isChecked: true },
    { name: 'SOL/BNB', isChecked: true },
    { name: 'SOL/JUP', isChecked: false },
  ];

  const options = [
    { label: 'Mango Markets', value: '1' },
    { label: 'Binance', value: '2' },
    { label: 'Cube', value: '3' },
    { label: 'XRP Ledger', value: '4' },
    { label: 'Kujira', value: '5' },
    { label: 'Polka DEX', value: '6' },
    { label: 'Uniswap', value: '7' },
  ];

  const toggleAdancedSettingsOpen = () =>
    setAdancedSettingsOpen((prevState) => !prevState);

  const handleSelect = (value: string) => {
    const valueArr = Object.keys(config[value]).map((key) => {
      const cfgd = config[value][key].default;
      const cfgT = defaultType(config[value][key].type);
      return [key, cfgd ? cfgd : cfgT];
    });
    setValue({ ...Object.fromEntries(valueArr), trading_pair: tradePair });
    setCfgName(value);
  };

  const getTradePair = (pair: string) => {
    setTradePair(pair);
    setValue((prevState) => ({ ...prevState, trading_pair: pair }));
  };

  const handleOnRangeChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = evt.target;
    setValue((prevState) => ({ ...prevState, [name]: +value }));
  };

  const handleOnInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = evt.target;
    setValue((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleOnCoinInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = evt.target;
    if (!/^\d*$/.test(value)) return;
    setCoinValue((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleOnToggle = (isOn: boolean, key: string) => {
    setValue((prevState) => ({ ...prevState, [key]: isOn }));
  };

  const handleNextStep = () => {
    if (currentStep === 3) return;
    setCurrentStep((prevState) => prevState + 1);
  };

  const handlePrevStep = () => {
    if (currentStep === 1) return;
    setCurrentStep((prevState) => prevState - 1);
  };

  const startTimeUnix = (unix: number) => {
    setTimeStamp((prevState) => ({ ...prevState, startTime: unix }));
  };

  const endTimeUnix = (unix: number) => {
    setTimeStamp((prevState) => ({ ...prevState, endTime: unix }));
  };

  const endDateUnix = (unix: number) => {
    setTimeStamp((prevState) => ({ ...prevState, endDate: unix }));
  };

  const handleCandleData = useCallback(async () => {
    try {
      await historicalCandlesData({
        connector_name: 'birdeye',
        trading_pair: tradePair,
        market_address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
        interval: '15m',
        start_time: timeStamp.startTime,
        end_time: timeStamp.endTime,
      });
    } catch (error) {
      console.log('TRY CATCH ERROR => ', error);
    }
  }, [tradePair, timeStamp]);

  useEffect(() => {
    handleCandleData();
  }, [tradePair, timeStamp]);

  const disabled =
    currentStep === 3 ?
    Object.values(coinValue).some((num) => num === '' || +num <= 0) ||
    timeStamp.endDate === 0 : false;

  return (
    <div ref={parentRef}>
      <p className="text-dark-100 text-[0.625rem] text-left mt-8 ml-1">
        Training / SOL Big Brain / Backtest
      </p>
      <div
        id="training_header"
        className={`flex flex-col md:flex-row gap-y-12 md:gap-y-3 justify-between items-center ${
          currentStep >= 4 ? 'mt-[0.55rem]' : 'mt-[-3px]'
        }`}
      >
        <div className="flex flex-col md:flex-row gap-y-4 lg:gap-y-0 md:gap-x-3 w-full">
          <GoBack onClick={handlePrevStep} disabled={currentStep <= 1} />
          <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />
        </div>

        <CustomBtn
          text={`${
            currentStep === 1
              ? 'Run Backtest'
              : currentStep === 2
              ? 'Save Strategy'
              : 'Deposit & Start'
          }`}
          disabled={disabled}
          xtraStyles={`!max-w-[20.3125rem] !w-full`}
          onClick={handleNextStep}
        />
      </div>
      {currentStep == 1 || currentStep == 2 ? (
        <div className="flex items-center justify-between mt-8 mb-6 flex-wrap gap-y-4 md:gap-y-0">
          <h2 className="font-semibold text-2xl text-dark-300">
            {`Backtest ${
              currentStep === 1
                ? 'strategy'
                : currentStep === 2
                ? 'results'
                : ''
            }`}
          </h2>
          <div className="max-w-[20.3125rem] w-[80%] h-[1.9375rem]">
            <Switcher
              keyQuery="time"
              query={timeQuery}
              tabs={timeTabs}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
        </div>
      ) : null}
      <div
        id="main"
        className="flex flex-col lg:flex-row justify-between gap-y-8 lg:gap-y-0 lg:gap-x-4"
      >
        <div id="left" className="w-full">
          {currentStep == 1 || currentStep == 2 ? (
            <div>
              <p className="uppercase text-xs font-semibold text-dark-200 mb-5">
                {currentStep == 1
                  ? 'Adjust settings for each trading pair separately'
                  : 'Click on Trading Pair to view the Results of the backtest'}
              </p>
              <ButtonList btnData={solData} getTradePair={getTradePair} />
            </div>
          ) : null}

          {currentStep == 1 ? (
            <div id="sliders_n_dropdowns" className="mt-6">
              <div className="grid grid-cols-2 gap-x-5 gap-y-6 mb-6">
                <div id="COL 1" className="col-span-2 md:col-auto">
                  <CustomText
                    text="Exchange"
                    toolTipWidth="w-[8rem]"
                    xtraStyle="mb-4 font-semibold text-xs uppercase"
                  />
                  <CustomDropdown options={options} onSelect={() => {}} />
                </div>
                <div id="COL 2" className="col-span-2 md:col-auto">
                  <CustomText
                    text="Select Trading Strategy"
                    toolTipWidth="w-[8rem]"
                    xtraStyle="mb-4 font-semibold text-xs uppercase"
                  />
                  <CustomDropdown
                    options={strategiesOpt}
                    showTooTip
                    onSelect={handleSelect}
                  />
                </div>
              </div>

              <div>
                <GroupedConfig
                  ref={parentRef}
                  uniqueGroups={uniqueGroups}
                  config={config}
                  cfgName={cfgName}
                  value={value}
                  handleOnInputChange={handleOnInputChange}
                  handleOnRangeChange={handleOnRangeChange}
                  handleOnToggle={handleOnToggle}
                />
                <div
                  className="flex gap-x-2 items-center cursor-pointer bg-light-300 px-4 w-full h-[1.9375rem] rounded-lg border border-light-400 text-xs font-normal text-navy transition-all duration-300 hover:border-navy mt-5 mb-8"
                  onClick={toggleAdancedSettingsOpen}
                >
                  {advancedSettingsOpen ? (
                    <ArrowUp2Icon width={10} height={5} />
                  ) : (
                    <ArrowDown2Icon width={10} height={5} />
                  )}
                  <span>Advanced settings</span>
                </div>
              </div>
            </div>
          ) : currentStep == 2 ? (
            <div>
              <LineTab
                keyQuery="resultStat"
                data={resultStatTab}
                query={resultStatQuery}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />

              <div id="table" className="mt-6">
                {(getReStatQuery === 'result'
                  ? bigResultTable
                  : bigStatTable
                ).map((col, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-2 gap-4 border-b border-light-400 text-sm py-2 ${
                      i === 0 ? 'border-t' : ''
                    }`}
                  >
                    <CustomText
                      text={col[0]}
                      xtraStyle="text-left text-dark-200"
                      hasQuestionMark={
                        getReStatQuery === 'result' && i !== 0 && i !== 7
                      }
                      toolTipWidth="w-28"
                    />
                    <p
                      className={`text-right text-dark-300 ${
                        getReStatQuery === 'result'
                          ? i === 1 || i === 2
                            ? 'text-green-100'
                            : i === 3
                            ? 'text-red-100'
                            : ''
                          : ''
                      } flex gap-x-2 justify-end`}
                    >
                      {col[1]}
                    </p>
                  </div>
                ))}
              </div>

              <CustomBtn
                text="Edit Strategy"
                btnStyle="outline-primary"
                xtraStyles="!max-w-[7.75rem] !h-[1.9375rem] w-full !text-xs mt-6"
              />
            </div>
          ) : currentStep == 3 ? (
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
          ) : null}
        </div>

        {/* Only show chat when on step 1 and 2 */}
        {currentStep == 1 || currentStep == 2 ? (
          <div ref={parentRef} id="right" className="w-full">
            <div className="h-[500px] relative">
              {isLoading ? (
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 inset-x-auto">
                  <FadeLoader color="#65636D" />
                </div>
              ) : (
                <CandlestickChart
                  height={500}
                  data={data ? transformData(data.data) : []}
                />
              )}
            </div>

            <div>
              <CustomText
                text="timespan for the Backtest"
                xtraStyle="mb-5 mt-7 font-semibold text-xs uppercase"
              />
              <div className="flex flex-col md:flex-row justify-between gap-y-4 md:gap-y-0 md:gap-x-4">
                <CustomDatePicker
                  ref={parentRef}
                  getUnixTimeStamp={startTimeUnix}
                />
                <CustomDatePicker
                  ref={parentRef}
                  getUnixTimeStamp={endTimeUnix}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div>
        {currentStep === 1 && (
          <>
            {advancedSettingsOpen && (
              <GroupedConfig
                ref={parentRef}
                hasOtherGroup
                uniqueGroups={uniqueGroups}
                config={config}
                cfgName={cfgName}
                value={value}
                handleOnInputChange={handleOnInputChange}
                handleOnRangeChange={handleOnRangeChange}
                handleOnToggle={handleOnToggle}
              />
            )}

            <CustomBtn
              text="Select Optimal Strategy"
              btnStyle="outline-primary"
              xtraStyles="!max-w-[11.625rem] !h-[1.9375rem] w-full !text-xs"
            />
          </>
        )}
      </div>

      {currentStep == 1 || currentStep == 2 ? (
        <>
          <div className="mt-[2.5rem]">
            <h1 className="font-semibold text-2xl text-dark-300">
              Previous backtests strategies with the model
            </h1>

            {/* CardBot */}
            <div className="mt-4 gap-x-5 justify-between overflow-x-auto flex lt:flex-col flex-row">
              {cardBotData.map((item, idx) => (
                <CardBot
                  isEmpty={false}
                  key={idx}
                  cardBotData={item}
                  xtraStyle="lt:flex-auto flex-none xl:flex-auto"
                />
              ))}
            </div>
          </div>

          <div className="md:w-[20rem] h-[1.9375rem] mx-auto">
            <Pagination />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Training;
