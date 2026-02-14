'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks';
import { AuthBackground } from './auth-background';
import { AuthHeader } from './auth-header';
import { PasswordInput } from './password-input';
import { cn } from '@/lib/utils';
import type { RegisterRequest } from '@/types';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = RegisterRequest & {
  confirmPassword: string;
};

const inputClassName =
  'w-full h-12 px-3 bg-gray-950 border border-gray-900 text-white placeholder-gray-600 text-sm leading-5 tracking-[-0.02em] rounded-lg focus:border-purple-500 focus:ring-purple-500';

const labelClassName =
  'w-full text-white text-xs font-bold leading-4 tracking-[-0.02em]';

export function RegisterForm() {
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className='fixed inset-0 bg-black overflow-hidden'>
      <AuthBackground />

      <div className='relative z-10 flex items-center justify-center h-full px-6 py-4'>
        <div
          className='w-full max-w-[460px] bg-black/20 border border-gray-900 rounded-2xl flex flex-col items-center py-6 px-8 gap-4'
          style={{ backdropFilter: 'blur(50px)' }}
        >
          <AuthHeader title='Register' />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full flex flex-col items-start gap-5'
          >
            <div className='w-full flex flex-col items-start gap-1'>
              <Label htmlFor='name' className={labelClassName}>
                Name
              </Label>
              <Input
                id='name'
                placeholder='Enter your name'
                className={cn(inputClassName, errors.name && 'border-red ring-red ring-1')}
                {...register('name')}
              />
              {errors.name && (
                <p className='text-red text-xs mt-1 font-medium'>{errors.name.message}</p>
              )}
            </div>

            <div className='w-full flex flex-col items-start gap-1'>
              <Label htmlFor='username' className={labelClassName}>
                Username
              </Label>
              <Input
                id='username'
                placeholder='Enter your username'
                className={cn(inputClassName, errors.username && 'border-red ring-red ring-1')}
                {...register('username')}
              />
              {errors.username && (
                <p className='text-red text-xs mt-1 font-medium'>
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className='w-full flex flex-col items-start gap-1'>
              <Label htmlFor='email' className={labelClassName}>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                className={cn(inputClassName, errors.email && 'border-red ring-red ring-1')}
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red text-xs mt-1 font-medium'>{errors.email.message}</p>
              )}
            </div>

            <div className='w-full flex flex-col items-start gap-1'>
              <Label htmlFor='phone' className={labelClassName}>
                Phone Number
              </Label>
              <Input
                id='phone'
                type='tel'
                placeholder='Enter your phone number'
                className={cn(inputClassName, errors.phone && 'border-red ring-red ring-1')}
                {...register('phone')}
              />
              {errors.phone && (
                <p className='text-red text-xs mt-1 font-medium'>{errors.phone.message}</p>
              )}
            </div>

            <div className='w-full flex flex-col items-start gap-1'>
              <Label htmlFor='password' className={labelClassName}>
                Password
              </Label>
              <PasswordInput
                id='password'
                placeholder='Enter your password'
                iconSize='sm'
                showPassword={showPassword}
                onShowPasswordChange={setShowPassword}
                className={cn(inputClassName, errors.password && 'border-red ring-red ring-1')}
                {...register('password')}
              />
              {errors.password && (
                <p className='text-red text-xs mt-1 font-medium'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='w-full flex flex-col items-start gap-1'>
              <Label htmlFor='confirmPassword' className={labelClassName}>
                Confirm Password
              </Label>
              <PasswordInput
                id='confirmPassword'
                placeholder='Confirm your password'
                iconSize='sm'
                showPassword={showPassword}
                onShowPasswordChange={setShowPassword}
                className={cn(inputClassName, errors.confirmPassword && 'border-red ring-red ring-1')}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className='text-red text-xs mt-1 font-medium'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className='w-full flex flex-col items-center gap-2'>
              <Button
                type='submit'
                className='w-full h-9 bg-primary-300 text-gray-25 text-sm font-bold leading-5 tracking-[-0.02em] rounded-full hover:opacity-90 transition-opacity'
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Creating account...' : 'Register'}
              </Button>

              <div className='flex flex-row justify-center items-center gap-1'>
                <span className='text-gray-25 text-sm font-semibold leading-6 tracking-[-0.02em]'>
                  Already have an account?
                </span>
                <Link
                  href='/login'
                  className='text-primary-200 text-sm font-bold leading-6 tracking-[-0.02em] hover:opacity-80 transition-opacity'
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
