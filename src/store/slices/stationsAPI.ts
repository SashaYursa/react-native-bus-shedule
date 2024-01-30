import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	IBusRoute,
	IBusStationShedule,
	IBusStations,
	ISheduleItem,
} from '../types';
import { DEFAULT_API_URL } from '../../utils/constants';
import socket from '../../socket';
import { addTime } from './stationTimesSlice';

interface addBusLocation {
	id: number;
	latitude: number;
	longitude: number;
}

type sheduleUpdate = {
	shedule: IBusStationShedule | null;
	isUpdated: boolean;
	error?: string;
	lastUpdate: string;
	isLoading?: boolean;
};

type routeUpdate = {
	route: IBusRoute | null;
	error?: string;
	busId: number;
};

export type busTime = {
	id: number;
	busInfo: string;
	departure: number;
	busRoute: string;
};

const UPDATE_SHEDULE_TIME = 60000; //ms

export const stationApi = createApi({
	reducerPath: 'stationsApi',
	baseQuery: fetchBaseQuery({ baseUrl: DEFAULT_API_URL }),
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
		getShedule: build.query<sheduleUpdate, number>({
			query: (id: number) => `/shedule/${id}`,
			async onCacheEntryAdded(
				id,
				{ updateCachedData, cacheDataLoaded, cacheEntryRemoved },
			) {
				const result = await cacheDataLoaded;
				let interval: number | null = null;
				updateCachedData(data => {
					return {
						...data,
						isLoading: true,
					};
				});
				socket.emit('bus:update-shedule:server', {
					busStationId: id,
					lastUpdate: result.data.lastUpdate,
				});
				socket.on('bus:update-shedule:client', (response: sheduleUpdate) => {
					console.log('recive');
					if (response.shedule?.station.id === id) {
						if (interval) {
							clearInterval(interval);
						}
						if (!response.error) {
							updateCachedData(() => {
								return {
									...response,
									isLoading: false,
								};
							});
							interval = setInterval(() => {
								updateCachedData(data => {
									return {
										...data,
										isLoading: true,
									};
								});

								socket.emit('bus:update-shedule:server', {
									busStationId: id,
									lastUpdate: response.lastUpdate,
								});
							}, UPDATE_SHEDULE_TIME);
						} else {
							updateCachedData(draft => {
								return {
									...draft,
									isLoading: false,
									error: response.error,
								};
							});
							console.log('response error');
						}
					}
				});
				await cacheEntryRemoved;
				if (interval) {
					clearInterval(interval);
				}
				socket.removeListener('bus:update-shedule:client');
			},
			keepUnusedDataFor: 0,
		}),
		getRoute: build.query<routeUpdate, number>({
			query: (busId: number) => `/routes/${busId}`,
			async onCacheEntryAdded(
				busId,
				{ updateCachedData, cacheDataLoaded, cacheEntryRemoved },
			) {
				const data = (await cacheDataLoaded).data;
				if (!data?.route?.route) {
					socket.emit('route:fetch-route:server', { busId });
				}
				socket.on('route:fetch-route:client', (response: routeUpdate) => {
					if (response.busId === busId) {
						updateCachedData(() => response);
					}
				});
				await cacheEntryRemoved;
				socket.removeListener('route:fetch-route:client');
			},
			keepUnusedDataFor: 0,
			providesTags: ['route'],
		}),

		getRouteByPoints: build.query<
			ISheduleItem[],
			{ fromPoint: number; toPoint: number }
		>({
			query: ({ fromPoint, toPoint }) => ({
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
			query: ({ id, ...data }: addBusLocation) => ({
				url: `/busStations/${id}`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['route'],
		}),
		updateBusStationPointForCurrentRoute: build.mutation<
			string,
			addBusLocation
		>({
			query: ({ id, ...data }: addBusLocation) => ({
				url: `/routes/point/${id}`,
				method: 'PUT',
				body: data,
			}),

			invalidatesTags: ['route'],
		}),
		getStationTimes: build.query<busTime[], number>({
			query: (stationId: number) => `/shedule/times/${stationId}`,
			async onCacheEntryAdded(
				arg,
				{ cacheDataLoaded, cacheEntryRemoved, dispatch },
			) {
				const res = await cacheDataLoaded;
				dispatch(addTime({ routes: res.data, stationId: arg }));
			},
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
	useUpdateBusStationPointForCurrentRouteMutation,
	useGetStationTimesQuery,
	useLazyGetStationTimesQuery,
} = stationApi;
