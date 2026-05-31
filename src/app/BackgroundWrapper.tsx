'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export default function BackgroundWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const isMainRoute =
    pathname === '/' ||
    pathname === '/publications' ||
    pathname === '/innovation' ||
    pathname.startsWith('/innovation/') ||
    pathname === '/about' ||
    pathname === '/events' ||
    pathname === '/contact' ||
    pathname === '/researches';
   
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
  };

  return (
    <div className={isHomePage ? 'min-h-screen' : 'bg-[#E0F2FE] min-h-screen'}>
      {!isMainRoute && (
        <button
          type="button"
          onClick={handleBack}
          className="fixed top-4 left-4 z-[70] px-4 py-2 rounded-full bg-[#050A14] text-white font-semibold shadow-lg hover:opacity-90 transition"
        >
          Back
        </button>
      )}
      {children}
    </div>
  );
}

