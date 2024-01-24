import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	IBusRoute,
	IBusStationShedule,
	IBusStations,
	ISheduleItem,
} from '../types';
import { DEFAULT_API_URL } from '../../utils/constants';
import socket from '../../socket';

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

const UPDATE_SHEDULE_TIME = 10000; //ms

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
				socket.emit('bus:update-shedule:server', {
					busStationId: id,
					lastUpdate: result.data.lastUpdate,
				});
				socket.on('bus:update-shedule:client', (response: sheduleUpdate) => {
					if (interval) {
						clearInterval(interval);
					}

					updateCachedData(() => response);
					if (!response.error) {
						interval = setInterval(
							() => {
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
							},
							response.error ? 1000 : UPDATE_SHEDULE_TIME,
						);
					}
				});

				// socket.emit(
				// 	'subscribeToUpdateShedule',
				// 	socket.id,
				// 	id,
				// 	(res: { status: 'ok' | 'error' }) => {
				// 		if (res.status === 'ok') {
				// 		}
				// 	},
				// );
				// socket.on('startUpdate', () => {
				// 	updateCachedData(draft => {
				// 		return { ...draft, isUpdating: true };
				// 	});
				// });
				// socket.on('update', (data: any) => {
				// 	if (data != null) {
				// 		updateCachedData(() => data);
				// 	} else {
				// 		updateCachedData(draft => {
				// 			return draft.isUpdating ? { ...draft, isUpdating: false } : draft;
				// 		});
				// 	}
				// });
				// socket.on('error', (data: any) => {
				// 	if (data?.statusCode === 500) {
				// 		updateCachedData(draft => {
				// 			console.log('error');
				// 			return { ...draft, isError: true, isUpdating: true };
				// 		});
				// 	}
				// });
				await cacheEntryRemoved;
				socket.removeListener('bus:update-shedule:client');
			},
			keepUnusedDataFor: 5,
		}),
		getRoute: build.query<{ res: IBusRoute | null; error?: string }, number>({
			query: (busId: number) => `/routes/${busId}`,
			async onCacheEntryAdded(
				busId,
				{ updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch },
			) {
				const data = (await cacheDataLoaded).data;
				if (!data?.res) {
					socket.emit('route:fetch-route:server', { busId });
					socket.on(
						'route:fetch-route:client',
						({ route, error }: { route: IBusRoute; error?: string }) => {
							console.log(error, 'api error');
							updateCachedData(() => ({
								res: route,
								error: error,
							}));
						},
					);
				}
				await cacheEntryRemoved;
				socket.removeListener('route:fetch-route:client');
			},
			keepUnusedDataFor: 5,
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
		updateBusStationPoint: build.mutation<string, addBusLocation>({
			query: ({ id, ...data }: addBusLocation) => ({
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
