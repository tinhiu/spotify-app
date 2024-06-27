import { useEffect, useRef, useState } from 'react';
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from 'react-icons/ai';
function AudioMusic({ src }: { src: string }) {
	const audioRef = useRef<HTMLAudioElement>(new Audio());
	const [playing, setPlaying] = useState(false);
	const [currentSong, setCurrentSong] = useState(audioRef);
	const [musicInfo, setMusicInfo] = useState({
		volume: 0,
		currentTime: 0,
		duration: 0,
		progressWidth: 0,
	});

	useEffect(() => {
		if (!src) {
			setPlaying(false);
			return;
		} // don't have preview_url
		if (audioRef.current) {
			currentSong.current.src = src;
			currentSong.current.volume = 0.25;
			setTimeout(function () {
				currentSong.current.play();
			}, 100);
		}
		setPlaying(true);
	}, [currentSong, src]);
	const handlePausePlayClick = () => {
		if (playing) {
			currentSong.current!.pause();
			setPlaying(!playing);
		} else {
			currentSong.current!.play();
			setPlaying(!playing);
		}
	};
	const timeUpdateHandler = async (e: React.ChangeEvent<HTMLAudioElement>) => {
		const current = e.target.currentTime;
		const duration = e.target.duration;
		let progressWidth = (current / duration) * 100;
		setMusicInfo({
			...musicInfo,
			currentTime: current,
			duration: duration,
			progressWidth,
		});
	};
	const handlerSkipProgress = (e: React.MouseEvent<HTMLElement>) => {
		let progressWidthValue; // max width div
		if (e.currentTarget.childElementCount !== 0) {
			progressWidthValue = e.currentTarget.clientWidth;
		} else {
			progressWidthValue = e.currentTarget.parentElement!.clientWidth;
		}
		let clickedOffSetX = e.nativeEvent.offsetX;
		let songDuration = currentSong.current!.duration;
		let currentTime = Math.floor(
			(clickedOffSetX / progressWidthValue) * songDuration
		);

		currentSong.current!.currentTime = currentTime;
	};
	const formatTime = (currentTime: number) => {
		let minutes = Math.floor(currentTime / 60);
		let seconds: string | number = Math.floor(currentTime % 60);
		seconds = seconds >= 10 ? seconds : `0` + (seconds % 60);
		const formatTime = minutes + ':' + seconds;
		return formatTime;
	};

	return (
		<>
			{musicInfo.duration != 0 && !isNaN(musicInfo.duration) ? (
				<div className='w-full flex items-center text-white'>
					<span className='leading-none w-12'>
						{formatTime(musicInfo.currentTime || 0)}
					</span>
					<div
						className='progress-area mx-2 bg-gray-400 '
						onClick={(e) => handlerSkipProgress(e)}
					>
						<div
							className='progress-bar relative rounded-sm h-full bg-rose-200 transition-all duration-300 ease-linear will-change-[width]'
							style={{ width: `${musicInfo.progressWidth}%` }}
						></div>
					</div>
					<div className='ml-2 flex items-center'>
						<div className='mr-[2px]'>
							<span className='block leading-none'>
								{formatTime(musicInfo.duration || 0)}
							</span>
						</div>
						{playing ? (
							<AiOutlinePauseCircle
								className=''
								size={'24px'}
								onClick={handlePausePlayClick}
							/>
						) : (
							<AiOutlinePlayCircle
								className=''
								size={'24px'}
								onClick={handlePausePlayClick}
							/>
						)}
					</div>
				</div>
			) : (
				<div className='flex items-center w-full'>
					<div className='h-[24px] w-full rounded-lg bg-neutral-400/5 dark:bg-rose-400/5'></div>
				</div>
			)}
			<audio
				loop
				preload='none'
				ref={audioRef}
				onTimeUpdate={timeUpdateHandler}
				onLoadedMetadata={timeUpdateHandler}
				className='audio'
			>
				<source src={src} type='audio/mpeg' />
			</audio>
		</>
	);
}

export default AudioMusic;
