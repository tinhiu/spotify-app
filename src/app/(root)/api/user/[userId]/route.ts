import { NextResponse } from 'next/server';
import prisma from '~/lib/db';
import { cookies } from 'next/headers';
export async function GET(
	req: Request,
	{ params }: { params: { userId: string } }
) {
	try {
		const cookieStore = cookies();
		const session = cookieStore.get('session');
		if (!session?.value) {
			return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
		}

		const { userId } = params;

		const data = await prisma.user.findUnique({
			where: {
				user_id: userId,
			},
			select: {
				id: true,
				user_id: true,
				display_name: true,
				email: true,
				image_url: true,
				external_urls: true,
				createdAt: true,
				collection: {
					select: {
						TrackOnCollection: {
							select: {
								track: true,
							},
						},
					},
				},
				track: true,
			},
		});

		if (!data) {
			return NextResponse.json({ message: 'User not found.' }, { status: 401 });
		}
		const user = {
			...data,
			collection: [
				...data?.collection?.TrackOnCollection.map((track) => {
					return { ...track.track };
				})!,
			],
		};

		return NextResponse.json({ user, status: 200 }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong.' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}
