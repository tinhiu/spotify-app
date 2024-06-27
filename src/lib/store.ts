import { configureStore } from '@reduxjs/toolkit';
import { trackSlice } from '~/redux/slices/track';
import { userSlice } from '~/redux/slices/user';

export const makeStore = () => {
	return configureStore({
		reducer: {
			user: userSlice.reducer,
			track: trackSlice.reducer,
		},
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
