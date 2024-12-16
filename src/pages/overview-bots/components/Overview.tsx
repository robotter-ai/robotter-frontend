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
  ITimeBTab,
} from '../hooks/useProfile';
import Performance from './Performance';
import CryptoStats from './CryptoStats';
import StatsTable from './StatsTable';
import Switcher from './Switcher';
import PnLChart from './PnLChart';
import LineTab from './LineTab';
import PnLineChart from './PnLineChart';
import { truncateText } from '@utils/truncateText.util';

interface IOverviewProps {
  dateTabs: IDateTabs[];
  dateQuery: string;
  timeBQuery: ITimeBTab;
  chartTypeQuery: IChatTab;
  cryptoQuery: ICryptoTab;
  perfQuery: IPerfTab;
  timeBTabs: ITabs[];
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
  timeBTabs,
  perfTabs,
  cryptoTabs,
  dateQuery,
  cryptoQuery,
  chartTypeQuery,
  chartTypeTabsB,
  timeBQuery,
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
        <div>
          <p className="text-dark-100 text-[0.625rem] mb-1">Overview</p>
          <h2 className="font-semibold text-2xl">
            Portfolio:{' '}
            {isEmpty ? (
              <span className="text-states">$0 (0%)</span>
            ) : (
              <span className="text-green-100">$19 349 (+20%)</span>
            )}
          </h2>
        </div>

        <CustomBtn
          text="Create New Model"
          xtraStyles="max-w-[20.3125rem] w-[90%]"
          isLoading={isLoading}
          onClick={handleCreateNewModel}
        />
      </div>

      <div className="flex flex-col xl:flex-row justify-between gap-x-4">
        <div id="left" className="w-full">
          <div className="overflow-x-auto lg:overflow-x-clip pb-2">
            <div className="flex w-full h-[49px] overflow-hidden rounded-[8px] mt-4">
              {isEmpty ? (
                <div className="h-full w-full bg-light-250 flex justify-center items-center text-xs font-medium text-dark-200 uppercase">
                  Portfolio
                </div>
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
                      className="h-full px-3 flex items-center"
                    >
                      <div>
                        <p className="text-dark-200 text-xs font-medium uppercase">
                          {`${
                            data.percentage <= 5
                              ? truncateText(data.tag, 3)
                              : data.tag
                          }`}
                        </p>
                        <p className="text-[0.8125rem] font-normal mt-[-2px] font-ubuntumono">{`${
                          data.percentage <= 5
                            ? truncateText(
                                `$${data.amount} (${data.percentage}%)`,
                                3
                              )
                            : `$${data.amount} (${data.percentage}%)`
                        }`}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <LineTab
              keyQuery="date"
              data={dateTabs}
              query={dateQuery}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />

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
                  title="Costs"
                  statsData={statsDataOTN}
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

            <div className="max-w-[9.8125rem] w-[60%] h-[1.9375rem]">
              <Switcher
                keyQuery="chart"
                query={chartTypeQuery}
                tabs={chartTypeTabsB}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </div>

            <div className="flex justify-between items-center mb-4 mt-6">
              {isEmpty ? (
                <div className="bg-light-250 w-[20.5625rem] h-[23px] rounded-[8px]"></div>
              ) : (
                <LineTab
                  keyQuery="crypto"
                  data={cryptoTabs}
                  query={cryptoQuery}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                />
              )}
              <div className="max-w-[15.6875rem] w-[80%] h-[1.9375rem]">
                <Switcher
                  keyQuery="timeb"
                  query={timeBQuery}
                  tabs={timeBTabs}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                />
              </div>
            </div>

            {isEmpty ? (
              <div className="flex justify-center items-center w-full h-[395px] mt-3 rounded-[8px] bg-light-250 font-medium text-xs text-dark-200">
                P&L CHART
              </div>
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
