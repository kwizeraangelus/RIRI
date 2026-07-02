// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { notifyInfo } from '@/context/NotificationContext';

const SLIDES = [
  {
    image: '/research.png',
    title: "Welcome to the Future of Knowledge",
    highlight: "Where Research Meets Innovation",
  },
  {
    image: '/home.jpg',
    title: "Discover Groundbreaking Research",
    highlight: "From Rwanda to the World",
  },
  {
    image: '/thesis.jpg',
    title: "Preserving Stories,",
    highlight: "Igniting New Ideas",
  },
  {
    image: '/libr.jpg',
    title: "Transforming Ideas Into Impact",
    highlight: "Creativity • Research • Innovation",
  },
];

const EVENTS_DATA = [
  { title: 'Annual Book & Research Festival', location: 'Kigali Convention Center' },
  { title: 'National Innovation & Creativity Expo', location: 'Innovation City' },
  { title: 'Rwanda Research & Academic Summit', location: 'University of Rwanda' },
];

const SMOKE_WHITE_BG = 'bg-gray-50';
const SKY_BLUE_CARD_BG = 'bg-blue-100';
const SOFT_ACCENT_COLOR_TEXT = 'text-blue-400';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <>
      {/* HERO SLIDER — reduced height so text is always visible */}
      <header className="relative w-full overflow-hidden" style={{ height: '70vh', minHeight: '420px' }}>
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 flex items-center justify-center text-center ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.72)), url('${slide.image}')` }}
          >
            <div className="px-4 sm:px-6 max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-bold text-white mb-4">
                {slide.title}<br />
                <span className="text-[#FFD700]">{slide.highlight}</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Connecting minds, empowering research, and celebrating African innovation.
              </p>
            </div>
          </div>
        ))}

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-[#FFD700] w-10' : 'bg-white/70 hover:bg-white w-3'
              }`}
            />
          ))}
        </div>
      </header>

      {/* HOW RIRI WORKS */}
      <section className={`py-20 px-4 sm:px-6 ${SMOKE_WHITE_BG}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6">
            <span className={SOFT_ACCENT_COLOR_TEXT}>Our Services</span>
          </h2>
          <p className="text-center text-2xl md:text-3xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Simple steps to share knowledge and create impact
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload & Publish', description: 'Researchers, innovators, and creators submit high-quality work for review and publication.' },
              { step: '2', title: 'Discover & Learn', description: 'Readers explore theses, books, articles, and innovations through powerful search and categories.' },
              { step: '3', title: 'Connect & Grow', description: 'Engage with the community through events, collaborations, and networking opportunities.' }
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-3xl p-10 shadow-md hover:bg-blue-50 hover:shadow-xl transition-all duration-300 border border-blue-100 group">
                <div className="w-20 h-20 rounded-2xl bg-[#FFD700] text-black font-bold text-5xl flex items-center justify-center mb-8 group-hover:scale-110 transition">
                  {item.step}
                </div>
                <h3 className="text-4xl font-bold mb-4 text-gray-800">{item.title}</h3>
                <p className="text-black leading-relaxed text-xl">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MEDIA SECTION */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-16">
            <span className={SOFT_ACCENT_COLOR_TEXT}>A Glimpse into Our Creative Community</span>
          </h2>
          <div className="relative aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
            <Image src="/thesis.jpg" alt="Featured Media" fill className="object-cover" sizes="(max-width: 1200px) 100vw, 1200px" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-8">
              <p className="text-white text-4xl md:text-5xl font-bold">Stories that go beyond the page.</p>
              <p className="text-white/90 text-2xl mt-6">Where research, creativity, and innovation come alive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className={`py-20 px-4 sm:px-6 ${SMOKE_WHITE_BG}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-black">Attend Our Events</h2>
          <p className="text-2xl md:text-3xl text-gray-600 mb-16">Join our recurring celebrations of knowledge and innovation</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENTS_DATA.map((event, i) => (
            <div key={i} className={`${SKY_BLUE_CARD_BG} rounded-3xl p-10 hover:scale-105 transition-all shadow-md flex flex-col`}>
              <h3 className="text-3xl font-extrabold text-black mb-4 leading-snug">{event.title}</h3>
              <p className="mb-10 text-gray-700 flex-1 text-xl"><strong>Location:</strong> {event.location}</p>
              <Link href="/events">
                <button className="w-full py-4 bg-[#FFD700] hover:bg-yellow-400 text-black font-bold rounded-full transition text-xl">
                  Learn More &amp; Register
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* OUR PARTNERS */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-black">Our Partners</h2>
          <p className="text-2xl md:text-3xl text-black mb-16">Collaborating with leading institutions and organizations</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-10 shadow-md">
              <h3 className="text-3xl font-bold mb-6 text-[#FFD700]">Academic Institutions</h3>
              <p className="text-black text-xl">Leading universities and research centers across Rwanda and Africa</p>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-md">
              <h3 className="text-3xl font-bold mb-6 text-[#FFD700]">Government &amp; Industry</h3>
              <p className="text-black text-xl">Strategic partnerships with ministries and private sector leaders</p>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-md">
              <h3 className="text-3xl font-bold mb-6 text-[#FFD700]">International Collaborations</h3>
              <p className="text-black text-xl">Global organizations supporting knowledge development</p>
            </div>
          </div>
          <Link href="/about" className="inline-block mt-12">
            <button className="px-12 py-5 bg-[#FFD700] hover:bg-yellow-400 text-black font-bold rounded-full text-2xl transition">
              Learn More About Our Partners
            </button>
          </Link>
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
                  <span>info@riri.gov.rw</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">📍</span>
                  <span>Kigali, Rwanda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">📞</span>
                  <span>+250 000 000 000</span>
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
    </>
  );
}