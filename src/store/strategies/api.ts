import { robotterApi } from '@store/config';

const strategiesApi = robotterApi.injectEndpoints({
  endpoints: (builder) => ({
    getStrategies: builder.query<Record<string, Record<string, any>>, void>({
      query: () => ({
        url: '/api/v1/strategies',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetStrategiesQuery } = strategiesApi;