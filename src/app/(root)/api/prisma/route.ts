import prisma from '~/lib/db';

export async function GET(request: Request) {
	const data = await prisma.user.findUnique({
		where: {
			id: 2,
		},
		select: {
			id: true,
			display_name: true,
			email: true,
			collection: {
				select: {
					TrackOnCollection: {
						select: {
							track: true,
							track_id: true,
						},
					},
				},
			},
		},
	});
	const tracks = await prisma.track.findMany();
	const user = {
		id: data?.id,
		name: data?.display_name,
		email: data?.email,
		savedTracks: data?.collection?.TrackOnCollection || [],
	};
	return Response.json({ user, tracks }, { status: 200 });
}
