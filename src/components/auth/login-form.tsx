'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks';
import { AuthBackground } from './auth-background';
import { AuthHeader } from './auth-header';
import { PasswordInput } from './password-input';
import { cn } from '@/lib/utils';
import type { LoginRequest } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function LoginForm() {
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return (
    <div className='fixed inset-0 bg-black overflow-hidden'>
      <AuthBackground />

      <div className='relative z-10 flex items-center justify-center h-full px-6'>
        <div className='w-[446px] bg-black/20 border border-gray-900 backdrop-blur-[20px] rounded-2xl p-6 space-y-6'>
          <AuthHeader title='Welcome Back!' />

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div className='space-y-1'>
              <Label
                htmlFor='email'
                className='text-white text-sm font-bold leading-7 tracking-[-0.02em]'
              >
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                className={cn(
                  'w-full h-12 px-4 bg-gray-950 border-gray-900 text-white placeholder-gray-600 text-base leading-[30px] tracking-[-0.02em] rounded-xl focus:border-purple-500 focus:ring-purple-500',
                  errors.email && 'border-red ring-red ring-1'
                )}
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red text-xs mt-1 font-medium'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-1'>
              <Label
                htmlFor='password'
                className='text-white text-sm font-bold leading-7 tracking-[-0.02em]'
              >
                Password
              </Label>
              <PasswordInput
                id='password'
                placeholder='Enter your password'
                className={cn(
                  'w-full h-12 px-4 bg-gray-950 border-gray-900 text-white placeholder-gray-600 text-base leading-[30px] tracking-[-0.02em] rounded-xl focus:border-purple-500 focus:ring-purple-500',
                  errors.password && 'border-red ring-red ring-1'
                )}
                {...register('password')}
              />
              {errors.password && (
                <p className='text-red text-xs mt-1 font-medium'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full h-12 bg-primary-300 text-white text-base font-bold leading-[30px] tracking-[-0.02em] rounded-full hover:opacity-90 transition-opacity'
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className='flex justify-center items-center gap-1'>
            <span className='text-white text-base leading-[30px] tracking-[-0.02em]'>
              Don&apos;t have an account?
            </span>
            <Link
              href='/register'
              className='text-primary-200 text-base font-bold leading-[30px] tracking-[-0.02em] hover:opacity-80 transition-opacity'
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
