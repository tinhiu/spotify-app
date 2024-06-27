import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '~/lib/db';
import { setCookie } from 'cookies-next';
import { encrypt } from '~/lib/auth';
import { UserWithoutPassword } from '~/types';
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { userId, password } = body;

		const data = await prisma.user.findUnique({
			where: {
				user_id: userId,
			},
			include: {
				track: true,
				collection: {
					include: {
						TrackOnCollection: {
							select: {
								track: true,
							},
						},
					},
				},
			},
		});

		if (!data) {
			return NextResponse.json(
				{ message: 'Incorrect username or password.', success: false },
				{ status: 401 }
			);
		}
		const comparePassword = bcrypt.compareSync(password, data?.password);
		if (!comparePassword) {
			return NextResponse.json(
				{ message: 'Incorrect username or password.', success: false },
				{ status: 401 }
			);
		}
		const user = {
			...data,
			collection: [
				...data?.collection?.TrackOnCollection.map((track) => {
					return { ...track.track };
				})!,
			],
		};
		const session = await encrypt({ userId: user.user_id });
		const userWithoutPassword: UserWithoutPassword = (({
			password,
			trackPin,
			...user
		}) => user)(user);

		const res = NextResponse.json(
			{ success: true, user: userWithoutPassword },
			{ status: 200, headers: { 'content-type': 'application/json' } }
		);
		// save the session in cookie
		setCookie('session', session, { req, res, maxAge: 60 * 6 * 24 });
		return res;
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong.', success: false },
			{ status: 500 }
		);
	}
}
