import { robotterApi } from '@store/config';
import { CandleDataResp, CandleProps } from './types';

const instanceApi = robotterApi.injectEndpoints({
  endpoints: (builder) => ({
    getHistoricalCandles: builder.mutation<CandleDataResp, CandleProps>({
      query: (data) => ({
        method: 'POST',
        url: `/api/v1/historical-candles`,
        data,
      }),
      invalidatesTags: ['Candle'],
    }),
  }),
});

export const { useGetHistoricalCandlesMutation } = instanceApi;
