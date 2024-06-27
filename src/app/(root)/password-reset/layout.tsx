'use client';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren, useEffect } from 'react';
import Loading from '~/components/Loading';
import { useAppSelector } from '~/lib/hooks';
import { useAuth } from '~/providers/AuthContextProvider';

type Props = PropsWithChildren<{}>;

const PasswordResetLayout = ({ children }: Props) => {
	const router = useRouter();
	const { isAuthenticated, loading } = useAppSelector((state) => state.user);
	if (loading) return <Loading />;
	if (isAuthenticated) router.push('/');

	return !isAuthenticated && <>{children}</>;
};

export default PasswordResetLayout;
