// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notifyInfo } from '@/context/NotificationContext';

// --- Constants ---
const DUMMY_BOOKS = [
  { title: 'The Runner', author: 'Keza Angelus', supervisor: 'Mugabo Uluje' },
  { title: 'Silent Codes', author: 'Jane Doe', supervisor: 'John Smith' },
  { title: 'Deep Learning', author: 'Alex King', supervisor: 'Maria Bell' },
];

const EVENTS_DATA = [
  { title: 'Book Launch', date: 'Dec 15, 2024', location: 'Kigali Convention Center' },
  { title: 'Authors Meet', date: 'Jan 20, 2025', location: 'University Auditorium' },
  { title: 'Creative Writing Workshop', date: 'Feb 5, 2025', location: 'Innovation Lab' },
];

const SOCIAL_LINKS = ['Facebook', 'WhatsApp', 'Instagram', 'TikTok'];

const SMOKE_WHITE_BG = 'bg-gray-50';
const SKY_BLUE_CARD_BG = 'bg-blue-100';
const SOFT_ACCENT_COLOR_TEXT = 'text-blue-400';
const DARK_ACCENT_HOVER = 'hover:bg-blue-200';
const FEATURED_IMAGE_SRC = '/thesis.jpg';

const SECTION_DESCRIPTION = {
  short: "We believe in the power of every story.",
  medium: "Our curated collection represents the forefront of modern literary and academic thought.",
  long: "From compelling fiction to groundbreaking research, discover a world where creativity and knowledge intersect, driving innovation one page at a time."
};

const IMPACT_METRICS = [
  { label: 'Research uploads', value: '1,500+' },
  { label: 'Active readers', value: '12,000+' },
  { label: 'Partner institutions', value: '40+' },
  { label: 'Community events', value: '120+' },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Upload and publish',
    description: 'Researchers and creators submit quality work to share verified knowledge with a broader audience.',
  },
  {
    step: '2',
    title: 'Discover and learn',
    description: 'Readers explore books, research papers, and innovations using clear categories and searchable content.',
  },
  {
    step: '3',
    title: 'Connect and grow',
    description: 'Communities engage through events, workshops, and partnerships that turn ideas into real impact.',
  },
];

const VALUE_POINTS = [
  'A trusted home for academic and creative excellence',
  'Clear categories for research, innovation, and events',
  'Opportunities for institutions, authors, and readers to collaborate',
];

