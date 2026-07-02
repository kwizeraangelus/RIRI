// src/app/(main)/layout.tsx
'use client';

import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { Menu, X, LogOut, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import AuthModal from '@/components/AuthModal';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '600', '700'], variable: '--font-poppins' });

const navLinks = [
  { name: 'home', href: '/' },
  { name: 'researchers', href: '/researchers' },
  { name: 'theses', href: '/theses' },
  { name: 'publications', href: '/publications' },
  { name: 'experts', href: '/experts' },
  { name: 'innovations', href: '/innovation' },
  { name: 'events', href: '/events' },
  { name: 'about', href: '/about' },
  { name: 'contact', href: '/contact' },
] as const;

interface UserData {
  id: number;
  username: string;
  email: string;
  user_category: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);

  const [authData, setAuthData] = useState<{ user: UserData | null; loading: boolean }>({
    user: null,
    loading: true,
  });

  const initialized = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  const safeParseUser = (str: string | null): UserData | null => {
    if (!str || str === "undefined" || str === "null" || str === "") return null;
    try {
      const parsed = JSON.parse(str);
      if (parsed && typeof parsed === 'object') {
        return {
          id: parsed.id || 0,
          username: parsed.username || '',
          email: parsed.email || '',
          user_category: (parsed.user_category || '').toUpperCase(),
          first_name: parsed.first_name || '',
          last_name: parsed.last_name || '',
          is_staff: parsed.is_staff || false,
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to parse user:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      return null;
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const timer = setTimeout(() => {
      const storedUserStr = localStorage.getItem('user');
      const storedToken = localStorage.getItem('access_token');
      const user = safeParseUser(storedUserStr);
      setAuthData({ user: user && storedToken ? user : null, loading: false });
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleAuthSuccess = useCallback(() => {
    const storedUserStr = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    const user = safeParseUser(storedUserStr);
    if (user && storedToken) {
      setAuthData({ user, loading: false });
      setModalType(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setAuthData({ user: null, loading: false });
    setDropdownOpen(false);
    router.push('/');
  };

  const getDashboardPath = (user: UserData | null): string => {
    if (!user) return '/dashboard';
    if (user.user_category === 'ADMIN' || user.is_staff) return '/admin-dashboard';
    switch (user.user_category?.toUpperCase()) {
      case 'UNIVERSITY': return '/university';
      case 'RESEARCHER': return '/researcher';
      case 'CONF_ORGANIZER': return '/organizer';
      case 'PUBLIC_VISITOR': return '/';
      case 'INNOVATOR': return '/innovator';
      default: return '/dashboard';
    }
  };

  const getUserInitial = (user: UserData | null) => {
    if (!user) return 'U';
    return (user.username?.[0] || user.email?.[0] || 'U').toUpperCase();
  };

  const getInitialColor = (initial: string) => {
    const colors = ['from-blue-400 to-blue-600', 'from-purple-500 to-violet-600', 'from-amber-400 to-orange-600', 'from-emerald-400 to-teal-600', 'from-rose-400 to-pink-600'];
    return `bg-gradient-to-br ${colors[initial.charCodeAt(0) % colors.length]}`;
  };

  const isLoggedIn = !!authData.user;
  const userInitial = getUserInitial(authData.user);

  return (
    <div className={`${poppins.variable} font-sans text-white`}>
      {/* NAV BAR — static, always solid blue */}
      <nav className="w-full z-[9999] flex justify-between items-center px-8 lg:px-[50px] py-6 bg-[#0c1e30] shadow-2xl">
        <Link href="/" className="flex flex-col leading-none group" style={{ width: 'fit-content' }}>
          <span
            className="font-bold uppercase group-hover:text-[#FFD700] transition"
            style={{
              fontFamily: "'Bell MT', 'Palatino Linotype', Georgia, serif",
              fontSize: '68px',
              lineHeight: '1',
              letterSpacing: '6px',
              fontStyle: 'italic',
              textShadow: '2px 2px 0px rgba(255,215,0,0.15)',
            }}
          >
            RIRI
          </span>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: '#FFD700',
              textTransform: 'uppercase',
              fontWeight: 400,
              marginTop: '2px',
              whiteSpace: 'nowrap',
              display: 'block',
              maxWidth: '100%',
            }}
          >
            Discover · Innovate · Inspire
          </span>
        </Link>

        <ul className="hidden lg:flex gap-10 items-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`text-[21px] capitalize transition ${pathname === link.href ? 'text-[#FFD700] font-bold border-b-2 border-[#FFD700]' : 'hover:text-[#FFD700]'}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          {!isLoggedIn ? (
            <div className="hidden md:flex gap-4">
              <button
                onClick={() => setModalType('login')}
                className="px-7 py-2.5 border border-white/30 rounded-full hover:bg-white/10 transition text-[19px] font-medium"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition ${getInitialColor(userInitial)}`}
              >
                <span className="text-white font-bold text-2xl">{userInitial}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-[#0f2238] backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-5 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${getInitialColor(userInitial)}`}>
                        <span className="text-white font-bold text-2xl">{userInitial}</span>
                      </div>
                      <div>
                        <p className="text-base text-gray-400">Signed in as</p>
                        <p className="font-semibold text-[#FFD700] text-lg">{authData.user?.username || authData.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link href={getDashboardPath(authData.user)} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 text-[18px]">
                      <User size={22} /> My Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 text-[18px]">
                      <User size={22} /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-red-500/10 text-[18px]">
                      <LogOut size={20} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative z-[10000]"
          >
            {mobileMenuOpen ? <X size={36} /> : <Menu size={36} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9998] bg-[#0c1e30] pt-24 px-8 space-y-6 lg:hidden overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[26px] capitalize py-2"
            >
              {link.name}
            </Link>
          ))}

          {!isLoggedIn ? (
            <div className="pt-8 border-t border-white/20 space-y-4">
              <button
                onClick={() => { setModalType('login'); setMobileMenuOpen(false); }}
                className="w-full py-4 border border-white/30 rounded-xl text-xl font-medium"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="pt-8 border-t border-white/20 space-y-4">
              <Link href={getDashboardPath(authData.user)} onClick={() => setMobileMenuOpen(false)} className="block py-4 text-2xl">
                My Dashboard
              </Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-4 text-2xl">
                My Profile
              </Link>
              <button onClick={handleLogout} className="w-full text-left py-4 text-2xl text-red-400">
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      <main className="pt-0">{children}</main>

      {modalType && (
        <AuthModal
          type={modalType}
          onClose={(switchTo) => setModalType(switchTo || null)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}