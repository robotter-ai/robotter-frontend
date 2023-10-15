import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import dayjs, {ManipulateType, OpUnitType} from 'dayjs';
import classNames from 'classnames';
import { TrashIcon } from '@assets/icons';
import { AiOutlineLine } from 'react-icons/ai';
import { RxDotsHorizontal } from 'react-icons/rx';
import { ChartProps } from '../hooks/useTimeseriesChart';


type DatedDataEntry = {
  date: string;
  [key: string]: number;
}

const DURATION_TYPE = ['D', 'W', '1M', '3M', 'Y', 'All'];

type DurationInfo = {
  value: number;
  type: ManipulateType;
  granularity: OpUnitType;
  granularityStep: number;
};

const getDuration = (index: number): DurationInfo => {
  const mapping = [
    { value: 1, type: 'day', granularity: 'minute', granularityStep: 5 },
    { value: 1, type: 'week', granularity: 'minute', granularityStep: 15},
    { value: 1, type: 'month', granularity: 'hour', granularityStep: 1 },
    { value: 3, type: 'month', granularity: 'hour', granularityStep: 3 },
    { value: 1, type: 'year', granularity: 'day', granularityStep: 1 },
    { value: 100, type: 'year', granularity: 'day', granularityStep: 1 },
  ] as any as DurationInfo[];
  return mapping[index];
};

const findGroupByGranularity = (datedData: DatedDataEntry[][], item: any, durationInfo: DurationInfo) => {
  return datedData.find((g: any) => {
    const diff = dayjs(item.date).diff(dayjs(g[0].date), durationInfo.granularity);
    return diff <= (durationInfo.granularityStep - 1);
  });
};

const getEarlierDate = (date: any, activeDuration: number) => {
  const durationType = getDuration(activeDuration);
  return dayjs(date).subtract(durationType.value, durationType.type);
}

const DataChart: React.FC<{
  data: DatedDataEntry[];
  chart: ChartProps;
  withActions?: boolean;
  handleOpenChart?: () => void;
  handleDeleteChart?: () => void;
  isView?: boolean;
}> = ({ data, chart, withActions, handleOpenChart, handleDeleteChart, isView = false }) => {
  console.log(data)
  const [activeDuration, setActiveDuration] = useState(5);
  const durationType = getDuration(activeDuration);

  const dataDurationFilter = () => {
    const datedData: DatedDataEntry[][] = [];

    data.forEach((item) => {
      let group = findGroupByGranularity(datedData, item, durationType);
      if (group) {
        group.push(item);
      } else {
        datedData.push([item]);
      }
    });

    // Flatten the array and return
    return datedData.map((item) => item.flat()) as DatedDataEntry[];
  };

  function filterChartData(): DatedDataEntry[] {
    const data = dataDurationFilter();
    return data.filter((item) => {
      const diff = dayjs().diff(dayjs(item.date), durationType.type);
      return diff <= 1;
    }).sort((a, b) => dayjs(a.date).diff(dayjs(b.date))).reverse();
  }

  let dataToUse = filterChartData();

  useEffect(() => {
    dataToUse = filterChartData();
    console.log(dataToUse)
  }, [activeDuration]);

  const domainSize = [
    Math.min(...dataToUse.map((item) => item[chart.keys[0].name])),
    Math.max(...dataToUse.map((item) => item[chart.keys[0].name])),
  ]
  const gridWidth = Math.round(dataToUse.length / 10);
  const gridHeight = Math.round(domainSize[1] - domainSize[0]) / 10;
  console.log(gridWidth, gridHeight)
  return (
    <div className="bg-form-bg rounded-[32px] py-5 px-6">
      <div className="flex justify-between mb-7">
        {!isView ? (
          <div className="bg-[#E6EEFF] w-[232px] h-8 flex items-center justify-between rounded-full ml-[54px] p-1 px-4">
            {DURATION_TYPE.map((item, i) => (
              <p
                key={i}
                className={classNames(
                  'text-xs flex items-center justify-center rounded-full text-center h-6 w-6 cursor-pointer',
                  {
                    'bg-white': i === activeDuration,
                  }
                )}
                onClick={() => setActiveDuration(i)}
              >
                {item}
              </p>
            ))}
          </div>
        ): null}
        {withActions ? (
          <div className="flex gap-2">
            <div
              className="bg-white p-2 flex items-center rounded-full cursor-pointer"
              onClick={handleDeleteChart}
            >
              <TrashIcon />
            </div>
            <div
              className="bg-white p-2 flex items-center rounded-full cursor-pointer"
              onClick={handleOpenChart}
            >
              <RxDotsHorizontal />
            </div>
          </div>
        ) : null}
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={dataToUse} margin={{ left: -2 }}>
          <defs>
            {chart.keys.map((item, idx: number) => (
              <linearGradient
                key={idx}
                id={`color${item.name}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={item.color} stopOpacity={0.5} />
                <stop offset="95%" stopColor={item.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {isView ? null : (
            <XAxis axisLine={false} tickLine={false} dataKey="date" />
          )}
          {isView ? null : (
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(number) => (number === 0 ? '' : number)}
              domain={domainSize}
            />
          )}
          <CartesianGrid opacity={0.8} stroke="#C8CCCD" strokeDasharray="3 3"
          verticalCoordinatesGenerator={(props) =>
            props.width > 450 ? [150, 300, 450] : [200, 400]
          }
          />
          {!isView ? (
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                padding: '10px',
              }}
              cursor={{ stroke: '#C8CCCD', strokeWidth: 1 }}
              formatter={(value, name) => [value, name]}
            />
          ) : null}
          {chart.keys.map((item, idx: number) => (
            <Area
              key={idx}
              type="linear"
              dataKey={item.name}
              stroke={item.color}
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#color${item.name})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-5 overflow-x-auto ml-[54px]">
        {chart.keys.map((item, idx: number) => (
          <div key={idx} className="flex items-center gap-1">
            <AiOutlineLine color={item.color} />
            <p className="text-xs whitespace-nowrap">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(DataChart);
