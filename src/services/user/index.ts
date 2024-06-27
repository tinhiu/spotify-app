import { User } from '@prisma/client';
import { deleteCookie } from 'cookies-next';
import { FormData, Track, UserType } from '~/types';

export async function signUp({
	userId,
	password,
	email,
}: FormData): Promise<{ status: number; user: User }> {
	const response = await fetch(`/api/user/sign-up`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userId, password, email }),
	});
	if (!response.ok) {
		const message = (await response
			.json()
			.then((data) => data.message)) as string;
		throw new Error(message);
	}
	return await response.json();
}
export async function logIn({ userId, password }: FormData): Promise<{
	success: boolean;
	user: Omit<User, 'password'>;
	token: string;
	status: number;
}> {
	const response = await fetch(`/api/user/log-in`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userId, password }),
	});
	if (!response.ok) {
		const message = (await response
			.json()
			.then((data) => data.message)) as string;
		throw new Error(message);
	}
	return await response.json();
}
export async function logout() {
	const response = await fetch(`/api/user/log-out`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
	});
	if (!response.ok) {
		const message = (await response
			.json()
			.then((data) => data.message)) as string;
		throw new Error(message);
	}
	return await deleteCookie('session');
}
export async function getUserById(userId: string): Promise<UserType> {
	const response = await fetch(`/api/user/${userId}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});
	if (!response.ok) {
		const message = (await response
			.json()
			.then((data) => data.message)) as string;
		throw new Error(message);
	}
	const { user } = await response.json();

	return user;
}
export async function forgotPassword({
	userIdOrEmail,
}: {
	userIdOrEmail: string;
}) {
	const response = await fetch(`/api/user/password-reset`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userIdOrEmail }),
	});
	if (!response.ok) {
		const message = (await response
			.json()
			.then((data) => data.message)) as string;
		throw new Error(message);
	}
	return await response.json();
}
export async function pinTrack(trackId: string): Promise<Track> {
	const response = await fetch(`/api/user/pin-track`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ trackId }),
	});
	console.log('response: ', response);
	if (!response.ok) {
		const message = (await response
			.json()
			.then((data) => data.message)) as string;
		throw new Error(message);
	}
	const { trackPin } = await response.json();
	return trackPin;
}
export async function unPinTrack(trackId: string) {
	const response = await fetch(`/api/user/pin-track`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ trackId }),
	});
	if (!response.ok) {
		const message = (await response
			.json()
			.then((data) => data.message)) as string;
		throw new Error(message);
	}
	return await response.json();
}
