'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Loading from '~/components/Loading';
import Nav from '~/components/Nav';
import { useAppDispatch, useAppSelector } from '~/lib/hooks';
import { useAuth } from '~/providers/AuthContextProvider';
import { getCurrentUser } from '~/redux/slices/user';

type Props = React.PropsWithChildren<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>;

function Layout({ children, modal }: Props) {
	const path = usePathname();
	const { user, loading } = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (!user) {
			dispatch(getCurrentUser());
		}
	}, []);

	if (loading) return <Loading />;
	if (path == '/login' || path == '/signup' || path == '/password-reset')
		return children;
	return (
		<div className='min-w-screen min-h-screen bg-[--background-light] flex flex-col items-center justify-start px-0 sm:px-5 py-5'>
			<div className='max-w-lg w-full '>
				<div className='flex flex-col items-center justify-between'>
					<div className='relative block w-full'>
						<Nav />
						{modal}
						<div className='mx-auto w-full sm:max-w-3xl'>{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Layout;
