import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  IBusRoute,
  IBusStationShedule,
  IBusStations,
  ISheduleItem,
} from '../types';
import {Socket, io} from 'socket.io-client';
import {DEFAULT_API_URL} from '../../utils/constants';

interface addBusLocation {
  id: number;
  latitude: number;
  longitude: number;
}

export const stationApi = createApi({
  reducerPath: 'stationsApi',
  baseQuery: fetchBaseQuery({baseUrl: DEFAULT_API_URL}),
  tagTypes: ['route'],
  endpoints: build => ({
    getStations: build.query<IBusStations[], void>({
      query: () => '/busStations/tablo',
    }),
    getAllStations: build.query<IBusStations[], void>({
      query: () => '/busStations',
    }),
    getAttachedStations: build.query<IBusStations[], number>({
      query: (stationId: number) => `/busStations/attached/${stationId}`,
    }),
    getShedule: build.query<IBusStationShedule, number>({
      query: (id: number) => `/shedule/${id}`,
      async onCacheEntryAdded(
        id,
        {updateCachedData, cacheDataLoaded, cacheEntryRemoved},
      ) {
        await cacheDataLoaded;
        const socket: Socket = io(DEFAULT_API_URL);
        socket.on('connect', () => {
          socket.emit(
            'subscribeToUpdateShedule',
            socket.id,
            id,
            (res: {status: 'ok' | 'error'}) => {
              if (res.status === 'ok') {
              }
            },
          );
        });
        socket.on('startUpdate', () => {
          updateCachedData(draft => {
            return {...draft, isUpdating: true};
          });
        });
        socket.on('update', (data: any) => {
          if (data != null) {
            updateCachedData(() => data);
          } else {
            updateCachedData(draft => {
              return draft.isUpdating ? {...draft, isUpdating: false} : draft;
            });
          }
        });
        socket.on('error', (data: any) => {
          if (data?.statusCode === 500) {
            updateCachedData(draft => {
              console.log('error');
              return {...draft, isError: true, isUpdating: true};
            });
          }
        });
        await cacheEntryRemoved;
        socket.close();
      },
      keepUnusedDataFor: 5,
    }),
    getRoute: build.query<IBusRoute, number>({
      query: (busId: number) => `/routes/${busId}`,
      providesTags: ['route'],
    }),
    getRouteByPoints: build.query<
      ISheduleItem[],
      {fromPoint: number; toPoint: number}
    >({
      query: ({fromPoint, toPoint}) => ({
        url: '/shedule/byPoints',
        params: {
          firstPoint: fromPoint,
          secondPoint: toPoint,
        },
      }),
    }),
    getStationRoutes: build.query<ISheduleItem[], number>({
      query: (stationId: number) => `/shedule/all/${stationId}`,
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
  useLazyGetStationsQuery,
  useGetAllStationsQuery,
  useLazyGetStationRoutesQuery,
  useLazyGetAttachedStationsQuery,
  useLazyGetRouteByPointsQuery,
  useGetSheduleQuery,
  useGetRouteQuery,
  useAddBusStationLocationMutation,
  useUpdateBusStationPointMutation,
} = stationApi;
