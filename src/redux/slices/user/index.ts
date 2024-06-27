import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { deleteCookie } from 'cookies-next';
import { getSession } from '~/lib/auth';
import { Track, UserType } from '~/types';

interface UserState {
	isAuthenticated: boolean;
	loading: boolean;
	isLoadingOther: boolean;
	user: UserType | null;
	userProfilePage: UserType | null;
}
const initialState: UserState = {
	isAuthenticated: false,
	loading: true,
	isLoadingOther: false,
	user: null,
	userProfilePage: null,
};
export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserProfilePage: (state, action: PayloadAction<UserType | null>) => {
			state.userProfilePage = action.payload;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(signup.pending, (state) => {
				state.isLoadingOther = true;
			})
			.addCase(signup.fulfilled, (state, action) => {
				state.isLoadingOther = false;
			})
			.addCase(signup.rejected, (state, action) => {
				state.isLoadingOther = false;
				state.isAuthenticated = false;
			})
			.addCase(login.pending, (state) => {
				state.isLoadingOther = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoadingOther = false;
				state.isAuthenticated = true;
				state.user = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoadingOther = false;
				state.isAuthenticated = false;
			})
			.addCase(logout.pending, (state) => {
				state.loading = true;
			})
			.addCase(logout.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.userProfilePage = null;
				state.user = null;
			})
			.addCase(logout.rejected, (state, action) => {
				state.loading = false;
				state.isLoadingOther = false;
				state.isAuthenticated = false;
			})

			.addCase(getCurrentUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(getCurrentUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload;
			})
			.addCase(getCurrentUser.rejected, (state, action) => {
				state.loading = false;
				state.isAuthenticated = false;
			})
			.addCase(pinTrack.pending, (state) => {
				state.isLoadingOther = true;
			})
			.addCase(pinTrack.fulfilled, (state, action) => {
				state.isLoadingOther = false;
				if (state.user) {
					state.user.track = action.payload.track;
				}
				if (state.userProfilePage) {
					state.userProfilePage.track = action.payload.track;
				}
			})
			.addCase(pinTrack.rejected, (state, action) => {
				state.isLoadingOther = false;
			})
			.addCase(unPinTrack.pending, (state) => {
				state.isLoadingOther = true;
			})
			.addCase(unPinTrack.fulfilled, (state, action) => {
				state.isLoadingOther = false;
				if (state.user) {
					state.user.track = null;
				}
				if (state.userProfilePage) {
					state.userProfilePage.track = null;
				}
			})
			.addCase(unPinTrack.rejected, (state) => {
				state.isLoadingOther = false;
			})
			.addCase(deleteTrack.pending, (state) => {
				state.isLoadingOther = true;
			})
			.addCase(deleteTrack.fulfilled, (state, action) => {
				state.isLoadingOther = false;
				if (state.userProfilePage) {
					state.userProfilePage.collection = action.payload.collection;
					if (
						!state.userProfilePage.collection.find(
							(track) =>
								track.track_id === state.userProfilePage?.track?.track_id
						)
					) {
						state.userProfilePage.track = null;
					}
				}
				if (
					state.user?.user_id === state.userProfilePage?.user_id &&
					state.user?.collection
				) {
					state.user.collection = action.payload.collection;
				}
			})
			.addCase(deleteTrack.rejected, (state, action) => {
				state.isLoadingOther = false;
			});
	},
});
export const signup = createAsyncThunk(
	'user/sign-up',
	async (
		userData: { userId: string; email: string; password: string },
		thunkAPI
	) => {
		try {
			const { userId, email, password } = userData;
			const response = await axios.post(`/api/user/sign-up`, {
				userId,
				email,
				password,
				headers: { 'Content-Type': 'application/json' },
			});

			const { user } = await response.data;
			return user;
		} catch (error) {
			if (error instanceof AxiosError) {
				// TODO :: handle it here
				return thunkAPI.rejectWithValue(error?.response);
			} else {
				throw error;
			}
		}
	}
);
export const login = createAsyncThunk(
	'user/login',
	async (userData: { userId: string; password: string }, thunkAPI) => {
		try {
			const { userId, password } = userData;
			const response = await axios.post(`/api/user/log-in`, {
				userId,
				password,
			});
			const { user } = await response.data;
			return user;
		} catch (error) {
			if (error instanceof AxiosError) {
				// TODO :: handle it here
				return thunkAPI.rejectWithValue(error?.response);
			} else {
				throw error;
			}
		}
	}
);
export const logout = createAsyncThunk('user/logout', async (_, thunkAPI) => {
	try {
		const response = await axios.delete(`/api/user/log-out`);
		console.log('response: ', response.data);
	} catch (error) {
		if (error instanceof AxiosError) {
			// TODO :: handle it here
			return thunkAPI.rejectWithValue(error?.response);
		} else {
			throw error;
		}
	}
});
export const getCurrentUser = createAsyncThunk(
	'user/getCurrentUser',
	async (_, thunkAPI) => {
		try {
			const session = await getSession();
			if (!session) {
				return thunkAPI.rejectWithValue(null);
			}
			const { userId } = session;
			const response = await axios.get(`/api/user/${userId}`, {
				headers: { 'Content-Type': 'application/json' },
			});

			const { user } = await response.data;
			return user;
		} catch (error) {
			if (error instanceof AxiosError) {
				// TODO :: handle it here
				return thunkAPI.rejectWithValue(error?.response);
			} else {
				throw error;
			}
		}
	}
);
export const getUserById = createAsyncThunk(
	'user/getUserById',
	async ({ userId }: { userId: string }, thunkAPI) => {
		try {
			const response = await axios.get(`/api/user/${userId}`, {
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.data;
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error?.response);
			} else {
				throw error;
			}
		}
	}
);

export const pinTrack = createAsyncThunk(
	'user/pinTrack',
	async ({ trackId }: { trackId: string }, thunkAPI): Promise<any> => {
		try {
			const response = await axios.post(`/api/user/pin-track`, {
				trackId,
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.data;
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error?.response!.data);
			} else {
				throw error;
			}
		}
	}
);
export const unPinTrack = createAsyncThunk(
	'user/unPinTrack',
	async ({ trackId }: { trackId: string }, thunkAPI) => {
		try {
			const response = await axios.put(`/api/user/pin-track`, {
				trackId,
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.data;
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error?.response!.data);
			} else {
				throw error;
			}
		}
	}
);
export const savedTrack = createAsyncThunk(
	'user/savedTrack',
	async ({ trackId }: { trackId: string }, thunkAPI) => {
		try {
			const response = await axios.post(`/api/saved`, {
				trackId,
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.data;
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error?.response!.data);
			} else {
				throw error;
			}
		}
	}
);
export const deleteTrack = createAsyncThunk(
	'user/deleteTrack',
	async ({ trackId }: { trackId: string }, thunkAPI) => {
		try {
			const response = await axios.delete(`/api/saved`, {
				headers: { 'Content-Type': 'application/json' },
				data: { trackId },
			});

			const data = await response.data;
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error?.response!.data);
			} else {
				throw error;
			}
		}
	}
);
export const { setUserProfilePage } = userSlice.actions;
