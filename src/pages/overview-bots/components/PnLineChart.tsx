import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  profit: number;
  investment: number;
}

const data = [
  { date: '30.08', profit: 2000, investment: 5000 },
  { date: '31.08', profit: 3000, investment: 5200 },
  { date: '01.09', profit: 2500, investment: 5300 },
  { date: '02.09', profit: 4000, investment: 5500 },
  { date: '03.09', profit: 4500, investment: 6000 },
  { date: '04.09', profit: 5200, investment: 6500 },
  { date: '05.09', profit: 5600, investment: 7000 },
  { date: '06.09', profit: 5900, investment: 7800 },
  { date: '07.09', profit: 5000, investment: 8500 },
  { date: '08.09', profit: 7000, investment: 9000 },
  { date: '09.09', profit: 7500, investment: 9700 },
  { date: '10.09', profit: 8000, investment: 10500 },
  { date: '11.09', profit: 8500, investment: 11200 },
  { date: '12.09', profit: 9000, investment: 11800 },
  { date: '13.09', profit: 9500, investment: 12500 },
  { date: '14.09', profit: 10000, investment: 13000 },
  { date: '15.09', profit: 11000, investment: 14000 },
  { date: '16.09', profit: 12000, investment: 15000 },
  { date: '17.09', profit: 13000, investment: 16000 },
  { date: '18.09', profit: 14000, investment: 17000 },
  { date: '19.09', profit: 15000, investment: 18000 },
  { date: '20.09', profit: 16000, investment: 19000 },
  { date: '21.09', profit: 17000, investment: 20000 },
  { date: '22.09', profit: 18000, investment: 21000 },
];

const getGradientStops = (data: DataPoint[]) => {
  const stops = data.map((point, index) => {
    if (index === 0) return { offset: '0%', color: '#A3E5C8' };
    const previous = data[index - 1];
    return {
      offset: `${(index / (data.length - 1)) * 100}%`,
      color: point.profit >= previous.profit ? '#A3E5C8' : '#FFAFB2',
    };
  });
  return stops;
};

const ProfitLossChart: React.FC = () => {
  const gradientStops = getGradientStops(data);

  const formatYAxis = (value: number) =>
    `$${value.toLocaleString('en-US').replace(/,/g, ',')}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
            {gradientStops.map((stop, index) => (
              <stop key={index} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="date"
          axisLine={{ stroke: '#DBD8E0' }}
          tickLine={{ stroke: '#DBD8E0' }}
          tick={{ fontSize: 12, fill: '#65636D' }}
          padding={{ left: 30, right: 10 }}
        />
        <YAxis
          axisLine={false}
          tickCount={9}
          interval={0}
          tickFormatter={formatYAxis}
          tickMargin={10}
          tickLine={{ stroke: '#DBD8E0' }}
          tick={{ fontSize: 12, fill: '#65636D' }}
        />
        <Tooltip
          formatter={(value) =>
            `$${(value as number).toLocaleString('en-US').replace(/,/g, ' ')}`
          }
        />

        {/* Use a single Line with gradient stroke */}
        <Line
          type="monotone"
          dataKey="profit"
          stroke="url(#colorGradient)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="investment"
          stroke="#1F609C"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProfitLossChart;
