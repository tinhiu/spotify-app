'use client';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren, useEffect } from 'react';
import Loading from '~/components/Loading';
import { useAppSelector } from '~/lib/hooks';

type Props = PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
	const router = useRouter();
	const { isAuthenticated, user, loading } = useAppSelector(
		(state) => state.user
	);

	useEffect(() => {
		if (!isAuthenticated && !user) {
			router.push('/login');
		}
	}, []);
	if (loading) {
		return <Loading />;
	}

	return <>{children}</>;
};

export default Layout;
