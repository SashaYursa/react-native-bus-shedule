import { IBusStations } from '../types/index';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { busTime, stationApi } from './stationsAPI';

type time = {
	stationId: number;
	routes: busTime[];
};

const initialState: time[] = [];

const stationTimes = createSlice({
	name: 'netInfo',
	initialState,
	reducers: {
		addTime: (state, action: PayloadAction<time>) => {
			state.push(action.payload);
		},
	},
});
export default stationTimes.reducer;
export const { addTime } = stationTimes.actions;
