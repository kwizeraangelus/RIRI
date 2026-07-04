'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getApiUrl } from '@/utils/api';

interface Expert {
  id: string;
  name: string;
  title: string;
  location: string;
  bio: string;
  profileImage?: string;
  yearOfExperience: number;
  expertise: string[];
  verified: boolean;
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/experts'));
      const data = await response.json();
      setExperts(data);
    } catch (err) {
      setError('Failed to fetch experts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading experts...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900">
      {/* DARK NAVY TOP BAND */}
      <div className="h-28 bg-[#050A14]" aria-hidden="true" />

      {/* HERO SECTION */}
      <section className="relative -mt-28 pt-36 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#050A14] mb-6">
            Expert <span className="text-[#FFD700]">Directory</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Connect with verified Rwandan experts across industries and disciplines
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {experts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No experts found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert) => (
                <Link key={expert.id} href={`/experts/${expert.id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    {expert.profileImage && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={expert.profileImage}
                          alt={expert.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">{expert.name}</h2>
                        {expert.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-blue-600 font-medium mb-1">{expert.title}</p>
                      <p className="text-gray-600 text-sm mb-2">{expert.location}</p>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{expert.bio}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {expert.yearOfExperience} years exp.
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1">
                        {expert.expertise.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {expert.expertise.length > 3 && (
                          <span className="text-gray-500 text-xs px-2 py-1">
                            +{expert.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
              <p className="text-[#FFD700] text-[9px] uppercase tracking-widest mb-4">Discover · Innovate · Inspire</p>
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