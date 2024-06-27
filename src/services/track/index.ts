import { Track } from '~/types';

export async function getTracksByName(query: string) {
	const response = await fetch(`/api/spotify/tracks?q=${query}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});
	if (!response.ok) {
		const message = (await response
			.json()
			.then((data) => data.message)) as string;
		throw new Error(message);
	}
	return await response.json();
}
export async function getTrackById(trackId: string): Promise<Track> {
	const response = await fetch(`/api/spotify/track/${trackId}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});
	if (!response.ok) {
		const message = (await response
			.json()
			.then((data) => data.message)) as string;
		throw new Error(message);
	}
	const { track } = await response.json();
	return track;
}
export async function savedTrack(trackId: string) {
	const response = await fetch(`/api/spotify/tracks/saved`, {
		method: 'POST',
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

export async function unSavedTrack(trackId: string) {
	const response = await fetch(`/api/spotify/tracks/saved`, {
		method: 'DELETE',
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
