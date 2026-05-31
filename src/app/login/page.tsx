'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // The handleSubmit logic remains the same
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/nova/login'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Full Data from Backend:", data); 
        // REDIRECT BASED ON USER TYPE
         // 1. SAVE THE TOKEN
      localStorage.setItem('token', data.access_token); 


       setTimeout(() => {
    router.push(data.redirect);
  }, 100);
        router.push(data.redirect);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // --- Styling Constants (for register link and input focus) ---
  const SOFT_SKY_BLUE: string = '#e0f7fa'; 
  const STRONG_YELLOW: string = '#FFD700'; 
  // STRONG_YELLOW_HOVER = '#FBC02D'; 

  return (
    // Background color: soft sky blue
    <div className={`min-h-screen flex items-center justify-center bg-[#E0F2FE] p-4`}>
      {/* Card background: white */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Heading color: black */}
        <h2 className="text-2xl font-bold text-center text-black mb-6">Log In</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            {/* Label is bolded */}
            <label className="block text-sm font-bold text-black-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              // Input text is bold
              className={`w-full px-3 py-2 border rounded-md font-bold focus:ring-2 focus:ring-[${STRONG_YELLOW}]`}
            />
          </div>

          <div>
            {/* Label is bolded */}
            <label className="block text-sm font-bold text-black-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              // Input text is bold
              className={`w-full px-3 py-2 border rounded-md font-bold focus:ring-2 focus:ring-[${STRONG_YELLOW}]`}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

         <button
  type="submit"
  disabled={loading}
  className={`w-24 h-16 mx-auto block bg-[#FFD700] text-black text-lg font-bold rounded-md hover:bg-[#FBC02D] disabled:opacity-50 transition-colors duration-150 flex items-center justify-center`}
>
  {loading ? '...' : 'Log In'}
</button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          No account? <Link 
          href="/register"
          // Register link color: strong yellow and bold
          className={`text-[${STRONG_YELLOW}] font-bold hover:underline`}
          >
          Register
          </Link>
        </p>
      </div>
    </div>
  );
}