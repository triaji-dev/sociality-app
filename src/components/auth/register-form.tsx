'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from "sonner";
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
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData, {
      onError: (error: any) => {
        // Assuming error structure from backend
        // If Axios error, standard is error.response.data
        const responseData = error?.response?.data;
        
        if (responseData) {
             // Case 1: "message" field contains specific text we can parse OR "errors" object exists
             // Example check based on typical patterns:
             const message = responseData.message || "";
             const errors = responseData.errors; // Some APIs return { errors: { email: "..." } }

             if (errors) {
                // Map object errors
                if (errors.email) {
                    setError("email", { type: "server", message: Array.isArray(errors.email) ? errors.email[0] : errors.email });
                }
                if (errors.username) {
                     setError("username", { type: "server", message: Array.isArray(errors.username) ? errors.username[0] : errors.username });
                }
                if (errors.phone) {
                     setError("phone", { type: "server", message: Array.isArray(errors.phone) ? errors.phone[0] : errors.phone });
                }
                 if (errors.password) {
                     setError("password", { type: "server", message: Array.isArray(errors.password) ? errors.password[0] : errors.password });
                }
                if (errors.name) {
                     setError("name", { type: "server", message: Array.isArray(errors.name) ? errors.name[0] : errors.name });
                }
             } else if (message) {
                 // Fallback: Parsing the message string if standardized "errors" object is missing
                 // This relies on the backend returning clear strings like "Email is already taken"
                 const msgLower = message.toLowerCase();
                 if (msgLower.includes("email")) {
                     setError("email", { type: "server", message: message });
                 } else if (msgLower.includes("username")) {
                     setError("username", { type: "server", message: message });
                 } else if (msgLower.includes("phone")) {
                     setError("phone", { type: "server", message: message });
                 } else {
                     // If we can't map it, show a generic error on the root or a toast
                      toast.error(message);
                 }
             } else {
                 toast.error("Registration failed. Please try again.");
             }
        } else {
            toast.error("An unexpected error occurred. Please try again.");
        }
      }
    });
  };

  return (
    <div className='fixed inset-0 bg-black overflow-hidden'>
      <AuthBackground />

      <div className='relative z-10 flex items-center justify-center h-full px-6 py-4'>
        <div
          className='w-full max-w-[460px] bg-black/20 border border-gray-900 rounded-2xl flex flex-col items-center py-6 px-6 gap-4'
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
                className='w-full h-12 bg-primary-300 text-gray-25 text-base font-bold leading-[30px] tracking-[-0.02em] rounded-full hover:opacity-90 transition-opacity btn-shine'
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
