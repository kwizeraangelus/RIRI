'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { getApiUrl } from '@/utils/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Something went wrong');
      }
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900">
      <div className="h-28 bg-[#050A14]" aria-hidden="true" />

      <section className="relative -mt-28 pt-36 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#050A14] mb-6">
            Forgot <span className="text-[#FFD700]">Password</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Enter your email and we'll send you a reset link
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#050A14]">Check your inbox</h2>
                <p className="text-gray-600">
                  We sent a password reset link to <strong>{email}</strong>.
                  Check your spam folder if you don't see it.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-4 bg-[#FFD700] text-[#050A14] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail size={24} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-[#050A14]">Reset your password</h2>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#050A14] text-white font-bold text-lg rounded-xl hover:bg-[#1a237e] transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} /> Sending...
                    </span>
                  ) : 'Send Reset Link'}
                </button>

                <div className="text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#050A14] transition-colors"
                  >
                    <ArrowLeft size={16} /> Back to Home
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#050A14] text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl font-bold uppercase italic tracking-wider mb-4">RIRI</div>
          <p className="text-gray-300 text-lg">Rwanda Innovation & Research Institute</p>
          <p className="text-sm text-gray-500 mt-8">© 2026 RIRI • All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}