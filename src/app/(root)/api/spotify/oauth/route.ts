import { z } from 'zod';
import { Redis } from '@upstash/redis';
import urlcat from 'urlcat';
import SpotifyWebApi from 'spotify-web-api-node';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'; // defaults to auto
import {
	REDIS_TOKEN,
	REDIS_URL,
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REDIRECT_URI,
	SPOTIFY_REDIS_KEYS,
	SPOTIFY_USER_ID,
} from '~/server/constants';
import { join } from '~/utils/types';

const scopes = [
	'user-top-read',
	'user-read-private',
	'user-read-email',
	'user-read-recently-played',
	'user-read-currently-playing',
	'user-follow-read',
] as const;

const scope = join(scopes, ' ');

const redirectUrl = urlcat('https://accounts.spotify.com/authorize', {
	response_type: 'code',
	client_id: SPOTIFY_CLIENT_ID,
	scope,
	redirect_uri: SPOTIFY_REDIRECT_URI,
});

const schema = z.object({
	code: z.string(),
});

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url);
		const params = { code: url.searchParams.get('code')! };
		if (params.code === null || params.code === undefined) {
			return NextResponse.redirect(redirectUrl);
		}

		const { code } = schema.parse(params);
		const api = new SpotifyWebApi({
			clientId: SPOTIFY_CLIENT_ID,
			clientSecret: SPOTIFY_CLIENT_SECRET,
			redirectUri: SPOTIFY_REDIRECT_URI,
		});

		const { body: auth } = await api.authorizationCodeGrant(code);
		const userAPI = new SpotifyWebApi({
			accessToken: auth.access_token,
			refreshToken: auth.refresh_token,
		});

		const { body: data } = await userAPI.getMe();
		const user = (({
			country,
			email,
			product,
			...rest
		}: SpotifyApi.CurrentUsersProfileResponse) => rest)(data);
		if (user.id !== SPOTIFY_USER_ID) {
			return NextResponse.json(
				{ error: 'You are not permitted to update OAuth keys!' },
				{ status: 403 }
			);
		}
		const redis = new Redis({
			url: REDIS_URL,
			token: REDIS_TOKEN,
		});
		await redis.set(SPOTIFY_REDIS_KEYS.AccessToken, auth.access_token);

		await redis.expire(SPOTIFY_REDIS_KEYS.AccessToken, auth.expires_in);

		await redis.set(SPOTIFY_REDIS_KEYS.RefreshToken, auth.refresh_token);

		return Response.json({ user }, { status: 200 });
	} catch (error) {
		return Response.json({ error: error }, { status: 404 });
	}
}
