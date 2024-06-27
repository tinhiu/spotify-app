import { NextResponse } from 'next/server';
import { decrypt, encrypt } from '~/lib/auth';
import prisma from '~/lib/db';
import {
	NEXT_PUBLIC_NODEMAILER_ADDRESS,
	NEXT_PUBLIC_NODEMAILER_PASS,
} from '~/server/constants';

const nodemailer = require('nodemailer');
export async function POST(req: Request) {
	try {
		const url = req.url;
		const body = await req.json();
		const { userIdOrEmail } = body;
		let user = await prisma.user.findUnique({
			where: {
				user_id: userIdOrEmail,
			},
		});
		if (!user) {
			user = await prisma.user.findUnique({
				where: {
					email: userIdOrEmail,
				},
			});
		}

		if (user) {
			const resetPasswordToken = await encrypt({ userId: user.user_id });
			const message = {
				from: [{ name: 'spotify-app', address: 'spotify-app@no-reply.com' }],
				to: user.email,
				subject: 'Spotify-app Password Reset',
				html: `
				<div>
				<span>${url}</span>
				<a href="${url}?token=${resetPasswordToken}">Link to reset your password</a>
				</div>
				`,
			};

			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: NEXT_PUBLIC_NODEMAILER_ADDRESS,
					pass: NEXT_PUBLIC_NODEMAILER_PASS,
				},
			});
			const data = await new Promise<{ accepted: Array<string>; err: any }>(
				(resolve, reject) => {
					transporter.sendMail(
						message,
						function (error: any, info: { accepted: Array<string> }) {
							if (error) {
								resolve({ accepted: [], err: error });
							} else {
								resolve({ accepted: info.accepted, err: null });
							}
						}
					);
				}
			);
			if (!data) {
				return NextResponse.json(
					{ error: 'Send mail failed please try again' },
					{ status: 400 }
				);
			}

			return NextResponse.json(
				{ success: `Message delivered to ${data.accepted.join(', ')}` },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ message: 'User not found you need register' },
				{ status: 400 }
			);
		}
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET(req: Request) {
	try {
		const session = req.url;
		if (!session) return;

		// Refresh the session so it doesn't expire
		const parsed = await decrypt(session);
	} catch (error) {}
}
