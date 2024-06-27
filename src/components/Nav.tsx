'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { IoMdLogIn } from 'react-icons/io';
import { FaRegHandPointLeft } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa';
import { FcSearch } from 'react-icons/fc';
import { useAuth } from '~/providers/AuthContextProvider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import logo from '../../public/images/spotify-logo2.png';
import { useAppDispatch, useAppSelector } from '~/lib/hooks';
import { logout } from '~/redux/slices/user';
const guestsOptions = [
	{
		name: 'Log in',
		href: '/login',
		icon: IoMdLogIn,
	},
	{
		name: 'Sign up',
		href: '/signup',
		icon: FaRegHandPointLeft,
	},
];

type Props = {};

const Nav = (props: Props) => {
	const router = useRouter();
	const [popper, setPopper] = useState(false);
	const { user } = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();
	const onLogOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(logout());

		router.push('/');
	};
	const userOptions = [
		{
			name: 'Profile',
			href: '/user',
			icon: FaRegUser,
		},
		{
			name: 'Log out',
			onClick: onLogOut,
		},
	];

	return (
		<header className='w-full h-16 z-1 flex sticky top-0 z-50 rounded-tl-md rounded-tr-md border-b border-gray-400/20 bg-white/70 backdrop-blur'>
			<nav className='w-full flex justify-between items-center p-4'>
				<div className='rounded-full overflow-hidden'>
					<Link href={'/'}>
						<Image src={logo} className='w-12 h-12' alt='logo' priority />
					</Link>
				</div>
				<div className='rounded-full overflow-hidden'>
					<Link
						href={'/search'}
						className='w-12 h-12 flex justify-center items-center'
					>
						<FcSearch size={35} />
					</Link>
				</div>
				<Popover open={popper} onOpenChange={setPopper}>
					<PopoverTrigger>
						{user ? (
							<div
								className={`rounded-full btn p-1 ${
									user &&
									'bg-[--background-base] shadow-lg hover:bg-[--background-menu-base] hover:scale-105 transition duration-200 ease-linear'
								} `}
							>
								<div className='w-8 h-8 rounded-full overflow-hidden'>
									<Image
										className='w-full h-full object-cover'
										width={0}
										height={0}
										src={user?.image_url! || ''}
										alt='user'
									/>
								</div>
							</div>
						) : (
							<FaRegUser className='w-full h-full' size={25} />
						)}
					</PopoverTrigger>
					<PopoverContent
						onPointerDown={() => setPopper(false)}
						className='w-48 rounded-[8px] border-0 p-0 bg-[--background-elevated-base] text-[--text-base]'
						align='end'
						side='bottom'
					>
						{
							<ul className='p-1 text-sm rounded-lg bg-[--background-menu-base]'>
								{user ? (
									<>
										{userOptions.map((option, index) => (
											<li key={index}>
												{option.href ? (
													<Link
														href={
															option.href === '/user'
																? '/user/' + user.user_id
																: option.href
														}
														className={
															'flex relative justify-between items-center p-3 w-full hover:bg-[--background-tinted-highlight]'
														}
													>
														<span className='w-full text-start'>
															{' '}
															{option.name}{' '}
														</span>
														{option.icon && <option.icon />}
													</Link>
												) : (
													<Button
														onClick={option.onClick}
														className={`flex relative justify-between items-center p-4 w-full hover:bg-[--background-tinted-highlight] ${
															userOptions.length - 2 === index
																? 'before:content-[""] before:absolute before:border-b-[1px] before:bottom-0 before:left-0 before:right-0 before:border-[--essential-subdued]'
																: ''
														}`}
													>
														<span className='w-full text-start'>
															{' '}
															{option.name}{' '}
														</span>
														{option.icon && <option.icon />}
													</Button>
												)}
											</li>
										))}
									</>
								) : (
									<>
										{' '}
										{guestsOptions.map((option, index) => (
											<li key={index}>
												<Link
													href={option.href}
													className={
														'flex relative justify-between items-center p-3 w-full hover:bg-[--background-tinted-highlight]'
													}
												>
													<span className='w-full text-start'>
														{' '}
														{option.name}{' '}
													</span>
													{option.icon && <option.icon />}
												</Link>
											</li>
										))}
									</>
								)}
							</ul>
						}
					</PopoverContent>
				</Popover>
			</nav>
		</header>
	);
};

export default Nav;
