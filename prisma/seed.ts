import bcrypt from 'bcrypt';
import { PrismaClient, Prisma } from '@prisma/client';
import { SALT_ROUNDS } from '../src/server/constants';

const prisma = new PrismaClient();

const trackData: Prisma.TrackCreateInput[] = [
	{
		track_id: '2nD9CUfMMUVxL0UyFs8fGG',
		name: 'Pistol',
		artist: 'Cigarettes After Sex',
		preview_url:
			'https://p.scdn.co/mp3-preview/7faee6f16698c12bb6e2ec83610dc711444cac5f?cid=cfe923b2d660439caf2b557b21f31221',
		duration_ms: 234174,
		explicit: false,
		external_urls: 'https://open.spotify.com/track/2nD9CUfMMUVxL0UyFs8fGG',
		image_url:
			'https://i.scdn.co/image/ab67616d0000b273ff2267bd3886891025bf1c09',
		type: 'track',
	},
	{
		track_id: '6hw689zbjD67Fz6sB29eFm',
		name: 'Tied',
		artist: 'COOING',
		preview_url:
			'https://p.scdn.co/mp3-preview/60d89ba6038d8cced93d7402443c351df73d6b76?cid=cfe923b2d660439caf2b557b21f31221',
		duration_ms: 215173,
		explicit: false,
		external_urls: 'https://open.spotify.com/album/19fwzaOnTSR4dy1o3uJCcb',
		image_url:
			'https://i.scdn.co/image/ab67616d0000b273e9283d1ae7001fc11dad30d9',
		type: 'track',
	},
	{
		track_id: '58VF5ob7qRB3yUzOYEAhyf',
		name: 'Lost The Breakup',
		artist: 'Maisie Peters',
		preview_url:
			'https://p.scdn.co/mp3-preview/a43373884336b969f3c0affaae0b1f20c9ea4686?cid=cfe923b2d660439caf2b557b21f31221',
		duration_ms: 189413,
		explicit: true,
		external_urls: 'https://open.spotify.com/track/58VF5ob7qRB3yUzOYEAhyf',
		image_url:
			'https://i.scdn.co/image/ab67616d0000b273ca69bf6c658aa5fd60778c10',
		type: 'track',
	},
];
const userData: Prisma.UserCreateInput[] = [
	{
		user_id: 'tinhiu123123',
		display_name: 'tinhiu',
		password: bcrypt.hashSync('123123', SALT_ROUNDS),
		email: 'tjnhqw@gmail.com',
		image_url: 'https://avatars.githubusercontent.com/u/77063123?v=4',
		external_urls: 'https://open.spotify.com/user/31n6aktetcccewkz5gn7edwligmi',
		collection: {
			connectOrCreate: {
				where: {
					userId: 'tinhiu123123',
				},
				create: {
					TrackOnCollection: {
						createMany: {
							data: [
								{ track_id: '2nD9CUfMMUVxL0UyFs8fGG' },
								{ track_id: '6hw689zbjD67Fz6sB29eFm' },
							],
						},
					},
				},
			},
		},
		track: {
			connect: {
				track_id: '2nD9CUfMMUVxL0UyFs8fGG',
			},
		},
	},
	{
		user_id: 'luna123123',
		display_name: 'luna',
		password: bcrypt.hashSync('123123', SALT_ROUNDS),
		email: 'luna@loonathewoo.io',
		image_url: 'https://avatars.githubusercontent.com/u/77063123?v=4',
		external_urls: 'https://open.spotify.com/user/31n6aktetcccewkz5gn7edwligmi',
		collection: {
			connectOrCreate: {
				where: {
					userId: 'luna123123',
				},
				create: {
					TrackOnCollection: {
						create: {
							track_id: '6hw689zbjD67Fz6sB29eFm',
						},
					},
				},
			},
		},
	},
	{
		user_id: 'yves123123',
		display_name: 'yves',
		password: bcrypt.hashSync('123123', SALT_ROUNDS),
		email: 'yves@vyes.io',
		image_url: 'https://avatars.githubusercontent.com/u/77063123?v=4',
		external_urls: 'https://open.spotify.com/user/31n6aktetcccewkz5gn7edwligmi',
		collection: {
			connectOrCreate: {
				where: {
					userId: 'yves123123',
				},
				create: {
					TrackOnCollection: {
						create: {
							track_id: '58VF5ob7qRB3yUzOYEAhyf',
						},
					},
				},
			},
		},
	},
];

async function main() {
	try {
		console.log(`Start seeding ...`);
		for (const u of trackData) {
			const track = await prisma.track.create({
				data: u,
			});
			console.log(`Created track with id: ${track.track_id}`);
		}
		for (const u of userData) {
			const user = await prisma.user.create({
				data: u,
			});
			console.log(`Created user with id: ${user.id}`);
		}
		console.log(`Seeding finished.`);
	} catch (error) {
		console.log('error: ', error);
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
