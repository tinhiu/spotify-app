'use client';

import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
	BaseSyntheticEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { MdClear } from 'react-icons/md';
import AudioTrack from '~/components/AudioTrack';
import TrackComp from '~/components/Track';
import { Input } from '~/components/ui/input';
import useDebounce from '~/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '~/lib/hooks';
import { setTrackPreview } from '~/redux/slices/track';
import { setUserProfilePage } from '~/redux/slices/user';
import { getTracksByName } from '~/services/track';

const SearchPage = () => {
	const dispatch = useAppDispatch();
	const { trackPreview, isPlaying } = useAppSelector((state) => state.track);
	const pathname = usePathname();
	const { replace } = useRouter();
	const searchParams = useSearchParams();
	const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const [searchValue, setSearchValue] = useState('');

	const query = useDebounce(searchValue, 800);
	const params = new URLSearchParams(searchParams);

	// const { mutate: getTracks, data } = useMutation({
	// 	mutationFn: getTracksByName,
	// });
	function handleSearch(e: BaseSyntheticEvent) {
		const searchValue = e.target.value;
		if (!searchValue.startsWith(' ')) {
			setSearchValue(e.target.value);
		}
	}

	useEffect(() => {
		if (query) {
			// getTracks(query)
			params.set('q', query);
		} else {
			params.delete('q');
		}
		replace(`${pathname}?${params.toString()}`);
	}, [query]);
	useEffect(() => {
		if (pathname.startsWith('/search')) {
			dispatch(setUserProfilePage(null));
		}
	}, []);
	const playTrackByPreview = useCallback(
		(preview: string) => {
			dispatch(setTrackPreview(preview));
		},
		[trackPreview]
	);
	return (
		<>
			<div className='flex flex-col items-center h-full justify-center sticky top-20 z-[1]'>
				<div className='absolute w-full h-full inline-block bg-white blur-2xl backdrop-blur-md -top-8 z-0'></div>
				<div className='w-full bg-white/10 backdrop-blur pt-8  pb-2 px-4 sm:px-0'>
					<form className='w-full bg sm:w-2/3 mx-auto rounded-xl relative'>
						<BiSearchAlt
							size={24}
							className='absolute text-gray-400 left-[10px] top-1/2 -translate-y-1/2'
						/>
						<Input
							placeholder='search track...'
							className='h-12 px-9 py-2 box-shadow-search rounded-xl border-2 border-neutral-700 ease-linear duration-200 '
							ref={inputRef}
							value={searchValue}
							onChange={handleSearch}
						/>
						{
							<MdClear
								size={19}
								onClick={() => {
									setSearchValue('');
									inputRef.current.focus();
								}}
								className={`absolute text-black right-[12px] top-1/2 -translate-y-1/2 opacity-0 ${
									searchValue ? 'opacity-100' : ''
								}  duration-800 ease-in-out transition `}
							/>
						}
					</form>
				</div>
			</div>

			<div className='block h-full relative z-0 mt-4 pt-2 overflow-hidden bg-white'>
				{tracks.map((track) => {
					return (
						<div
							key={track.id}
							className='flex flex-col items-center justify-center'
						>
							<TrackComp
								track={track}
								searchPage={true}
								playTrack={playTrackByPreview}
								isPlaying={isPlaying}
								trackPreview={trackPreview}
							/>
						</div>
					);
				})}
				<AudioTrack
					path={pathname}
					src={trackPreview}
					playTrack={playTrackByPreview}
					isPlaying={isPlaying}
				/>
			</div>
		</>
	);
};

const tracks = [
	{
		id: 1,
		track_id: '5awNIWVrh2ISfvPd5IUZNh',
		artist: `LOONA ${1}`,
		name: `PTT (Paint The Town) ${1}`,
		album: `album ${1}`,
		duration_ms: 201120,
		explicit: false,
		external_urls: 'https://open.spotify.com/track/5awNIWVrh2ISfvPd5IUZNh',
		preview_url:
			'https://p.scdn.co/mp3-preview/0162dc27da3d547cf005754688bfecc7b2899f75?cid=cfe923b2d660439caf2b557b21f31221',
		image_url:
			'https://i.scdn.co/image/ab67616d0000b273608cf05fbd3605c77444917f',
		type: 'track',
	},
	{
		id: 2,
		track_id: '6hw689zbjD67Fz6sB29eFm',
		artist: `Tied ${2}`,
		name: `COOING`,
		album: `album ${2}`,
		duration_ms: 215173,
		explicit: false,
		external_urls: 'https://open.spotify.com/album/19fwzaOnTSR4dy1o3uJCcb',
		preview_url:
			'https://p.scdn.co/mp3-preview/60d89ba6038d8cced93d7402443c351df73d6b76?cid=cfe923b2d660439caf2b557b21f31221',
		image_url:
			'https://i.scdn.co/image/ab67616d0000b273e9283d1ae7001fc11dad30d9',
		type: 'track',
	},
];
export default SearchPage;
