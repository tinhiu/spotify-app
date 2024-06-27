export const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
export const SPOTIFY_USER_ID = process.env.NEXT_PUBLIC_SPOTIFY_USER_ID;
export const SPOTIFY_CLIENT_SECRET =
	process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
export const SPOTIFY_REDIRECT_URI =
	process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

export const REDIS_URL = process.env.NEXT_PUBLIC_REDIS_URL;
export const REDIS_TOKEN = process.env.NEXT_PUBLIC_REDIS_TOKEN;
export const SPOTIFY_REDIS_KEYS = {
	AccessToken: 'AccessToken',
	RefreshToken: 'RefreshToken',
};

export const SALT_ROUNDS = 10;
export const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

export const NEXT_PUBLIC_NODEMAILER_ADDRESS =
	process.env.NEXT_PUBLIC_NODEMAILER_ADDRESS;
export const NEXT_PUBLIC_NODEMAILER_PASS =
	process.env.NEXT_PUBLIC_NODEMAILER_PASS;
