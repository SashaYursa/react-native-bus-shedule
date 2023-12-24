import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IBusStations, ISheduleItem} from '../types';

export const stationApi = createApi({
  reducerPath: 'stationsApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.105:3000/'}),
  endpoints: build => ({
    getStations: build.query<IBusStations[], void>({
      query: () => '/busStations',
    }),
    getShedule: build.query<ISheduleItem[], number>({
      query: (id: number) => `/shedule/${id}`,
    }),
  }),
});

export const {useGetStationsQuery, useGetSheduleQuery} = stationApi;
