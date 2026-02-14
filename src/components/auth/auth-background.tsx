'use client';

import Image from 'next/image';

export function AuthBackground() {
  return (
    <div className='absolute inset-0 overflow-hidden'>
      {/* Base static images */}
      <Image
        src='/images/bg-imagemobile.svg'
        alt='Background'
        fill
        className='object-cover md:hidden'
        priority
      />
      <Image
        src='/images/bg-image.svg'
        alt='Background'
        fill
        className='object-cover hidden md:block'
        priority
      />

      {/* Animated subtle overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-300/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[100px] animate-blob [animation-delay:1s]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-primary-200/15 rounded-full blur-[130px] animate-blob [animation-delay:2s]" />
      </div>

      {/* Noise/Texture filter (optional but adds premium feel) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
