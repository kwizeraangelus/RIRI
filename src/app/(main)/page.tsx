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
      {/* HERO SLIDER */}
      <header className="relative isolate min-h-screen w-full overflow-hidden">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 flex items-center justify-center text-center ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url('${slide.image}')` }}
          >
            <div className="px-4 sm:px-6 max-w-5xl mx-auto z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-bold text-white mb-6">
                {slide.title}<br />
                <span className="text-[#FFD700]">{slide.highlight}</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Connecting minds, empowering research, and celebrating African innovation.
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-[#FFD700] w-10' : 'bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </header>

      {/* HOW RIRI WORKS */}
      <section className={`py-16 px-4 sm:px-6 ${SMOKE_WHITE_BG}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            How <span className={SOFT_ACCENT_COLOR_TEXT}>RIRI Works</span>
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Simple steps to share knowledge and create impact
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload & Publish', description: 'Researchers, innovators, and creators submit high-quality work for review and publication.' },
              { step: '2', title: 'Discover & Learn', description: 'Readers explore theses, books, articles, and innovations through powerful search and categories.' },
              { step: '3', title: 'Connect & Grow', description: 'Engage with the community through events, collaborations, and networking opportunities.' }
            ].map((item) => (
              <div 
                key={item.step} 
                className="bg-white rounded-3xl p-8 shadow-md hover:bg-blue-50 hover:shadow-xl transition-all duration-300 border border-blue-100 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FFD700] text-black font-bold text-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MEDIA SECTION */}
      <section className={`py-16 px-4 sm:px-6 bg-white`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
             <span className={SOFT_ACCENT_COLOR_TEXT} >A Glimpse into Our Creative Community</span>
          </h2>
          <div className="relative aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/thesis.jpg"
              alt="Featured Media"
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-8">
              <p className="text-white text-2xl md:text-3xl font-bold">Stories that go beyond the page.</p>
              <p className="text-white/90 text-lg mt-4">Where research, creativity, and innovation come alive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS SECTION - Updated */}
      <section className={`py-16 px-4 sm:px-6 ${SMOKE_WHITE_BG}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Attend Our Events
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join our recurring celebrations of knowledge and innovation
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENTS_DATA.map((event, i) => (
            <div key={i} className={`${SKY_BLUE_CARD_BG} rounded-3xl p-8 hover:scale-105 transition-all shadow-md`}>
              <h3 className="text-2xl font-bold mb-6">{event.title}</h3>
              <p className="mb-8 text-gray-700"><strong>Location:</strong> {event.location}</p>
              <Link href="/events">
                <button className="w-full py-3 bg-[#FFD700] hover:bg-yellow-400 text-black font-bold rounded-full transition">
                  Learn More &amp; Register
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* OUR PARTNERS - Updated Title */}
      <section className={`py-16 px-4 sm:px-6 bg-white`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Our Partners
          </h2>
          <p className="text-xl text-gray-600 mb-12">Collaborating with leading institutions and organizations</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-6 text-[#FFD700]">Academic Institutions</h3>
              <p className="text-gray-600">Leading universities and research centers across Rwanda and Africa</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-6 text-[#FFD700]">Government &amp; Industry</h3>
              <p className="text-gray-600">Strategic partnerships with ministries and private sector leaders</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-6 text-[#FFD700]">International Collaborations</h3>
              <p className="text-gray-600">Global organizations supporting knowledge development</p>
            </div>
          </div>

          <Link href="/about" className="inline-block mt-10">
            <button className="px-10 py-4 bg-[#FFD700] hover:bg-yellow-400 text-black font-bold rounded-full text-lg transition">
              Learn More About Our Partners
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-12 px-4 sm:px-6 border-t border-gray-200 text-center bg-gray-900 text-white`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <p className="text-lg text-gray-300">info@riri.gov.rw</p>
            <p className="text-gray-500">Kigali, Rwanda</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Follow Our Journey</h3>
            <div className="flex justify-center gap-8 text-2xl">
              {['Facebook', 'WhatsApp', 'Instagram', 'TikTok'].map((social) => (
                <span 
                  key={social} 
                  className="cursor-pointer hover:text-[#FFD700] transition" 
                  onClick={() => notifyInfo(social)}
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-10 text-gray-400">© {new Date().getFullYear()} RIRI. All Rights Reserved.</p>
      </footer>
    </>
  );
}