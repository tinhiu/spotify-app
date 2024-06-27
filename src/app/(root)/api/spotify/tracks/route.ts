import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { REDIS_TOKEN, REDIS_URL, SPOTIFY_REDIS_KEYS } from '~/server/constants';

import { SpotifyApi } from '~/server/spotify';
import { getCookie, setCookie } from 'cookies-next';

export async function GET(req: NextRequest) {
	try {
		let res = new NextResponse();
		const redis = new Redis({
			url: REDIS_URL,
			token: REDIS_TOKEN,
		});
		const [token, refresh] = await redis.mget<[string, string]>(
			SPOTIFY_REDIS_KEYS.AccessToken,
			SPOTIFY_REDIS_KEYS.RefreshToken
		);

		let api: SpotifyApi;
		let revalidate = 120;

		if (!token && refresh) {
			api = new SpotifyApi(undefined, refresh);

			const result = await api.refreshAccessToken();
			if (!result) {
				return NextResponse.json(
					{ error: 'Refresh token not found' },
					{ status: 400 }
				);
			}
			setCookie('accessToken', result.access_token, {
				req,
				res,
				maxAge: 60 * 6 * 24 * 3,
				path: '/',
			});

			await redis.set(SPOTIFY_REDIS_KEYS.AccessToken, result.access_token, {
				ex: result.expires_in,
			});
			revalidate = result.expires_in - 30;
			if (result.refresh_token) {
				await redis.set(SPOTIFY_REDIS_KEYS.RefreshToken, result.refresh_token);
			}
		} else if (token) {
			api = new SpotifyApi(token, undefined);
			setCookie('accessToken', token, {
				req,
				res,
				maxAge: 60 * 6 * 24 * 3,
				path: '/',
			});
		} else {
			return NextResponse.json(
				{ error: 'No token provided please try again' },
				{ status: 400 }
			);
		}
		let accessToken = getCookie('accessToken', { req, res });
		if (!token && accessToken) {
			api = new SpotifyApi(accessToken, undefined);
		}

		const url = new URL(req.url);
		const params = { query: url.searchParams.get('q')! };
		if (params.query === '' || params.query === undefined) {
			return NextResponse.json({ error: 'No Track Found' }, { status: 400 });
		}
		const trackName = params.query;

		let data = await api.searchTracks(trackName);
		if (!data) {
			return NextResponse.json({ error: 'Tracks not found' }, { status: 400 });
		}
		const response = {
			href: data.tracks?.href,
			limit: data.tracks?.limit,
			next: data.tracks?.next,
			offset: data.tracks?.offset,
			previous: data.tracks?.previous,
			total: data.tracks?.total,
			tracks: data.tracks?.items.map((item) => {
				return {
					href: item.href,
					id: item.id,
					name: item.name,
					type: item.type,
					explicit: item.explicit,
					duration_ms: item.duration_ms,
					preview_url: item.preview_url,
					track_number: item.track_number,
					is_local: item.is_local,
					external_urls: item.external_urls.spotify,
					artists: item.artists,
					album: item.album,
					popularity: item.popularity,
				};
			}),
		};

		res = NextResponse.json({ tracks: response, revalidate }, { status: 200 });
		return res;
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong.' },
			{ status: 400 }
		);
	}
}
