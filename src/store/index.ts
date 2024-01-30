import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stationApi } from './slices/stationsAPI';
import netInfo from './slices/netInfo';
import busStationsSlice from './slices/busStationsSlice';
import stationTimesSlice from './slices/stationTimesSlice';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['busStations', 'stationTimes'],
};
const rootReducer = combineReducers({
	netInfo: netInfo,
	busStations: busStationsSlice,
	stationTimes: stationTimesSlice,
	[stationApi.reducerPath]: stationApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware({
			immutableCheck: {
				warnAfter: 256,
			},
			serializableCheck: {
				warnAfter: 256,
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(stationApi.middleware);
	},
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
