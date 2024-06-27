import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface TrackState {
	trackPreview: string;
	isPlaying: boolean;
	isLoading: boolean;
	progress: number;
	duration: number;
	currentTime: number;
	volume: number;
}
const initialState: TrackState = {
	trackPreview: '',
	isPlaying: false,
	isLoading: false,
	progress: 0,
	duration: 0,
	currentTime: 0,
	volume: 0.5,
};

export const trackSlice = createSlice({
	name: 'track',
	initialState,
	reducers: {
		setTrackPreview: (state, action: PayloadAction<string>) => {
			state.trackPreview = action.payload;
		},
		setIsPlaying: (state, action: PayloadAction<boolean>) => {
			state.isPlaying = action.payload;
		},
		setIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		updateProgress: (
			state,
			action: PayloadAction<{ progress: number; currentTime: number }>
		) => {
			state.progress = action.payload.progress;
			state.currentTime = action.payload.currentTime;
		},
	},
	extraReducers(builder) {
		builder;
	},
});

export const { setTrackPreview, setIsPlaying, setIsLoading, updateProgress } =
	trackSlice.actions;
