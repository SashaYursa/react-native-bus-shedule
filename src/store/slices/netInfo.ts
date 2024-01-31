import { PayloadAction, createSlice } from '@reduxjs/toolkit';
interface info {
	isConnected: boolean;
}

interface infoState {
	info: info;
}

const initialState: infoState = {
	info: {
		isConnected: false,
	},
};

const netInfo = createSlice({
	name: 'netInfo',
	initialState,
	reducers: {
		setInfo: (state, action: PayloadAction<info>) => {
			state.info = action.payload;
		},
	},
});
export default netInfo.reducer;
export const { setInfo } = netInfo.actions;
