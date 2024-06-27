'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IoPlay } from 'react-icons/io5';
import { FaRegCirclePause } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import {
	setIsLoading,
	setIsPlaying,
	updateProgress,
} from '~/redux/slices/track';
import { useAppSelector } from '../lib/hooks';
const AudioTrack = ({
	path,
	src,
	playTrack,
	// setIsPlaying,
	isPlaying,
}: {
	path: string;
	src: string;
	playTrack: (url: string) => void;
	// setIsPlaying: (isPlaying: boolean) => void;
	isPlaying: boolean;
}) => {
	const dispatch = useDispatch();
	const audioRef = useRef<HTMLAudioElement>(new Audio());
	const [currentSong, setCurrentSong] = useState(audioRef);

	useEffect(() => {
		if (!audioRef) return;
		if (isPlaying && audioRef.current) {
			setTimeout(() => {
				dispatch(updateProgress({ progress: 0, currentTime: 0 }));
				dispatch(setIsLoading(false));
			}, 400);

			setTimeout(() => {
				currentSong.current!.play();
			}, 500);
		} else {
			setTimeout(() => {
				currentSong.current!.pause();
			}, 0);
		}
	}, [src, isPlaying]);

	useEffect(() => {
		if (!src) {
			dispatch(setIsPlaying(false));
			return;
		}
		if (audioRef.current) {
			audioRef.current.src = src;
			audioRef.current.volume = 0.25;
		}
	}, [src]);

	useEffect(() => {
		currentSong.current!.pause();
		audioRef.current.volume = 0;
		dispatch(setIsLoading(false));
		playTrack('');
	}, [path]);

	const timeUpdateHandler = async (e: React.ChangeEvent<HTMLAudioElement>) => {
		const current = e.target.currentTime;
		const duration = e.target.duration;
		let progressWidth = (current / duration) * 100;

		dispatch(updateProgress({ progress: progressWidth, currentTime: current }));
	};
	return (
		<>
			<audio
				loop
				preload='none'
				className='audio'
				ref={audioRef}
				onTimeUpdate={timeUpdateHandler}
				onLoadedMetadata={timeUpdateHandler}
			>
				<source src={src} type='audio/mpeg' />
			</audio>
		</>
	);
};

export default AudioTrack;
