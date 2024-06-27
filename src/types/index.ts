import { User } from '@prisma/client';

export type UserWithoutPassword = Omit<User, 'password' | 'trackPin'>;

export type FormData = {
	userId: string;
	email: string;
	password: string;
};
export type ButtonType = 'button' | 'submit' | 'reset';

export type Track = {
	track_id: string;
	name: string;
	artist: string;
	album: string;
	duration_ms: number;
	explicit: boolean;
	external_urls: string;
	preview_url: string | null;
	image_url: string;
	type: string;
};

export type UserType = {
	collection: Track[] | [];
	track: Track | null;
} & User;
