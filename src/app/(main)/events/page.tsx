'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { getApiUrl } from '@/utils/api';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  user_category: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
}

/** Safely parses the stored user JSON from localStorage. */
const safeParseUser = (str: string | null): AuthUser | null => {
  if (!str || str === 'undefined' || str === 'null' || str === '') return null;
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
  } catch {
    return null;
  }
};

/** Resolves where the "Suggest Event" button should send the user. */
const getSuggestEventDestination = (user: AuthUser | null): string => {
  if (user && user.user_category?.toUpperCase() === 'UNIVERSITY') {
    return '/university';
  } else if (user && user.user_category?.toUpperCase() === 'ADMIN') {
    return '/admin-dashboard';
  }  else if (user && user.user_category?.toUpperCase() === 'INNOVATOR') {
    return '/innovator';
  } else if (user && user.user_category?.toUpperCase() === 'RESEARCHER') {
    return '/researcher';
  } else if (user && user.user_category?.toUpperCase() === 'UNIVERSITY') {
    return '/university';
  }
  else if (user) {
    // Any other logged-in user category — send to their general dashboard
    return '/dashboard';
  }
  return '/login';
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // ── Read logged-in user from localStorage on mount ──
  useEffect(() => {
    const storedUserStr = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    const user = safeParseUser(storedUserStr);
    setAuthUser(user && storedToken ? user : null);
  }, []);

  const suggestEventDestination = getSuggestEventDestination(authUser);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(getApiUrl('/api/events/'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const eventList = Array.isArray(data)
          ? data
          : Array.isArray(data.events)
          ? data.events
          : [];

        setEvents(eventList);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900">
      {/* DARK NAVY BAND — same color as before, but no navigation */}
      <div className="h-32 bg-[#0a1f3d]" aria-hidden="true" />

      {/* HERO — overlaps the dark band beautifully */}
      <section className="relative -mt-32 pt-40 pb-24 bg-gradient-to-b from-[#466ab0] via-blue-950 to-[#0c1e30ee] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Upcoming <span className="text-[#FFD700]">Events</span>
          </h1>
          <p className="text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
            Join researchers, innovators, and academic leaders at Rwanda premier research and innovation events.
          </p>
        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="py-16 px-6 -mt-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-[#FFD700] border-t-transparent mx-auto" />
              <p className="mt-6 text-2xl text-[#050A14] font-medium">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-32 bg-white/95 rounded-3xl shadow-2xl">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-3xl font-bold text-gray-700">No upcoming events</p>
              <p className="text-gray-500 mt-4 text-xl">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100"
                  onClick={() => event.link && window.open(event.link, '_blank')}
                >
                  {/* EVENT IMAGE */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {event.photo_url? (
                      <img
                        src={event.photo_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/800x600/050A14/FFD700?text=EVENT';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#050A14] to-blue-900 flex items-center justify-center">
                        <svg className="w-20 h-20 text-[#FFD700] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-8">
                    <h3 className="text-3xl font-bold text-[#050A14] mb-4 line-clamp-2 group-hover:text-blue-700 transition">
                      {event.title}
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-600">
                        <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold text-[#050A14] text-lg">{format(new Date(event.date), 'PPP p')}</span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-600">
                        <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-lg">{event.location}</span>
                      </div>
                    </div>

                    <p className="mt-6 text-gray-600 line-clamp-3 leading-relaxed text-lg">{event.description}</p>

                    {event.link && (
                      <div className="mt-6 flex items-center text-[#FFD700] font-bold hover:text-yellow-400 transition text-lg">
                        Register Now
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Suggest Event Button — sends logged-in users to their dashboard, others to login */}
      <Link
        href={suggestEventDestination}
        className="fixed right-8 bottom-8 z-50 flex items-center gap-3 bg-[#FFD700] text-[#050A14] px-8 py-5 rounded-full shadow-2xl hover:scale-110 transition-all font-bold uppercase text-base tracking-wider"
      >
        Suggest Event
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>

      {/* FOOTER */}
     <footer className="bg-[#0c1e30] text-white pt-14 pb-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Top grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">

            {/* Brand col */}
            <div className="lg:col-span-1">
              <p
                className="font-bold uppercase text-white mb-1"
                style={{ fontFamily: "'Bell MT', 'Palatino Linotype', Georgia, serif", fontSize: '38px', letterSpacing: '4px', fontStyle: 'italic', lineHeight: 1 }}
              >
                RIRI
              </p>
              <p className="text-[#FFD700] text-[9px] uppercase tracking-widest mb-4"></p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Rwanda's premier platform connecting researchers, innovators, and knowledge seekers.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-[#FFD700] font-bold uppercase tracking-widest text-xs mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {['Researchers', 'Theses', 'Publications', 'Innovations', 'Events'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-gray-300 hover:text-[#FFD700] transition text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[#FFD700] font-bold uppercase tracking-widest text-xs mb-5">Contact Us</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">✉</span>
                  <span>info@riri.rw</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">📍</span>
                  <span>Kigali, Rwanda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">📞</span>
                  <span>+250 793211640</span>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[#FFD700] font-bold uppercase tracking-widest text-xs mb-5">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Facebook', icon: 'f' },
                  { name: 'WhatsApp', icon: 'w' },
                  { name: 'Instagram', icon: 'ig' },
                  { name: 'TikTok', icon: 'tt' },
                ].map((social) => (
                  <button
                    key={social.name}
                    onClick={() => notifyInfo(social.name)}
                    className="px-4 py-2 rounded-full border border-white/20 text-sm text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] transition"
                  >
                    {social.name}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-6 leading-relaxed">
                Stay updated with the latest research events and innovations from Rwanda.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} RIRI. All Rights Reserved.</p>
            <div className="flex gap-5">
              <Link href="/about" className="hover:text-[#FFD700] transition">About</Link>
              <Link href="/contact" className="hover:text-[#FFD700] transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}