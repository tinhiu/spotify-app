'use client';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaSpotify } from 'react-icons/fa';
import { PiWarningCircleBold } from 'react-icons/pi';
import { forgotPassword } from '~/services/user';
import { ButtonType } from '~/types';
type FormData = {
	userIdOrEmail: string;
};

export default function PasswordResetPage() {
	const formRef = useRef(null);
	const [error, setError] = useState('');
	const [type, setType] = useState<ButtonType>('button');
	const { mutate: onForgotPassword, isPending } = useMutation({
		mutationFn: forgotPassword,
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (error) => {
			setError(error.message);
			console.error(error);
		},
	});
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
		setError('');
		onForgotPassword({ userIdOrEmail: data.userIdOrEmail });
	};
	return (
		<main className='w-full h-screen flex flex-col break-words overflow-auto items-center justify-center absolute top-0 left-0 bg-[--background-highlight] text-white'>
			<header className='pt-8 pb-6 w-full min-h-8 overflow-hidden flex justify-center border-b-0'>
				<span className='text-center'>
					<FaSpotify className='' size={50} />
				</span>
			</header>
			<section className='w-full flex justify-center flex-grow pb-0'>
				<div className='px-8 w-full sm:w-96'>
					<h1 className='text-3xl font-bold mb-10 text-center'>
						Reset your password
					</h1>
					{error && (
						<div className='flex w-full my-4 justify-center p-3 bg-[--essential-negative] text-[--essential-base] font-normal mt-2 text-sm box-shadow-error2'>
							<PiWarningCircleBold size={21} className='flex-shrink-0 mr-1' />
							<span role='alert' className='break-words'>
								{error}
							</span>
						</div>
					)}
					<p className='pb-4'>
						Enter your email address or username, and we&apos;ll send you a link
						to get back into your account.
					</p>
					<form onSubmit={handleSubmit(onSubmit)} ref={formRef} method='POST'>
						<div className='w-full block'>
							<div className='w-full'>
								<div className='p-0'>
									<label className='font-bold'>Email address or userId </label>
								</div>
								<div className='w-full pt-2'>
									<input
										{...register('userIdOrEmail', { required: true })}
										aria-invalid={errors.userIdOrEmail ? 'true' : 'false'}
										className={`bg-transparent block border-0 transition ease-linear duration-100 font-medium text-base px-4 py-3 rounded-md w-full ${
											errors.userIdOrEmail
												? 'box-shadow-error'
												: 'box-shadow-sm'
										}`}
									/>
									{errors.userIdOrEmail?.type === 'required' && (
										<div className='flex text-[--text-negative] font-normal mt-2 text-sm'>
											<PiWarningCircleBold
												size={21}
												className='flex-shrink-0 mr-1'
											/>
											<span role='alert' className='break-words'>
												This field is required email or userId
											</span>
										</div>
									)}
									<br />
								</div>
							</div>
							<button
								disabled={isPending}
								className='w-full py-4 mt-5 bg-[--text-bright-accent] text-black font-bold rounded-full hover:bg-[--text-bright-accent/70]'
								type={type}
							>
								Send Link
							</button>
						</div>
					</form>
					<div
						className='mt-10 relative flex justify-center 
          before:absolute before:h-[1px] before:bg-[--text-subdued] before:w-full before:rounded-2xl before:top-1/2 before:left-0 before:right-0 before:content-[""]'
					>
						<span className='relative inline-block text-center'></span>
					</div>
					<p className='py-8'>
						<span className='flex flex-col sm:block text-center text-[--text-subdued,#6a6a6a]'>
							Remember your password?&nbsp;
							<Link
								href={'/login'}
								className='text-[--text-base] underline hover:text-[--text-bright-accent]'
							>
								Login
							</Link>
						</span>
					</p>
				</div>
			</section>
		</main>
	);
}
