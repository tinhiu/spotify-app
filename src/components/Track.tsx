'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { HiDotsHorizontal } from 'react-icons/hi';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { IoPlay } from 'react-icons/io5';
import { PiMusicNotesFill } from 'react-icons/pi';
import { GrPin } from 'react-icons/gr';
import { RiUnpinLine } from 'react-icons/ri';
import {
	AiOutlineDelete,
	AiOutlinePauseCircle,
	AiOutlinePlayCircle,
} from 'react-icons/ai';
import { BsFillPlayFill } from 'react-icons/bs';
import { FaPause } from 'react-icons/fa6';
import { Track } from '~/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAppDispatch, useAppSelector } from '~/lib/hooks';
import {
	setIsLoading,
	setIsPlaying,
	updateProgress,
} from '~/redux/slices/track';
import Spinner from './Spinner';
import { useToast } from '~/components/ui/use-toast';

import {
	deleteTrack,
	pinTrack,
	savedTrack,
	unPinTrack,
} from '~/redux/slices/user';
type TrackProps = {
	track: Track;
	isPin?: boolean;
	searchPage?: boolean;
	proFilePage?: boolean;
	playTrack?: (url: string) => void;
	trackPreview?: string;
	isPlaying?: boolean;
};
const TrackComp = ({
	track,
	isPin,
	searchPage,
	proFilePage,
	playTrack,
	trackPreview,
	isPlaying,
}: TrackProps) => {
	const { progress, isLoading } = useAppSelector((state) => state.track);

	const dispatch = useAppDispatch();
	const path = usePathname();
	const [popper, setPopper] = useState(false);
	const { isAuthenticated, user, userProfilePage } = useAppSelector(
		(state) => state.user
	);
	const { toast } = useToast();
	return (
		<div
			className={`w-full relative px-4 py-3 flex items-center justify-between ${
				!isPin ? 'border-b border-gray-400/60 ' : 'bg-green-400'
			}`}
		>
			<Link
				href={`/track/${track.track_id}`}
				className='w-full flex items-center justify-start space-x-4 overflow-auto'
			>
				<div className='h-full relative'>
					<Image
						src={track.image_url}
						width={50}
						height={50}
						alt={track.name}
						className='rounded-md object-contain'
					/>
					<IoPlay
						className='absolute text-white opacity-80 m-auto top-0 bottom-0 left-0 right-0'
						size={19}
					/>
				</div>
				<div className='w-full flex flex-col text-sm overflow-hidden'>
					<div className='flex items-center'>
						<span className='font-bold truncate'>{track.name}</span>
					</div>
					<div className='flex items-center'>
						<span className='text-gray-600 font-normal truncate'>
							{track.artist}
						</span>
					</div>
				</div>
			</Link>
			<div className='ml-2'>
				{isAuthenticated ? (
					<Popover open={popper} onOpenChange={setPopper}>
						<div className='flex items-center gap-2'>
							<PopoverTrigger>
								{proFilePage ? (
									<HiDotsHorizontal size={19} />
								) : (
									<PiDotsThreeOutlineVerticalFill size={19} />
								)}
							</PopoverTrigger>
							{searchPage ? (
								<>
									{isPlaying &&
									trackPreview === track.preview_url &&
									!isLoading &&
									!isNaN(progress) ? (
										<>
											<div className='relative bg-gray-300 rounded-full'>
												<FaPause
													className='absolute top-1/2 transform -translate-y-1/2 w-full'
													size={'22px'}
													onClick={() => dispatch(setIsPlaying(!isPlaying))}
												/>
												<svg
													width='36'
													height='36'
													viewBox='0 0 36 36'
													xmlns='http://www.w3.org/2000/svg'
												>
													<g className='origin-center -rotate-90 transform'>
														<circle
															cx='18'
															cy='18'
															r='16'
															fill='none'
															className='stroke-current text-blue-600 dark:text-blue-500 transition-all duration-200 ease-linear'
															strokeWidth='4'
															strokeLinecap='round'
															strokeDasharray={101}
															strokeDashoffset={
																101 -
																Math.round(!isNaN(progress) ? progress : 0)
															}
														></circle>
													</g>
												</svg>
											</div>
										</>
									) : (
										<div className='relative bg-gray-300 rounded-full flex items-center w-9 h-9'>
											{isLoading && trackPreview === track.preview_url ? (
												<span className='flex items-center justify-center w-full'>
													<Spinner />
												</span>
											) : (
												<BsFillPlayFill
													className='absolute top-1/2 transform -translate-y-1/2 w-full ml-[2px]'
													size={'27px'}
													onClick={() => {
														dispatch(setIsLoading(true));
														if (trackPreview !== track.preview_url) {
															dispatch(
																updateProgress({ progress: 0, currentTime: 0 })
															);
															dispatch(setIsPlaying(true));
														} else {
															dispatch(setIsPlaying(!isPlaying));
														}
														playTrack!(track.preview_url!);
													}}
												/>
											)}
										</div>
									)}
								</>
							) : null}
						</div>
						<PopoverContent
							onPointerDown={() => setPopper(false)}
							className='w-36 z-0 p-2 border-0 bg-white text-black'
							align='end'
							side='bottom'
						>
							<ul className='space-y-2 text-sm'>
								{user?.track?.track_id === track.track_id &&
								userProfilePage?.user_id === user?.user_id ? (
									<li
										className='flex items-center px-2 py-1 rounded hover:bg-slate-400'
										onClick={() => {
											dispatch(unPinTrack({ trackId: track.track_id })).then(
												(action) => {
													toast({
														description: action.payload.message,
														variant: 'pin',
													});
												}
											);
										}}
									>
										<span className='flex items-center w-full'>
											<RiUnpinLine size={19} className='mr-2' />
											<p>Unpin track</p>
										</span>
									</li>
								) : (
									<li
										className='flex items-center px-2 py-1 rounded hover:bg-slate-400'
										onClick={() =>
											dispatch(pinTrack({ trackId: track.track_id })).then(
												(action) => {
													toast({
														description: action.payload.message,
														variant: 'pin',
													});
												}
											)
										}
									>
										<span className='flex items-center w-full'>
											<GrPin size={19} className='mr-2' />
											<p>Pin track</p>
										</span>
									</li>
								)}
								{(path.startsWith('/search') ||
									userProfilePage?.user_id !== user?.user_id) && (
									<li
										className='flex items-center px-2 py-1 rounded hover:bg-slate-400'
										onClick={() => {
											dispatch(savedTrack({ trackId: track.track_id })).then(
												(action) => {
													toast({
														description: action.payload.message,
														variant: 'pin',
													});
												}
											);
										}}
									>
										<span className='flex items-center'>
											<PiMusicNotesFill size={19} className='mr-2' />
											<p>Select track</p>
										</span>
									</li>
								)}
								{userProfilePage?.user_id === user?.user_id && (
									<li
										className='flex items-center px-2 py-1 rounded hover:bg-slate-400'
										onClick={() => {
											dispatch(deleteTrack({ trackId: track.track_id })).then(
												(action) => {
													toast({
														description: action.payload.message,
														variant: 'pin',
													});
												}
											);
										}}
									>
										<span className='flex items-center'>
											<AiOutlineDelete size={19} className='mr-2' />
											<p>Delete track</p>
										</span>
									</li>
								)}
							</ul>
						</PopoverContent>
					</Popover>
				) : (
					<div className='flex items-center'>
						<>
							{isPlaying && trackPreview === track.preview_url && !isLoading ? (
								<>
									<div className='relative bg-gray-300 rounded-full'>
										<FaPause
											className='absolute top-1/2 transform -translate-y-1/2 w-full'
											size={'22px'}
											onClick={() => dispatch(setIsPlaying(!isPlaying))}
										/>
										<svg
											width='36'
											height='36'
											viewBox='0 0 36 36'
											xmlns='http://www.w3.org/2000/svg'
										>
											<g className='origin-center -rotate-90 transform'>
												<circle
													cx='18'
													cy='18'
													r='16'
													fill='none'
													className='stroke-current text-blue-600 dark:text-blue-500 transition-all duration-200 ease-linear'
													strokeWidth='4'
													strokeLinecap='round'
													strokeDasharray={101}
													strokeDashoffset={
														101 - Math.round(!isNaN(progress) ? progress : 0)
													}
												></circle>
											</g>
										</svg>
									</div>
								</>
							) : (
								<div className='relative bg-gray-300 rounded-full flex items-center w-9 h-9'>
									{isLoading && trackPreview === track.preview_url ? (
										<span className='flex items-center justify-center w-full'>
											<Spinner />
										</span>
									) : (
										<BsFillPlayFill
											className='absolute top-1/2 transform -translate-y-1/2 w-full ml-[2px]'
											size={'27px'}
											onClick={() => {
												dispatch(setIsLoading(true));
												if (trackPreview !== track.preview_url) {
													dispatch(
														updateProgress({ progress: 0, currentTime: 0 })
													);
													dispatch(setIsPlaying(true));
												} else {
													dispatch(setIsPlaying(!isPlaying));
												}
												playTrack!(track.preview_url!);
											}}
										/>
									)}
								</div>
							)}
						</>
					</div>
				)}
			</div>
		</div>
	);
};

export default TrackComp;
