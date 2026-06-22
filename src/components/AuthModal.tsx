// components/AuthModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { notifySuccess } from '@/context/NotificationContext';
import { getApiUrl } from '@/utils/api';

interface UserData {
  id: string;
  username: string;
  email: string;
  user_category: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
}

type ModalType = 'login' | 'signup';

interface AuthModalProps {
  type: ModalType;
  onClose: (switchTo?: ModalType) => void;
  onAuthSuccess: () => void;
}

export default function AuthModal({ type, onClose, onAuthSuccess }: AuthModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    username: '',
    email: '',
    password: '',
    phone_number: '',
    confirmPassword: '',
    user_category: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const isLogin = type === 'login';

  const loginUser = async (data: { username: string; password: string }) => {
    const isEmail = data.username.includes('@');
    const res = await fetch(getApiUrl('/api/nova/login'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: isEmail ? data.username : undefined,
        username: !isEmail ? data.username : undefined,
        password: data.password,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.detail || 'Login failed');
    }
    return res.json();
  };

  const registerUser = async () => {
    const res = await fetch(getApiUrl('/api/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone_number: formData.phone_number,
        user_category: formData.user_category.toLowerCase(),
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.detail || 'Registration failed');
    }
    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const loginResponse = await loginUser({
          username: formData.username,
          password: formData.password,
        });

        const token = loginResponse.access_token || loginResponse.access;
        if (!token) throw new Error('No token received from server');

        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64)) as {
          sub: string;
          email: string;
          category: string;
          is_staff: boolean;
        };

        localStorage.setItem('token', token);
        localStorage.setItem('access_token', token);

        let user: UserData;
        try {
          const profileRes = await fetch(`${API}/profile/${decoded.sub}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!profileRes.ok) throw new Error('profile fetch failed');
          const profileData = await profileRes.json();
          user = {
            id: profileData.id,
            username: profileData.username,
            email: profileData.email,
            user_category: profileData.user_category,
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            is_staff: profileData.is_staff || false,
          };
        } catch {
          user = {
            id: decoded.sub,
            username: formData.username,
            email: decoded.email || '',
            user_category: decoded.category || 'PUBLIC_VISITOR',
            first_name: '',
            last_name: '',
            is_staff: decoded.is_staff || false,
          };
        }

        localStorage.setItem('user', JSON.stringify(user));
        
        onAuthSuccess();
        notifySuccess(`Welcome back, ${user.username || user.email}!`);
        onClose();
      } else {
        await registerUser();
        notifySuccess('Account created successfully!');
        onClose('login');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      console.error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center pt-20 overflow-y-auto"
      onClick={() => onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white text-black rounded-2xl shadow-2xl m-6 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            {isLogin ? (
              <>
                <LogIn className="text-blue-600" size={32} />
                Log In
              </>
            ) : (
              <>
                <UserPlus className="text-green-600" size={32} />
                Create Account
              </>
            )}
          </h2>
          <button type="button" onClick={() => onClose()} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={28} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* All form fields now have larger font size */}
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-green-500 text-lg"
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-green-500 text-lg"
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-green-500 text-lg"
                disabled={loading}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-green-500 text-lg"
                disabled={loading}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-green-500 text-lg"
                disabled={loading}
              />
              <select
                value={formData.user_category}
                onChange={(e) => setFormData({ ...formData, user_category: e.target.value })}
                required
                className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-green-500 bg-white text-lg"
                disabled={loading}
              >
                <option value="" disabled>Select Account Type</option>
                <option value="innovator">Innovator</option>
                <option value="researcher">Researcher</option>
                <option value="university">University</option>
                <option value="conf_organizer">Conference Organizer</option>
                <option value="public_visitor">Public Visitor</option>
              </select>
            </>
          )}

          {isLogin && (
            <input
              type="text"
              placeholder="Username or Email"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
              disabled={loading}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
            disabled={loading}
          />

          {isLogin && (
            <div className="text-right -mt-2">
              <button
                type="button"
                onClick={() => { onClose(); router.push('/forgot-password'); }}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-green-500 text-lg"
              disabled={loading}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 font-bold text-lg rounded-xl transition-all ${
              isLogin
                ? 'bg-[#FFD700] hover:bg-yellow-400 text-black'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> Processing...
              </span>
            ) : isLogin ? 'Log In' : 'Create Account'}
          </button>

          {isLogin && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onClose('signup')}
                className="text-[#FFD700] font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}