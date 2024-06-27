import SpotifyWebApi from 'spotify-web-api-node';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from './constants';
function waiting(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export class SpotifyApi {
	private api: SpotifyWebApi;

	constructor(token?: string, refresh?: string) {
		if (token) {
			this.api = new SpotifyWebApi({
				clientId: SPOTIFY_CLIENT_ID,
				clientSecret: SPOTIFY_CLIENT_SECRET,
				accessToken: token,
			});
		} else if (!token && refresh) {
			this.api = new SpotifyWebApi({
				clientId: SPOTIFY_CLIENT_ID,
				clientSecret: SPOTIFY_CLIENT_SECRET,
				refreshToken: refresh,
			});
		} else {
			this.api = new SpotifyWebApi({
				clientId: SPOTIFY_CLIENT_ID,
				clientSecret: SPOTIFY_CLIENT_SECRET,
			});
		}
	}

	async getUserById(id: string) {
		try {
			const user = await this.api.getUser(id);
			return user.body;
		} catch (error) {
			return null;
		}
	}
	async refreshAccessToken() {
		try {
			const refresh = await this.api.refreshAccessToken();
			return refresh.body!;
		} catch (error) {
			return null;
		}
	}
	async searchTracks(name: string) {
		try {
			const result = await this.api.searchTracks(name);
			return result.body!;
		} catch (error) {
			return null;
		}
	}
	async getTrackById(id: string) {
		try {
			const result = await this.api.getTrack(id);
			return result.body!;
		} catch (error) {
			return null;
		}
	}
}
