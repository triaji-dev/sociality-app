'use client';

import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PasswordInputProps
  extends Omit<React.ComponentProps<typeof Input>, 'type'> {
  iconSize?: 'sm' | 'md';
  showPassword?: boolean;
  onShowPasswordChange?: (show: boolean) => void;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, iconSize = 'md', showPassword: ControlledShowPassword, onShowPasswordChange, ...props }, ref) => {
    const [internalShowPassword, setInternalShowPassword] = useState(false);
    
    const isControlled = ControlledShowPassword !== undefined;
    const showPassword = isControlled ? ControlledShowPassword : internalShowPassword;
    
    const togglePassword = () => {
      if (onShowPasswordChange) {
        onShowPasswordChange(!showPassword);
      }
      if (!isControlled) {
        setInternalShowPassword(!internalShowPassword);
      }
    };

    const iconClass = iconSize === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

    return (
      <div className='relative w-full'>
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-12', className)}
          {...props}
        />
        <button
          type='button'
          onClick={togglePassword}
          className='cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors'
        >
          {showPassword ? (
            <EyeOff className={iconClass} strokeWidth={1.67} />
          ) : (
            <Eye className={iconClass} strokeWidth={1.67} />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
