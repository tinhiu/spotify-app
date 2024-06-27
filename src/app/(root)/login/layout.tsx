'use client';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren, useEffect } from 'react';
import Loading from '~/components/Loading';
import { useAppDispatch, useAppSelector } from '~/lib/hooks';
import { useAuth } from '~/providers/AuthContextProvider';
import { getCurrentUser } from '~/redux/slices/user';

type Props = PropsWithChildren<{}>;

const LoginLayout = ({ children }: Props) => {
	const router = useRouter();
	const { isAuthenticated, loading } = useAppSelector((state) => state.user);
	useEffect(() => {
		if (isAuthenticated) router.push('/');
	}, []);
	if (loading) return <Loading />;

	return !isAuthenticated && <>{children}</>;
};

export default LoginLayout;
