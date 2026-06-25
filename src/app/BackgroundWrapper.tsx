'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function BackgroundWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  

  return (
    <div className={isHomePage ? 'min-h-screen' : 'bg-[#E0F2FE] min-h-screen'}>
    
      {children}
    </div>
  );
}

