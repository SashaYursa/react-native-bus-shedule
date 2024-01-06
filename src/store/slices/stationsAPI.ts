import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IBusRoute, IBusStations, ISheduleItem} from '../types';
import {Socket, io} from 'socket.io-client';

interface addBusLocation {
  id: number;
  latitude: number;
  longitude: number;
}

export const stationApi = createApi({
  reducerPath: 'stationsApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.108:3000/'}),
  tagTypes: ['route'],
  endpoints: build => ({
    getStations: build.query<IBusStations[], void>({
      query: () => '/busStations/tablo',
    }),
    getShedule: build.query<ISheduleItem[], number>({
      query: (id: number) => `/shedule/${id}`,
      async onCacheEntryAdded(
        id,
        {updateCachedData, cacheDataLoaded, cacheEntryRemoved},
      ) {
        await cacheDataLoaded;
        const socket: Socket = io('http://192.168.0.108:3000');
        //@ts-ignore
        socket.emit('getShedule', id, res => {
          console.log('update', res);
          updateCachedData(draft => res);
        });
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getRoute: build.query<IBusRoute, number>({
      query: (busId: number) => `/routes/${busId}`,
      providesTags: ['route'],
    }),
    addBusStationLocation: build.mutation<string, addBusLocation>({
      query: ({id, ...data}: addBusLocation) => ({
        url: `/busStations/${id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['route'],
    }),
    updateBusStationPoint: build.mutation<string, addBusLocation>({
      query: ({id, ...data}: addBusLocation) => ({
        url: `/routes/point/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['route'],
    }),
  }),
});

export const {
  useGetStationsQuery,
  useGetSheduleQuery,
  useGetRouteQuery,
  useAddBusStationLocationMutation,
  useUpdateBusStationPointMutation,
} = stationApi;
