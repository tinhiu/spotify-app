import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE() {
	try {
		const cookieStore = cookies();
		cookieStore.delete('session');
		return NextResponse.json(
			{ message: 'Logged out successfully.' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong.' },
			{ status: 500 }
		);
	}
}
