import { SetURLSearchParams, useNavigate } from 'react-router-dom';
import CustomBtn from '@components/ui/CustomBtn';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@shared/hooks/useStore';
import { useCreateInstanceMutation } from '@store/instances/api';
import useModal from '@shared/hooks/useModal';
import AppModal from '@components/ui/AppModal';
import LoginForm from '@shared/components/LoginForm';
import {
  ICardBotData,
  ICryptoStats,
  IDateTabs,
  IPerfTab,
  IStatsTableData,
  ICryptoTab,
  ITabs,
  ITimeTab,
  IChatTab,
} from '../hooks/useProfile';
import Performance from './Performance';
import CryptoStats from './CryptoStats';
import StatsTable from './StatsTable';
import Switcher from './Switcher';
import PnLChart from './PnLChart';
import LineTab from './LineTab';
import PnLineChart from './PnLineChart';

interface IOverviewProps {
  dateTabs: IDateTabs[];
  dateQuery: string;
  timeQuery: ITimeTab;
  chartTypeQuery: IChatTab;
  cryptoQuery: ICryptoTab;
  perfQuery: IPerfTab;
  timeTabs: ITabs[];
  perfTabs: ITabs[];
  cryptoTabs: ITabs[];
  chartTypeTabsB: ITabs[];
  statsData: IStatsTableData[];
  statsDataTrade: IStatsTableData[];
  statsDataOTN: IStatsTableData[];
  cryptoStats: ICryptoStats[];
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  cardBotData: ICardBotData[];
}

const Overview: React.FC<IOverviewProps> = ({
  dateTabs,
  timeTabs,
  perfTabs,
  cryptoTabs,
  dateQuery,
  cryptoQuery,
  chartTypeQuery,
  chartTypeTabsB,
  timeQuery,
  perfQuery,
  statsData,
  statsDataOTN,
  statsDataTrade,
  cryptoStats,
  cardBotData,
  searchParams,
  setSearchParams,
}) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [createInstance, { isLoading }] = useCreateInstanceMutation();
  const { address } = useAppSelector((state) => state.auth);
  const { isOpen, handleOpen, handleClose } = useModal();
  const getChartTypeQuery = searchParams.get('chart') || 'pnl';
  const navigate = useNavigate();

  const handleCreateNewModel = useCallback(async () => {
    if (!address) {
      setSearchParams({ redirectToTraining: 'true' });
      handleOpen();
      return;
    }

    try {
      await createInstance({
        strategy_name: 'test',
        strategy_parameters: {},
        market: 'string',
      }).unwrap();
      setSearchParams({ tab: 'training' });
    } catch (e) {
      console.error('Failed to create new model', e);
    }
  }, [address, createInstance, setSearchParams, handleOpen]);

  useEffect(() => {
    if (address) {
      setIsEmpty(false);
    }
  }, [address]);

  const handleSuccessfulLogin = () => {
    handleClose();
    if (searchParams.get('redirectToTraining') === 'true') {
      setSearchParams({ tab: 'training' });
    }
  };

  return (
    <>
      <div
        id="overview_header"
        className="flex flex-col md:flex-row gap-y-3 md:gap-y-3 justify-between items-center mt-5"
      >
        <h2 className="font-semibold text-2xl">
          Portfolio:{' '}
          {isEmpty ? (
            <span className="text-states">$0 (0%)</span>
          ) : (
            <span className="text-green-100">$19 349 (+20%)</span>
          )}
        </h2>
        <CustomBtn
          text="Create New Model"
          xtraStyles="max-w-[20.3125rem] w-[90%]"
          isLoading={isLoading}
          onClick={handleCreateNewModel}
        />
      </div>

      <LineTab
        keyQuery="date"
        data={dateTabs}
        query={dateQuery}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      <div className="flex flex-col xl:flex-row justify-between gap-x-4">
        <div id="left" className="w-full">
          <div className="overflow-x-auto lg:overflow-x-clip pb-2">
            <CryptoStats data={cryptoStats} isEmpty={isEmpty} />

            <div className="flex w-full h-[32px] overflow-hidden rounded-[8px] mt-4">
              {isEmpty ? (
                <div className="h-full w-full bg-light-300"></div>
              ) : (
                cryptoStats.map((data, i) => {
                  const total = cryptoStats.reduce(
                    (acc, currVal) => acc + currVal.amount,
                    0
                  );
                  const length = (data.amount / total) * 100;
                  return (
                    <div
                      key={i}
                      style={{ background: data.color, width: `${length}%` }}
                      className="block h-full"
                    />
                  );
                })
              )}
            </div>

            <div id="stats_table" className="flex gap-x-3 mt-5">
              <div className="flex flex-row md:flex-col lg:flex-row w-full gap-y-4 xl:gap-y-0 gap-x-3">
                <StatsTable
                  title="Statistics"
                  statsData={statsData}
                  isEmpty={isEmpty}
                />
                <StatsTable
                  title="Trades"
                  statsData={statsDataTrade}
                  isEmpty={isEmpty}
                />
                <StatsTable
                  title="Lock 450 OTN more to Save on FEES and COSTS"
                  statsData={statsDataOTN}
                  showBtn
                  isEmpty={isEmpty}
                />
              </div>
            </div>
          </div>

          <div id="time_tabs" className="mt-7 w-full">
            <h2 className="font-semibold text-2xl text-dark-300 mb-6">
              P&L:{' '}
              {isEmpty ? (
                <span className="text-states">$0 (0%)</span>
              ) : (
                <span className="text-green-100">+$3 909 (+20%)</span>
              )}
            </h2>

            {isEmpty ? (
              <div className='bg-light-300 w-[20.5625rem] h-[32px] rounded-[8px]'></div>
            ) : (
              <LineTab
                keyQuery="crypto"
                data={cryptoTabs}
                query={cryptoQuery}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            )}

            <div className="flex justify-between items-center mb-4 mt-6">
              <div className="max-w-[9.8125rem] w-[60%] h-[1.9375rem]">
                <Switcher
                  keyQuery="chart"
                  query={chartTypeQuery}
                  tabs={chartTypeTabsB}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                />
              </div>
              <div className="max-w-[20.25rem] w-[80%] h-[1.9375rem]">
                <Switcher
                  keyQuery="time"
                  query={timeQuery}
                  tabs={timeTabs}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                />
              </div>
            </div>

            {isEmpty ? (
              <div className="w-full h-[359px] mt-3 rounded-[8px] bg-light-300" />
            ) : (
              <div className="overflow-x-auto xl:overflow-x-clip ">
                {getChartTypeQuery === 'pnl' && (
                  <div className="w-[63.4375rem] lg:w-full">
                    <PnLChart height={359} minWidth={389} />
                  </div>
                )}
                {getChartTypeQuery === 'portfolio' && (
                  <div className="w-[63.4375rem] h-[359px] lg:w-full">
                    <PnLineChart />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Performance
          isEmpty={isEmpty}
          query={perfQuery}
          tabs={perfTabs}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          cardBotData={cardBotData}
        />
      </div>

      <AppModal
        title="Connect a wallet"
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <LoginForm onSuccessfulLogin={handleSuccessfulLogin} />
      </AppModal>
    </>
  );
};

export default Overview;
