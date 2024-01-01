import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IBusRoute, IBusStations, ISheduleItem} from '../types';

export const stationApi = createApi({
  reducerPath: 'stationsApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.108:3000/'}),
  endpoints: build => ({
    getStations: build.query<IBusStations[], void>({
      query: () => '/busStations/tablo',
    }),
    getShedule: build.query<ISheduleItem[], number>({
      query: (id: number) => `/shedule/${id}`,
      keepUnusedDataFor: 5,
    }),
    getRoute: build.query<IBusRoute, number>({
      query: (busId: number) => `/routes/${busId}`,
    }),
  }),
});

export const {useGetStationsQuery, useGetSheduleQuery, useGetRouteQuery} =
  stationApi;
