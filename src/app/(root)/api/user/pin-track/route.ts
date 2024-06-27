import { Redis } from '@upstash/redis';
import { getCookie, setCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decrypt } from '~/lib/auth';
import prisma from '~/lib/db';
import { REDIS_TOKEN, REDIS_URL, SPOTIFY_REDIS_KEYS } from '~/server/constants';
import { SpotifyApi } from '~/server/spotify';

export async function POST(req: Request) {
	try {
		let res = new NextResponse();
		const cookieStore = cookies();
		const session = cookieStore.get('session');
		if (!session?.value) {
			return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
		}
		const { userId } = await decrypt(session.value);
		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
		}
		const user = await prisma.user.findUnique({
			where: {
				user_id: userId,
			},
			select: {
				collection: {
					select: {
						id: true,
					},
				},
				track: true,
			},
		});
		if (!user) {
			return NextResponse.json({ message: 'User not found.' }, { status: 401 });
		}
		const body = await req.json();
		const { trackId } = body;
		if (user.track?.track_id === trackId) {
			return NextResponse.json(
				{ message: 'Track already pin on your profile.' },
				{ status: 401 }
			);
		}

		let pinTrack = await prisma.track.findUnique({
			where: {
				track_id: trackId,
			},
		});
		if (!pinTrack) {
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
			const result = await api.getTrackById(trackId);
			if (!result) {
				return NextResponse.json({ error: 'Track not found' }, { status: 400 });
			}
			const createTrack = await prisma.track.create({
				data: {
					track_id: result.id,
					name: result.name,
					artist: result.artists[0].name,
					external_urls: result.external_urls.spotify,
					explicit: result.explicit,
					duration_ms: result.duration_ms,
					preview_url: result.preview_url!,
					type: result.type,
					image_url: result.album.images[0].url,
				},
			});
			if (!createTrack) {
				return NextResponse.json(
					{ error: 'Track create failed!' },
					{ status: 400 }
				);
			}
			pinTrack = createTrack;
		}

		if (!pinTrack) {
			return NextResponse.json(
				{ message: 'Pin failed please try again!' },
				{ status: 401 }
			);
		}

		const exitCollection = await prisma.trackOnCollection.findFirst({
			where: {
				collection_id: user.collection?.id,
				track_id: pinTrack.track_id,
			},
		});
		if (!exitCollection) {
			await prisma.trackOnCollection.create({
				data: {
					collection: {
						connect: {
							id: user.collection?.id,
						},
					},
					track: {
						connect: {
							track_id: pinTrack.track_id,
						},
					},
				},
			});
		}
		const updateUser = await prisma.user.update({
			where: {
				user_id: userId,
			},
			data: {
				track: {
					connect: {
						track_id: pinTrack.track_id,
					},
				},
			},
			select: {
				track: true,
			},
		});
		if (!updateUser) {
			return NextResponse.json(
				{ message: 'Pin failed please try again!' },
				{ status: 401 }
			);
		}
		return NextResponse.json(
			{ message: 'Song has been pinned', track: updateUser.track },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Some thing went wrong please try again!' },
			{ status: 500 }
		);
	}
}

export async function PUT(req: Request) {
	try {
		const cookieStore = cookies();
		const session = cookieStore.get('session');
		if (!session?.value) {
			return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
		}
		const { userId } = await decrypt(session.value);
		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
		}
		if (!userId) {
			return NextResponse.json({ message: 'User not found.' }, { status: 401 });
		}
		const body = await req.json();
		const { trackId } = body;

		const userUpdate = await prisma.user.update({
			where: {
				user_id: userId,
			},
			data: {
				track: {
					disconnect: {
						track_id: trackId,
					},
				},
			},
		});
		if (!userUpdate) {
			return NextResponse.json(
				{ message: 'Unpin failed please try again!' },
				{ status: 401 }
			);
		}
		return NextResponse.json(
			{ message: 'Song has been unpinned' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Some thing went wrong please try again!' },
			{ status: 500 }
		);
	}
}