export default function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
      <header
        className="relative isolate min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.65)), url('/home.jpg')`,
        }}
      >
        <div className="px-4 sm:px-6 max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-10 font-bold text-white">
            Discover a New Era of Books,<br />
            <span className="text-[#FFD700]">Creativity, and Innovation</span>
          </h1>
          <input
            type="text"
            placeholder="Search books, authors, creativity..."
            className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-full bg-white/95 backdrop-blur-md text-black placeholder-gray-600 text-lg shadow-2xl border border-white/20 focus:outline-none focus:shadow-yellow-400/60 transition-all"
          />
        </div>
      </header>

      <main className="text-gray-900 w-full overflow-x-hidden">
        {/* IMPACT SECTION */}
        <section className={`py-12 sm:py-16 px-4 sm:px-6 ${SMOKE_WHITE_BG}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl mb-10 text-center font-extrabold leading-tight">
              Built for <span className={SOFT_ACCENT_COLOR_TEXT}>Real Academic and Creative Impact</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {IMPACT_METRICS.map((metric) => (
                <div key={metric.label} className="bg-white rounded-2xl border border-blue-100 shadow-md p-6 text-center">
                  <p className="text-3xl font-extrabold text-[#050A14]">{metric.value}</p>
                  <p className="text-gray-600 mt-2 font-medium">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PUBLISHED BOOKS SECTION */}
        <section className={`py-12 sm:py-16 px-4 sm:px-6 text-center ${SMOKE_WHITE_BG}`}>
          <h2 className="text-4xl mb-12 font-extrabold leading-tight">
            Explore the <span className={SOFT_ACCENT_COLOR_TEXT}>Latest Published Books</span> and Literary Works
          </h2>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {DUMMY_BOOKS.map((book, i) => (
              <div key={i} className={`w-full ${SKY_BLUE_CARD_BG} rounded-2xl p-4 sm:p-6 md:p-8 text-center hover:-translate-y-4 hover:shadow-xl transition-all duration-500`}>
                <div className="bg-white/90 h-48 sm:h-56 md:h-64 rounded-xl flex items-center justify-center mb-6">
                  <Image 
                    src="/old.jpg" 
                    width={120} 
                    height={120} 
                    alt={book.title} 
                    className="rounded object-cover" 
                    unoptimized 
                  />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Supervisor:</strong> {book.supervisor}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto pt-8 border-t border-gray-300">
            <p className={`text-lg sm:text-xl md:text-2xl font-extrabold mb-4 ${SOFT_ACCENT_COLOR_TEXT}`}>
              {SECTION_DESCRIPTION.short}
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 mb-3">
              {SECTION_DESCRIPTION.medium}
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600">
              {SECTION_DESCRIPTION.long}
            </p>
          </div>
        </section>

        {/* FEATURED MEDIA SECTION */}
        <section className={`py-12 sm:py-16 px-4 sm:px-6 ${SMOKE_WHITE_BG}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl mb-12 text-center font-extrabold leading-tight">
              A Glimpse into Our <span className={SOFT_ACCENT_COLOR_TEXT}>Creative Community</span>
            </h2>
            <div className={`relative aspect-video ${SKY_BLUE_CARD_BG} rounded-2xl overflow-hidden shadow-lg border-4 border-blue-200`}>
              <Image
                src={FEATURED_IMAGE_SRC}
                alt="Featured RIRI Promotional Image"
                fill
                className="object-cover hover:scale-[1.02] transition duration-500"
              />
              <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center pointer-events-none p-4 sm:p-6 md:p-8">
                <p className="text-white text-xl font-bold p-1 text-center">Dive into our latest multimedia features.</p>
                <p className="text-white text-xl font-medium p-1 text-center">Where stories transcend the written word.</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className={`py-12 sm:py-16 px-4 sm:px-6 ${SMOKE_WHITE_BG}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl mb-12 text-center font-extrabold leading-tight">
              How <span className={SOFT_ACCENT_COLOR_TEXT}>RIRI Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="bg-white rounded-2xl border border-blue-100 p-8 shadow-md hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-full bg-[#FFD700] text-[#050A14] font-extrabold flex items-center justify-center mb-5">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TOMORROW'S READING SECTION */}
        <section className={`py-12 sm:py-16 px-4 sm:px-6 text-center ${SMOKE_WHITE_BG}`}>
          <h2 className="text-4xl mb-12 font-extrabold leading-tight">
            What <span className={SOFT_ACCENT_COLOR_TEXT}>Tomorrow Reading</span> Will Bring
          </h2>
          <div className={`max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-blue-200 rounded-2xl p-10 shadow-lg border border-blue-300`}>
            <p className="text-xl leading-relaxed mb-8 text-gray-700">
              The future of literature lies in the intersection of technology and creativity. 
              At RIRI, we are pioneering new ways to experience stories, connect authors with readers, 
              and foster innovation in the literary world.
            </p>
            <p className={`text-lg ${SOFT_ACCENT_COLOR_TEXT}`}>— Dr. Mungwarakarama Irene, Founder</p>
          </div>
        </section>

        {/* WHY RIRI SECTION */}
        <section className={`py-12 sm:py-16 px-4 sm:px-6 ${SMOKE_WHITE_BG}`}>
          <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-blue-100 shadow-lg p-8 sm:p-10">
            <h2 className="text-4xl mb-8 text-center font-extrabold leading-tight">
              Why Choose <span className={SOFT_ACCENT_COLOR_TEXT}>RIRI</span>?
            </h2>
            <div className="space-y-4 mb-8">
              {VALUE_POINTS.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="text-[#FFD700] text-xl font-extrabold">●</span>
                  <p className="text-lg text-gray-700">{point}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/publications" className="inline-flex justify-center px-7 py-3 rounded-full bg-[#050A14] text-white font-bold hover:opacity-90 transition">
                Explore Publications
              </Link>
              <Link href="/innovation" className="inline-flex justify-center px-7 py-3 rounded-full bg-[#FFD700] text-[#050A14] font-bold hover:bg-yellow-400 transition">
                Discover Innovations
              </Link>
            </div>
          </div>
        </section>

        {/* EVENTS SECTION */}
        <section className={`py-12 sm:py-16 px-4 sm:px-6 ${SMOKE_WHITE_BG}`}>
          <h2 className="text-lg sm:text-xl md:text-2xl sm:text-3xl md:text-4xl mb-12 text-center font-extrabold leading-tight">
            Join Our <span className={SOFT_ACCENT_COLOR_TEXT}>Upcoming Events</span> and Workshops
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {EVENTS_DATA.map((event, i) => (
              <div key={i} className={`${SKY_BLUE_CARD_BG} p-4 sm:p-6 md:p-8 rounded-2xl ${DARK_ACCENT_HOVER} hover:scale-105 transition duration-500 shadow-md`}>
                <h3 className={`text-lg sm:text-base sm:text-lg md:text-xl md:text-2xl font-bold mb-3 ${SOFT_ACCENT_COLOR_TEXT}`}>{event.title}</h3>
                <p className="mb-2 text-gray-700"><strong>Date:</strong> {event.date}</p>
                <p className="text-gray-700"><strong>Venue:</strong> {event.location}</p>
                <Link href="/events">
                  <button className="mt-6 w-full sm:w-auto px-5 py-2 bg-[#FFD700] text-black font-bold rounded-full hover:bg-yellow-400 transition shadow-md">
                    Register Now
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={`py-12 px-4 sm:px-6 border-t border-gray-200 text-center bg-gray-900 text-white`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">Contact Us</h3>
            <p className="text-lg text-gray-300">hello@riri.com</p>
            <p className="mt-2 text-gray-500">Kigali, Rwanda</p>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">Follow Us</h3>
            <div className="flex justify-center gap-8 text-lg sm:text-xl md:text-2xl">
              {SOCIAL_LINKS.map((social) => (
                <span
                  key={social}
                  className="cursor-pointer text-[#FFD700] hover:text-yellow-400 transition"
                  onClick={() => notifyInfo(`Redirecting to ${social}`)}
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700">
          <p className="text-gray-400">
            © {new Date().getFullYear()} RIRI. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}