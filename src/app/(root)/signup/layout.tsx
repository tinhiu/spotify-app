'use client';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren, useEffect } from 'react';
import { useAuth } from '~/providers/AuthContextProvider';
import Loading from '~/components/Loading';
import { useAppSelector } from '~/lib/hooks';

type Props = PropsWithChildren<{}>;

const SignupLayout = ({ children }: Props) => {
	const router = useRouter();
	const { isAuthenticated, loading } = useAppSelector((state) => state.user);
	useEffect(() => {
		if (isAuthenticated) router.push('/');
	}, []);
	if (loading) return <Loading />;

	return !isAuthenticated && <>{children}</>;
};

export default SignupLayout;
