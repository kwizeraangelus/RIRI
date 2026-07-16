'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { getApiUrl } from '@/utils/api';

type Status = 'verifying' | 'success' | 'error';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900">
      <div className="h-28 bg-[#050A14]" aria-hidden="true" />
      <section className="relative -mt-28 pt-36 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#050A14] mb-6">
            Verify <span className="text-[#FFD700]">Email</span>
          </h1>
        </div>
      </section>
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center space-y-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 size={40} className="text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-[#050A14]">Loading...</h2>
          </div>
        </div>
      </section>
    </div>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('');

  // Resend flow (shown when verification fails)
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token was provided. Please use the link from your email.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          getApiUrl(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Invalid or expired verification link');
        }
        setStatus('success');
      } catch (err: unknown) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Something went wrong');
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);
    try {
      await fetch(getApiUrl('/api/auth/resend-verification'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setResendSent(true);
    } catch {
      // Stay silent on failure too — mirrors backend's non-enumerating behavior
      setResendSent(true);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900">
      <div className="h-28 bg-[#050A14]" aria-hidden="true" />

      <section className="relative -mt-28 pt-36 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#050A14] mb-6">
            Verify <span className="text-[#FFD700]">Email</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Confirming your account
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

            {status === 'verifying' && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 size={40} className="text-blue-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-[#050A14]">Verifying your email...</h2>
                <p className="text-gray-600">This will just take a moment.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#050A14]">Email verified</h2>
                <p className="text-gray-600">
                  Your account is now active. You can log in whenever you're ready.
                </p>
                
              </div>
            )}

            {status === 'error' && !resendSent && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle size={40} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#050A14]">Verification failed</h2>
                <p className="text-gray-600">{message}</p>

                <form onSubmit={handleResend} className="space-y-4 pt-4 border-t border-gray-100 mt-6 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Enter your email to get a new verification link.
                    </p>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={resendLoading}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="w-full py-4 bg-[#050A14] text-white font-bold text-lg rounded-xl hover:bg-[#1a237e] transition-all"
                  >
                    {resendLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={20} /> Sending...
                      </span>
                    ) : 'Resend Verification Link'}
                  </button>
                </form>

                <Link
                  href="/"
                  className="inline-block mt-2 text-sm text-gray-500 hover:text-[#050A14] transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            )}

            {status === 'error' && resendSent && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#050A14]">Check your inbox</h2>
                <p className="text-gray-600">
                  If that account exists and isn't verified yet, a new confirmation link is on its way.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-4 bg-[#FFD700] text-[#050A14] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all"
                >
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#050A14] text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl font-bold uppercase italic tracking-wider mb-4">RIRI</div>
          <p className="text-gray-300 text-lg">Rwanda and Innovation for Inspire</p>
          <p className="text-sm text-gray-500 mt-8">© 2026 RIRI • All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}