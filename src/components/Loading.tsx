import Image from 'next/image';
import spotify from '../../public/images/spotify-logo3.gif';

export default function Loading() {
	return (
		<div className='fixed z-[99] bg-white top-0 left-0 right-0 bottom-0 flex justify-center items-center h-screen w-full'>
			<div className='w-10 h-10 text-black'>
				<Image
					alt='spotify'
					src={spotify}
					width={100}
					height={100}
					priority
					className='w-full h-full object-cover'
				/>
			</div>
		</div>
	);
}
