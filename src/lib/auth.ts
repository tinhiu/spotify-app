import { SignJWT, jwtVerify } from 'jose';
import { getCookie, deleteCookie } from 'cookies-next';
import { SECRET_KEY } from '~/server/constants';
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1d')
		.sign(key);
}

export async function decrypt(input: string): Promise<any> {
	try {
		const { payload } = await jwtVerify(input, key, {
			algorithms: ['HS256'],
		});
		return payload;
	} catch (error) {
		await deleteCookie('session');
		return null;
	}
}

export async function getSession() {
	const session = getCookie('session');
	if (!session) return null;
	const data = await decrypt(session);
	return data;
}
