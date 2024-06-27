'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import ColorThief from 'colorthief';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import Loading from '~/components/Loading';
import TrackComp from '~/components/Track';
import { useAppDispatch, useAppSelector } from '~/lib/hooks';
import { getUserById, setUserProfilePage } from '~/redux/slices/user';
import Spinner from '~/components/Spinner';
type Props = {
	params: { userId: string };
};

const UserPage = ({ params: { userId } }: Props) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { user, userProfilePage, isAuthenticated } = useAppSelector(
		(state) => state.user
	);
	let currentUser = userProfilePage;
	const ref = useRef<HTMLImageElement>(null);
	const [color, setColor] = useState([225, 213, 213]);
	const [isReady, setIsReady] = useState(false);
	const { data, isPending } = useQuery({
		queryKey: ['user', userId],
		queryFn: async () => {
			const data = await dispatch(getUserById({ userId }));
			if (data.payload.status === 200) {
				currentUser = data.payload.user;
				dispatch(setUserProfilePage(data.payload.user));
			} else {
				currentUser = null;
				dispatch(setUserProfilePage(null));
			}
			return data.payload;
		},
	});

	useEffect(() => {
		if (!ref.current) return;
		const img = ref.current;
		if (!img) return;
		img.crossOrigin = 'Anonymous';
		if (img.complete) {
			setColor(new ColorThief().getColor(img));
		} else {
			img.addEventListener('load', () => {
				setColor(new ColorThief().getColor(img));
			});
		}
	}, []);

	const onLoadCallback = () => {
		setTimeout(() => {
			setIsReady(true);
		}, 900);
	};
	if (isPending) return <Loading />;

	if (currentUser === null && data.status > 200) {
		return (
			<div className='flex justify-center items-center mt-12'>
				<p className='text-2xl font-semibold italic'>User not found</p>
			</div>
		);
	}
	if (!currentUser) {
		return (
			<div className='flex justify-center items-center mt-12'>
				<Spinner />
			</div>
		);
	}
	return (
		currentUser && (
			<div className='flex flex-col justify-center items-center space-y-2'>
				<div className='flex justify-center w-full relative pt-4 pb-2'>
					<div className='relative flex justify-center items-center z-[1]'>
						<Image
							ref={ref}
							src={currentUser.image_url! || ''}
							className='pointer-events-none h-32 w-32 rounded-full drop-shadow-md '
							alt={`${currentUser.display_name}`}
							width={0}
							height={0}
							loading='lazy'
							decoding='async'
							onLoad={onLoadCallback}
						/>
					</div>
					<div className='whitespace-nowrap px-2 sm:px-4 text-sm flex flex-col justify-center z-[1]'>
						<span>PROFILE</span>
						<Link
							href={currentUser.external_urls! || ''}
							target='_blank'
							className='w-full truncate font-bold text-gray-900 dark:text-[#e1eafd]'
							rel='noreferrer'
						>
							<h6 className='sm:text-4xl text-lg'>
								{currentUser.display_name}
							</h6>
						</Link>
						<Link
							href={`${currentUser.external_urls!}/followers`}
							target='_blank'
							className='w-full truncate font-medium text-gray-900 hover:underline dark:text-[#e1eafd]'
							rel='noreferrer'
						>
							<p>● Followers</p>
						</Link>
						<Link
							href={`${currentUser.external_urls!}/following`}
							target='_blank'
							className='w-full truncate font-medium text-gray-900 hover:underline dark:text-[#e1eafd]'
							rel='noreferrer'
						>
							<p>● Following</p>
						</Link>
						<Link
							href={`${currentUser?.external_urls!}/playlists`}
							target='_blank'
							className='w-full truncate font-medium text-gray-900 hover:underline dark:text-[#e1eafd]'
							rel='noreferrer'
						>
							<p>● Public Playlists</p>
						</Link>
					</div>
					<div
						className='w-full h-full absolute top-0 left-0 right-0 bottom-0 transition-all duration-300 ease-in'
						style={{
							backgroundColor: `${!isReady && `rgba(${color.join(',')}, 1)`}`,
							borderColor: `${!isReady && `rgba(${color.join(',')}, 1 )`}`,
						}}
					></div>
				</div>
				<div className='flex w-full justify-center items-center '>
					{currentUser.track !== null ? (
						<TrackComp
							track={currentUser.track}
							isPin={true}
							proFilePage={true}
						/>
					) : (
						<div className='w-full flex justify-center items-center h-16 bg-green-400'>
							<span>{'📌'}</span>
						</div>
					)}
				</div>
				{currentUser.collection.length > 0 ? (
					<div className='flex flex-col justify-center items-center w-full'>
						<div className='block w-full h-full relative z-0  pt-4 overflow-hidden bg-white'>
							{currentUser.collection.map((track, index) => {
								return (
									<div
										key={index}
										className='flex flex-col items-center justify-center'
									>
										<TrackComp track={track} proFilePage={true} />
									</div>
								);
							})}
						</div>
					</div>
				) : (
					<p>No track saved</p>
				)}
			</div>
		)
	);
};
const tracks = Array.from({ length: 100 }).map((data, i) => {
	return {
		id: i,
		track_id: '5awNIWVrh2ISfvPd5IUZNh',
		artist: `LOONA ${i}`,
		name: `PTT (Paint The Town) ${i}`,
		album: `album ${i}`,
		duration_ms: 201120,
		explicit: false,
		external_urls: 'https://open.spotify.com/track/5awNIWVrh2ISfvPd5IUZNh',
		preview_url:
			'https://p.scdn.co/mp3-preview/0162dc27da3d547cf005754688bfecc7b2899f75?cid=cfe923b2d660439caf2b557b21f31221',
		image_url:
			'https://i.scdn.co/image/ab67616d0000b273608cf05fbd3605c77444917f',
		type: 'track',
	};
});
export default UserPage;
