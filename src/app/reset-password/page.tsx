'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, CheckCircle, XCircle } from 'lucide-react';
import { getApiUrl } from '@/utils/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Verify token on mount
 useEffect(() => {
  if (!token) return;  // ← just return, don't setState here

  let cancelled = false;  // prevent setState after unmount

  fetch(getApiUrl(`/api/auth/verify-reset-token?token=${token}`))
    .then((res) => {
      if (!cancelled) setTokenValid(res.ok);
    })
    .catch(() => {
      if (!cancelled) setTokenValid(false);
    });

  return () => {
    cancelled = true;  // cleanup
  };
}, [token]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Reset failed');
      }
      setSuccess(true);
      setTimeout(() => router.push('/'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Invalid / missing token
  if (tokenValid === false) {
    return (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#050A14]">Invalid or expired link</h2>
        <p className="text-gray-600">This password reset link is no longer valid. Please request a new one.</p>
        <Link
          href="/forgot-password"
          className="inline-block mt-4 bg-[#FFD700] text-[#050A14] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  // Success
  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#050A14]">Password reset!</h2>
        <p className="text-gray-600">Your password has been updated. Redirecting you to the home page...</p>
        <Link
          href="/"
          className="inline-block mt-4 bg-[#FFD700] text-[#050A14] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  // Loading token check
  if (tokenValid === null) {
    return (
      <div className="text-center py-8">
        <Loader2 className="animate-spin mx-auto text-blue-600" size={40} />
        <p className="text-gray-500 mt-4">Verifying your link...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Lock size={24} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-[#050A14]">Create new password</h2>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <input
          type="password"
          placeholder="New password (min. 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        disabled={loading}
        className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:outline-none"
      />

      {/* Password strength hint */}
      {password.length > 0 && (
        <ul className="text-xs space-y-1 text-gray-500 pl-1">
          <li className={password.length >= 8 ? 'text-green-600' : 'text-red-400'}>
            {password.length >= 8 ? '✓' : '✗'} At least 8 characters
          </li>
          <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
            {/[A-Z]/.test(password) ? '✓' : '○'} Uppercase letter
          </li>
          <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
            {/[0-9]/.test(password) ? '✓' : '○'} Number
          </li>
        </ul>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#050A14] text-white font-bold text-lg rounded-xl hover:bg-[#1a237e] transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} /> Resetting...
          </span>
        ) : 'Reset Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900">
      <div className="h-28 bg-[#050A14]" aria-hidden="true" />

      <section className="relative -mt-28 pt-36 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#050A14] mb-6">
            Reset <span className="text-[#FFD700]">Password</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Choose a new secure password for your account
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <Suspense fallback={<div className="text-center py-8"><Loader2 className="animate-spin mx-auto" size={40} /></div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </section>

      <footer className="bg-[#050A14] text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl font-bold uppercase italic tracking-wider mb-4">RIRI</div>
          <p className="text-gray-300 text-lg">Rwanda Innovation & Research Institute</p>
          <p className="text-sm text-gray-500 mt-8">© 2025 RIRI • All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}