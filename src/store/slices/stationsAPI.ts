import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IBusStations} from '../types';

export const stationApi = createApi({
  reducerPath: 'stationsApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.105:3000/'}),
  endpoints: build => ({
    getStations: build.query<IBusStations[], void>({
      query: () => '/busStations',
    }),
    // getShedule: build.query<any, void>({
    //   query: () => '/shedule/22',
    // }),
  }),
});

export const {useGetStationsQuery} = stationApi;
