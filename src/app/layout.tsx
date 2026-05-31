// src/app/layout.tsx
import './globals.css';
import { Poppins } from 'next/font/google';
import { NotificationProvider } from '@/context/NotificationContext';
import BackgroundWrapper from './BackgroundWrapper';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '600', '700'], variable: '--font-poppins' });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased m-0 p-0 min-h-screen`}>
        <BackgroundWrapper>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </BackgroundWrapper>
      </body>
    </html>
  );
}