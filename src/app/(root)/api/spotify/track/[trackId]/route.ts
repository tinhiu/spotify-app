import { Redis } from '@upstash/redis';
import { getCookie, setCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '~/lib/db';
import { REDIS_TOKEN, REDIS_URL, SPOTIFY_REDIS_KEYS } from '~/server/constants';
import { SpotifyApi } from '~/server/spotify';
import { Track } from '~/types';

export async function GET(
	req: NextRequest,
	{ params }: { params: { trackId: string } }
) {
	try {
		// let res = new NextResponse();
		// const cookieStore = cookies();
		// const session = cookieStore.get('session');
		// if (!session?.value) {
		// 	return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
		// }

		// const { trackId } = params;
		// const redis = new Redis({
		// 	url: REDIS_URL,
		// 	token: REDIS_TOKEN,
		// });
		// const [token, refresh] = await redis.mget<[string, string]>(
		// 	SPOTIFY_REDIS_KEYS.AccessToken,
		// 	SPOTIFY_REDIS_KEYS.RefreshToken
		// );

		// let api: SpotifyApi;
		// let revalidate = 120;
		// if (!token && refresh) {
		// 	api = new SpotifyApi(undefined, refresh);

		// 	const result = await api.refreshAccessToken();
		// 	if (!result) {
		// 		return NextResponse.json(
		// 			{ error: 'Refresh token not found' },
		// 			{ status: 400 }
		// 		);
		// 	}
		// 	setCookie('accessToken', result.access_token, {
		// 		req,
		// 		res,
		// 		maxAge: 60 * 6 * 24 * 3,
		// 		path: '/',
		// 	});

		// 	await redis.set(SPOTIFY_REDIS_KEYS.AccessToken, result.access_token, {
		// 		ex: result.expires_in,
		// 	});
		// 	revalidate = result.expires_in - 30;
		// 	if (result.refresh_token) {
		// 		await redis.set(SPOTIFY_REDIS_KEYS.RefreshToken, result.refresh_token);
		// 	}
		// } else if (token) {
		// 	api = new SpotifyApi(token, undefined);
		// 	setCookie('accessToken', token, {
		// 		req,
		// 		res,
		// 		maxAge: 60 * 6 * 24 * 3,
		// 		path: '/',
		// 	});
		// } else {
		// 	return NextResponse.json(
		// 		{ error: 'No token provided please try again' },
		// 		{ status: 400 }
		// 	);
		// }
		// let accessToken = getCookie('accessToken', { req, res });
		// if (!token && accessToken) {
		// 	api = new SpotifyApi(accessToken, undefined);
		// }
		// const result = await api.getTrackById(trackId);

		// if (!result) {
		// 	return NextResponse.json(
		// 		{ message: 'Track not found.' },
		// 		{ status: 404 }
		// 	);
		// }
		// const track: Track = {
		// 	trackId: result.id,
		// 	name: result.name,
		// 	artist: result.artists[0].name,
		// 	album: result.album.name,
		// 	duration_ms: result.duration_ms,
		// 	url: result.external_urls.spotify,
		// 	image_url: result.album.images[0].url,
		// 	explicit: result.explicit,
		// 	external_urls: result.external_urls.spotify,
		// 	preview_url: result.preview_url,
		// 	type: result.type,
		// };
		const track = await prisma.track.findUnique({
			where: {
				track_id: params.trackId,
			},
		});

		return NextResponse.json({ track }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong.' },
			{ status: 400 }
		);
	}
}
