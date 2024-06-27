import bcrypt from 'bcrypt';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import {
	REDIS_TOKEN,
	REDIS_URL,
	SALT_ROUNDS,
	SPOTIFY_REDIS_KEYS,
} from '~/server/constants';

import { SpotifyApi } from '~/server/spotify';
import prisma from '~/lib/db';
import { getCookie, setCookie } from 'cookies-next';
import { encrypt } from '~/lib/auth';
import { UserWithoutPassword } from '~/types';

export async function POST(req: NextRequest) {
	try {
		let res = new NextResponse();
		const body = await req.json();
		const { userId, email, password } = body;

		let user = await prisma.user.findUnique({
			where: {
				user_id: userId,
			},
		});
		if (user) {
			return NextResponse.json(
				{ success: false, message: 'User already exists' },
				{ status: 401 }
			);
		} else {
			user = await prisma.user.findUnique({
				where: {
					email: email,
				},
			});
			if (user) {
				return NextResponse.json(
					{ success: false, message: 'User Email already exists' },
					{ status: 401 }
				);
			}

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
					await redis.set(
						SPOTIFY_REDIS_KEYS.RefreshToken,
						result.refresh_token
					);
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

			const spotify = await api.getUserById(userId);
			if (spotify === null) {
				return NextResponse.json(
					{ message: 'User not found please correct the id' },
					{ status: 400 }
				);
			}
			user = await prisma.user.create({
				data: {
					user_id: userId,
					password: bcrypt.hashSync(password, SALT_ROUNDS),
					email: email,
					display_name: spotify.display_name,
					external_urls: spotify.external_urls.spotify,
					image_url: spotify.images![1].url,
				},
			});
			await prisma.collection.create({
				data: {
					userId: userId,
				},
			});
		}
		res = NextResponse.json(
			{ success: true },
			{ headers: { 'content-type': 'application/json' }, status: 200 }
		);

		return res;
	} catch (error) {
		console.log('error: ', error);
		return NextResponse.json(
			{ message: error, success: false },
			{ status: 400 }
		);
	}
}
