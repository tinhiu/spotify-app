'use client';

import Link from 'next/link';
import Image from 'next/image';

import { PointerEventHandler, useEffect, useState } from 'react';
import {
	AnimatePresence,
	motion,
	useDragControls,
	useMotionValue,
} from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { GrPin } from 'react-icons/gr';
import { PiArrowSquareOutFill } from 'react-icons/pi';
import { RiUnpinLine } from 'react-icons/ri';
import { PiMusicNotesFill } from 'react-icons/pi';
import { AiOutlineDelete } from 'react-icons/ai';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
} from '~/components/ui/dialog';

import { Track } from '~/types';
import AudioMusic from '~/components/AudioModal';
import { useAppDispatch, useAppSelector } from '~/lib/hooks';
import {
	deleteTrack,
	pinTrack,
	savedTrack,
	unPinTrack,
} from '~/redux/slices/user';
import { useToast } from '~/components/ui/use-toast';
import Loading from '~/components/Loading';
export function Modal({ track }: { track: Track }) {
	const { isAuthenticated, user, userProfilePage } = useAppSelector(
		(state) => state.user
	);
	const controls = useDragControls();
	const y = useMotionValue(0);
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const router = useRouter();
	let containTrack = undefined;
	const [open, setOpen] = useState(true);
	const [isReady, setIsReady] = useState(false);
	const [popper, setPopper] = useState(false);
	if (userProfilePage?.collection) {
		containTrack = userProfilePage?.collection!.find(
			(t) => t.track_id === track.track_id
		);
	}
	useEffect(() => {
		setTimeout(() => {
			setIsReady(true);
		}, 1000);
	}, []);
	if (!isReady) return <Loading />;
	function startDrag(event: React.PointerEvent) {
		controls.start(event);
	}
	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				setOpen(!open);
				router.back();
			}}
		>
			<DialogOverlay className='bg-black/30 backdrop-blur-3xl '>
				{/* <Image
					src={track.image_url}
					alt={track.name}
					width={0}
					height={0}
					fill
					className='w-full h-full object-cover'
				/> */}
			</DialogOverlay>
			<DialogContent
				className='flex flex-col justify-between items-center border-0 w-full sm:w-[30rem] rounded-none h-full p-0'
				hideCloseButton={true}
			>
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					initial={{ opacity: 0, y: 5 }}
					transition={{
						ease: 'linear',
						duration: 1,
						y: { duration: 1 },
					}}
					onClick={(e) => e.stopPropagation()}
					drag='y'
					dragControls={controls}
					dragListener={false}
					onPointerDown={startDrag}
					dragConstraints={{
						top: 0,
						bottom: -5,
					}}
					dragElastic={{
						top: 0,
						bottom: 0.5,
					}}
					onDragEnd={() => {
						if (y.get() > 160) {
							setOpen(!open);
							router.back();
						}
					}}
					style={{ y }}
					className='flex flex-col items-center justify-between h-full w-full '
				>
					<DialogOverlay className='w-full h-full overflow-hidden bg-gray-700'>
						<Image
							src={track.image_url}
							alt={track.name}
							width={0}
							height={0}
							fill
							className='w-full h-full object-cover blur-2xl'
						/>
					</DialogOverlay>
					<DialogHeader className='w-full pt-4 z-50 text-white'>
						<div className='flex justify-between items-center px-3 pt-2'>
							<DialogTitle className='w-full flex flex-row justify-start items-start max-w-[70%]'>
								<IoClose
									size={28}
									onClick={() => {
										setOpen(!open);
										router.back();
									}}
									className='cursor-pointer'
								/>
								<div className='relative flex flex-col justify-start items-start ml-2 text-left w-[90%]'>
									<p className='w-full text-sm font-bold truncate'>
										{track.name}
									</p>
									<p className='w-full text-xs font-normal truncate'>
										{track.artist}
									</p>
									<Link href={track.external_urls} target='_blank'>
										<div className='absolute px-[2px] py-[1px] rounded-lg border-2 border-white left-0 -bottom-8 w-28 flex justify-center items-center'>
											<div className='flex flex-row justify-center items-center'>
												<PiArrowSquareOutFill
													size={24}
													className='text-white'
												/>
												<p className='text-xs font-normal px-1'>
													Play full song
												</p>
											</div>
										</div>
									</Link>
								</div>
							</DialogTitle>
							{isAuthenticated && (
								<Popover open={popper} onOpenChange={setPopper}>
									<PopoverTrigger>
										<HiDotsHorizontal size={24} />
									</PopoverTrigger>
									<PopoverContent
										onPointerDown={() => setPopper(false)}
										className='w-48 rounded-[8px] border-0 p-0 bg-[--background-elevated-base] text-[--text-base]'
										align='end'
										side='bottom'
									>
										<ul className='p-1 text-sm rounded-lg bg-white text-black'>
											{user?.track?.track_id === track.track_id &&
											userProfilePage?.user_id === user?.user_id ? (
												<li
													className='flex items-center px-2 py-1 rounded hover:bg-slate-400'
													onClick={() => {
														dispatch(
															unPinTrack({ trackId: track.track_id })
														).then((action) => {
															toast({
																description: action.payload.message,
																variant: 'pin',
															});
														});
													}}
												>
													<span className='flex items-center'>
														<RiUnpinLine size={19} className='mr-2' />
														<p>Unpin track</p>
													</span>
												</li>
											) : (
												<li
													className='flex items-center px-2 py-1 rounded hover:bg-slate-400'
													onClick={() =>
														dispatch(
															pinTrack({ trackId: track.track_id })
														).then((action) => {
															toast({
																description: action.payload.message,
																variant: 'pin',
															});
														})
													}
												>
													<span className='flex items-center'>
														<GrPin size={19} className='mr-2' />
														<p>Pin track</p>
													</span>
												</li>
											)}

											{user?.user_id !== userProfilePage?.user_id && (
												<li
													className='flex items-center px-2 py-1 rounded hover:bg-slate-400'
													onClick={() => {
														dispatch(
															savedTrack({ trackId: track.track_id })
														).then((action) => {
															toast({
																description: action.payload.message,
																variant: 'pin',
															});
														});
													}}
												>
													<span className='flex items-center'>
														<PiMusicNotesFill size={19} className='mr-2' />
														<p>Select track</p>
													</span>
												</li>
											)}

											{containTrack &&
												user?.user_id === userProfilePage?.user_id && (
													<li
														className='flex items-center px-2 py-1 rounded hover:bg-slate-400'
														onClick={() => {
															dispatch(
																deleteTrack({ trackId: track.track_id })
															).then((action) => {
																toast({
																	description: action.payload.message,
																	variant: 'pin',
																});
															});
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
							)}
						</div>
					</DialogHeader>

					<div className='w-full h-full flex items-center justify-center'>
						<Image
							src={track.image_url}
							alt={track.name}
							width={0}
							height={0}
							className='w-full h-auto object-contain z-50'
						/>
					</div>

					<DialogFooter className='z-50 p-4 w-full'>
						{track.preview_url ? (
							<AudioMusic src={track.preview_url!} />
						) : (
							<p className='flex justify-end text-sm italic font-sans font-semibold'>
								*preview not available
							</p>
						)}
					</DialogFooter>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
