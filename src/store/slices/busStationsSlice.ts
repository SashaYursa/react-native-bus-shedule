import { IBusStations } from '../types/index';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { stationApi } from './stationsAPI';
const initialState: IBusStations[] = [];

const busStations = createSlice({
	name: 'netInfo',
	initialState,
	reducers: {
		setStations: (state, action: PayloadAction<IBusStations[]>) => {
			state = action.payload;
		},
	},
	extraReducers: builder => {
		builder.addMatcher(
			stationApi.endpoints.getStations.matchFulfilled,
			(_state, { payload }) => {
				return payload;
			},
		);
	},
});
export default busStations.reducer;
export const { setStations } = busStations.actions;
