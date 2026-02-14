'use client';

import Image from 'next/image';

interface AuthHeaderProps {
  title: string;
}

export function AuthHeader({ title }: AuthHeaderProps) {
  return (
    <>
      <div className='flex items-center justify-center gap-2'>
        <Image
          src='/logos/main-logo.svg'
          alt='Sociality'
          width={30}
          height={30}
          className='w-[30px] h-[30px]'
        />
        <span className='text-gray-25 text-xl font-bold leading-7'>
          Sociality
        </span>
      </div>

      <h1 className='text-gray-25 text-xl font-bold leading-7 text-center'>
        {title}
      </h1>
    </>
  );
}
