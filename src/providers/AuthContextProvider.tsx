'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSession } from '~/lib/auth';
import { getUserById, logout } from '~/services/user';
import { UserType } from '~/types';

const AuthContext = createContext<{
	isAuthenticated: boolean;
	user: UserType | null;
	loading: boolean;
	userPage: UserType | null;
	setAuth: (data: UserType) => Promise<void>;
	logOut: () => Promise<void>;
	onSetUserPage: (data: UserType | null) => Promise<void>;
}>({
	isAuthenticated: false,
	user: null,
	loading: true,
	userPage: null,
	setAuth: async () => {},
	logOut: async () => {},
	onSetUserPage: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<UserType | null>(null);
	const [userPage, setUserPage] = useState<UserType | null>(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function loadUserFromSession() {
			const session = await getSession();
			if (session && !user) {
				const data = await getUserById(session.userId);
				if (data) {
					setUser(data);
				}
			} else {
				setUser(null);
				setUserPage(null);
			}
			setLoading(false);
		}
		loadUserFromSession();
	}, []);
	async function setAuth(data: UserType) {
		setUser(data);
	}
	async function logOut() {
		setUser(null);
		setUserPage(null);
		await logout();
	}
	async function onSetUserPage(data: UserType | null) {
		setUserPage(data);
	}
	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!user,
				user,
				loading,
				userPage,
				setAuth,
				logOut,
				onSetUserPage,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
