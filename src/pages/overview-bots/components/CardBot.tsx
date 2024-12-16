import { UpIcon, DownIcon, BotIcon } from '@assets/icons';
import classNames from 'classnames';
import React from 'react';
import CustomBtn from '@components/ui/CustomBtn';
import MiniLineChart from './MiniLineChart';
import CustomPieChart from './CustomPieChart';
import { ICardBotData } from '../hooks/useProfile';

interface ICardBotProps {
  cardBotData: ICardBotData;
  xtraStyle?: string;
  isEmpty: boolean;
  showSideColor?: boolean;
}

const CardBot: React.FC<ICardBotProps> = ({
  cardBotData,
  xtraStyle,
  isEmpty,
  showSideColor,
}) => {
  return (
    <div
      id="card_bot"
      style={{ background: !isEmpty ? cardBotData.color : '' }}
      className={`relative lt:w-full lt:max-w-max max-w-[20.3125rem] w-full h-[11.9375rem] rounded-[22px] border border-light-250 mb-4 overflow-hidden ${
        xtraStyle || ''
      } ${isEmpty ? 'bg-light-250 border-light-250' : ''} ${
        showSideColor ? 'pl-2' : ''
      }`}
    >
      {isEmpty ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex flex-col items-center">
            <BotIcon />
            <p className="text-dark-200 text-xs font-medium mt-2">
              CREATE NEW BOT
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-light-250 p-4 rounded-[15px] h-full w-full">
          <div id="table">
            {cardBotData.tableData.map((row, i) => (
              <div key={i} id="row" className="grid grid-cols-6 gap-x-2 mb-2">
                {i === 0 && (
                  <>
                    <h2 className="text-xs col-span-2 font-bold text-dark-300 mb-3">
                      {cardBotData.name}
                    </h2>

                    <div className="mb-3 col-span-3">
                      <div className="flex">
                        <div id="P&L">
                          <h2
                            className={classNames(
                              'text-xs font-semibold text-green-100 m-0',
                              { 'text-red-100': !cardBotData.isPositive }
                            )}
                          >
                            {`${cardBotData.isPositive ? '+' : '-'} $${
                              cardBotData.rate
                            }`}
                          </h2>
                          <p className="text-[0.625rem] whitespace-nowrap text-dark-200 m-0">
                            P&L, last 24h
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 flex justify-end">
                      <CustomBtn
                        text="View"
                        size="sm"
                        btnStyle="outline-primary"
                        xtraStyles="max-w-[2.75rem]"
                      />
                    </div>
                  </>
                )}

                <div id="col1" className="flex-1 col-span-2">
                  <h2 className="text-[0.8125rem] text-dark-300 font-ubuntumono font-normal">
                    {row.labelA[0]}
                  </h2>
                  <p className="text-[0.625rem] text-dark-200 mt-0 leading-none">
                    {row.labelA[1]}
                  </p>
                </div>

                <div
                  id="col2"
                  className="items-center gap-x-2 flex-1"
                >
                  <div>
                    <h2 className="text-[0.8125rem] font-ubuntumono font-normal text-dark-300 whitespace-nowrap">{row.labelB[0]}</h2>
                    <p className="text-[0.625rem] text-dark-200 mt-[-2px] whitespace-nowrap">
                      {row.labelB[1]}
                    </p>
                  </div>
                </div>

                {i === 0 && (
                  <div className="absolute right-3 top-[4.5rem]">
                    <CustomPieChart
                      isEmpty={isEmpty}
                      size={86}
                      innerRadius={35}
                      outerRadius={42}
                      hasStroke={false}
                      cryptoStats={cardBotData.pieChartData}
                      label={
                        <>
                          <h1 className="font-bold text-[1.25rem] text-center text-dark-300">
                            {cardBotData.pieChartData[0].amount}%
                          </h1>
                          <p className="font-normal text-[0.625rem] text-center text-dark-100">
                            Accuracy
                          </p>
                        </>
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardBot;
