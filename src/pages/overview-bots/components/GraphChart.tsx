import { transformData } from '@utils/transformData';
import { CandleDataResp } from '@store/market/types';
import CandlestickChart from './CandlestickChart';
import CustomDatePicker from './CustomDatePicker';
import { FadeLoader } from 'react-spinners';
import CustomText from './CustomText';
import { forwardRef } from 'react';

interface IGraphChart {
  isLoading: boolean;
  className: string | undefined;
  data: CandleDataResp | undefined;
  startTimeUnix: (unix: number) => void;
  endTimeUnix: (unix: number) => void;
}

const GraphChart = forwardRef<HTMLDivElement, IGraphChart>(
  ({ isLoading, data, className, startTimeUnix, endTimeUnix }, ref) => {
    return (
      <div ref={ref} id="right" className={`w-full ${className ? className : ""}`}>
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
            <CustomDatePicker ref={ref} getUnixTimeStamp={startTimeUnix} />
            <CustomDatePicker ref={ref} getUnixTimeStamp={endTimeUnix} />
          </div>
        </div>
      </div>
    );
  }
);

export default GraphChart;
