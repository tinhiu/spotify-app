'use client';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaSpotify } from 'react-icons/fa';
import { PiWarningCircleBold } from 'react-icons/pi';

import { ButtonType, FormData } from '~/types';

import Spinner from '~/components/Spinner';
import { signUp } from '~/services/user';
import { useAppDispatch, useAppSelector } from '~/lib/hooks';
import { signup } from '~/redux/slices/user';

export default function SignUpPage() {
	const dispatch = useAppDispatch();
	const { isLoadingOther } = useAppSelector((state) => state.user);
	const router = useRouter();
	const formRef = useRef(null);
	const [error, setError] = useState('');
	const [type, setType] = useState<ButtonType>('button');

	useEffect(() => {
		if (formRef.current) {
			setType('submit');
		}
	}, [formRef, type]);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const onSubmit: SubmitHandler<FormData> = (data, e) => {
		e?.preventDefault();
		if (data.email === '' || data.password === '' || data.userId === '')
			return null;
		setError('');
		dispatch(
			signup({
				userId: data.userId,
				email: data.email,
				password: data.password,
			})
		).then((action) => {
			if (action.payload.status > 200) {
				setError(action.payload.data.message);
				return;
			}
			router.push('/login');
		});
	};
	return (
		<main className='w-full h-full flex flex-col break-words overflow-auto items-center justify-center bg-[--background-elevated-base] text-white'>
			<header className='pt-8 pb-6 w-full min-h-8 overflow-hidden flex justify-center border-b-0'>
				<Link href={'/'}>
					<span className='text-center'>
						<FaSpotify className='' size={50} />
					</span>
				</Link>
			</header>
			<section className='w-full h-screen flex justify-center flex-grow pb-0'>
				<div className='px-8 w-full sm:max-w-md'>
					<h1 className='text-3xl font-bold mb-10 text-center'>
						Sign up to start listening
					</h1>
					{error && (
						<div className='flex w-full mb-2 justify-center p-3 bg-[--essential-negative] text-[--essential-base] font-normal text-sm'>
							<PiWarningCircleBold size={21} className='flex-shrink-0 mr-1' />
							<span role='alert' className='break-words'>
								{error}
							</span>
						</div>
					)}
					<form onSubmit={handleSubmit(onSubmit)} ref={formRef} method='POST'>
						<div className='w-full block'>
							<div className='w-full'>
								<div className='p-0'>
									<label className='font-bold'>User id: </label>
								</div>
								<div className='w-full pt-2'>
									<input
										{...register('userId', { required: true })}
										aria-invalid={errors.userId ? 'true' : 'false'}
										placeholder='user id from spotify url...'
										className={`bg-transparent block border-0 transition ease-linear duration-100 font-medium text-base px-4 py-3 rounded-md w-full ${
											errors.userId ? 'box-shadow-error' : 'box-shadow-sm'
										}`}
									/>
									{errors.userId?.type === 'required' && (
										<div className='flex text-[--text-negative] font-normal mt-2 text-sm'>
											<PiWarningCircleBold
												size={21}
												className='flex-shrink-0 mr-1'
											/>
											<span role='alert' className='break-words'>
												Make sure you get your id from
												open.spotify.com/user/xxxxxxxxxx
											</span>
										</div>
									)}
									<br />
								</div>
							</div>
							<div className='w-full'>
								<div className='p-0'>
									<label className='font-bold'>Email: </label>
								</div>
								<div className='w-full pt-2'>
									<input
										{...register('email', {
											required: true,
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: 'Invalid email address',
											},
										})}
										aria-invalid={errors.email ? 'true' : 'false'}
										placeholder='email recover your password...'
										className={`bg-transparent block border-0 transition ease-linear duration-100 font-medium text-base px-4 py-3 rounded-md w-full ${
											errors.email ? 'box-shadow-error' : 'box-shadow-sm'
										}`}
									/>
									{errors.email?.type === 'pattern' && (
										<div className='flex text-[--text-negative] font-normal mt-2 text-sm'>
											<PiWarningCircleBold
												size={21}
												className='flex-shrink-0 mr-1'
											/>
											<span role='alert' className='break-words'>
												Enter a valid email to recover your password
											</span>
										</div>
									)}
									<br />
								</div>
							</div>
							<div className='w-full'>
								<div className='p-0'>
									<label className='font-bold'>Password (any): </label>
								</div>
								<div className='w-full pt-2'>
									<input
										type='password'
										{...register('password', { required: true })}
										aria-invalid={errors.password ? 'true' : 'false'}
										className={`bg-transparent block border-0 transition ease-linear duration-100 font-medium text-base px-4 py-3 rounded-md w-full ${
											errors.password ? 'box-shadow-error' : 'box-shadow-sm'
										}`}
									/>
									{errors.password?.type === 'required' && (
										<div className='flex text-[--text-negative] font-normal mt-2 text-sm'>
											<PiWarningCircleBold
												size={21}
												className='flex-shrink-0 mr-1'
											/>
											<span role='alert' className='break-words'>
												Please enter any password
											</span>
										</div>
									)}
								</div>
							</div>
							<button
								disabled={isLoadingOther}
								className='w-full py-4 mt-5 bg-[--text-bright-accent] text-black font-bold rounded-full hover:brightness-110'
								type={type}
							>
								{isLoadingOther ? <Spinner /> : 'Sign up'}
							</button>
						</div>
					</form>
					<div
						className='mt-10 relative flex justify-center 
          before:absolute before:h-[1px] before:bg-[--text-subdued] before:w-full before:rounded-2xl before:top-1/2 before:left-0 before:right-0 before:content-[""]'
					>
						<span className='relative inline-block text-center'></span>
					</div>
					<p className='p-8 mt-4'>
						<span className='flex flex-col sm:block text-center text-[--text-subdued,#6a6a6a]'>
							Already have an account?&nbsp;
							<Link href={'/login'} className='text-[--text-base] underline'>
								Log in here
							</Link>
						</span>
					</p>
				</div>
			</section>
		</main>
	);
}
