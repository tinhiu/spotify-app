'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaSpotify } from 'react-icons/fa';
import { PiWarningCircleBold } from 'react-icons/pi';
import { ButtonType, FormData } from '~/types';
import Spinner from '~/components/Spinner';
import { useAppDispatch, useAppSelector } from '~/lib/hooks';
import { login } from '~/redux/slices/user';

export default function LoginPage() {
	const router = useRouter();
	const formRef = useRef(null);
	const [type, setType] = useState<ButtonType>('button');
	const [error, setError] = useState('');
	const { isLoadingOther } = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();

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
		if (isLoadingOther) return null;
		setError('');
		dispatch(login({ userId: data.userId, password: data.password })).then(
			(action) => {
				if (action.payload.status > 200) {
					setError(action.payload.data.message);
					return;
				}
				router.push('/');
			}
		);
	};

	return (
		<div className='flex h-screen flex-col items-center overflow-x-hidden justify-center min-h-screen bg-gray-100 text-gray-900'>
			<div className='flex w-full overflow-auto sm:p-8 justify-center bg-gradient-to-b from-gray-800 to-black/90'>
				<div className='w-full max-w-xl '>
					<div className='w-full bg-[var(--background-elevated-base,#ffffff)] flex flex-col items-center text-white gap-4 rounded-lg'>
						<div className='pt-8 pb-6 w-full flex justify-center border-b-0'>
							<Link href={'/'}>
								<span className='text-center'>
									<FaSpotify className='' size={50} />
								</span>
							</Link>
						</div>
						<h1 className='sm:text-3xl text-2xl font-bold mb-10 text-center break-words'>
							Log in with Spotify User ID
						</h1>
						{error && (
							<div className='flex w-1/2 justify-center p-3 bg-[--essential-negative] text-[--essential-base] font-normal mt-2 text-sm'>
								<PiWarningCircleBold size={21} className='flex-shrink-0 mr-1' />
								<span role='alert' className='break-words'>
									{error}
								</span>
							</div>
						)}
						<div
							className='mb-10 relative flex justify-center w-3/4 
          before:absolute before:h-[1px] before:bg-[--text-subdued] before:w-full before:rounded-2xl before:top-1/2 before:left-0 before:right-0 before:content-[""]'
						>
							<span className='relative inline-block text-center'></span>
						</div>
						<div className='px-8 w-full sm:w-96'>
							<form
								ref={formRef}
								onSubmit={handleSubmit(onSubmit)}
								method='POST'
							>
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
											<label className='font-bold'>Password: </label>
										</div>
										<div className='w-full pt-2'>
											<input
												type='password'
												{...register('password', { required: true })}
												autoComplete='on'
												aria-invalid={errors.password ? 'true' : 'false'}
												className={`bg-transparent block border-0 font-medium transition ease-linear duration-100 text-base px-4 py-3 rounded-md w-full ${
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
														Please enter password
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
										{isLoadingOther ? <Spinner /> : 'Log in'}
									</button>
								</div>
							</form>
							<p className='py-8'>
								<span className='flex flex-col sm:block text-center text-[--text-subdued,#6a6a6a]'>
									<Link
										href={'/password-reset'}
										className='text-[--text-base] underline hover:text-[--text-bright-accent]'
									>
										Forgot your password?
									</Link>
								</span>
							</p>
							<div
								className='mt-10 relative flex justify-center 
          before:absolute before:h-[1px] before:bg-[--text-subdued] before:w-full before:rounded-2xl before:top-1/2 before:left-0 before:right-0 before:content-[""]'
							>
								<span className='relative inline-block text-center'></span>
							</div>
							<p className='py-8'>
								<span className='flex flex-col sm:block text-center text-[--text-subdued,#6a6a6a]'>
									Don&apos;t have an account?&nbsp;
									<Link
										href={'/signup'}
										className='text-[--text-base] underline hover:text-[--text-bright-accent]'
									>
										Sign up here
									</Link>
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
