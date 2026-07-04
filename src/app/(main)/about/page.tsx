// app/about/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';

const AboutPage = () => {
  const teamMembers = [
    { name: 'Dr. Mungwarakarama Irene', role: 'Executive Director', email: 'Mungwarakaramairene@gmail.com' },
    { name: 'Dr. Lindagato Philemon', role: 'Director', email: 'mclaire@riri.rw' },

  ];

  const academicPartners = [
   
  ];

  const governmentPartners = [
   
  ];

  const internationalPartners = [
    
  ];

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900">
      {/* DARK NAVY TOP BAND */}
      <div className="h-28 bg-[#050A14]" aria-hidden="true" />

      {/* HERO SECTION */}
      <section className="relative -mt-28 pt-36 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-2xl sm:text-3xl md:text-4xl md:text-6xl font-bold text-[#050A14] mb-6">
            About <span className="text-[#FFD700]">RIRI</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Research and Innovation for Rwanda Impact - Connecting research to Rwanda development
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* COMBINED MISSION & VISION SECTION */}
          <div className="mb-20">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-[#050A14] to-[#1a237e] p-8 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Our Purpose & Vision</h2>
                <p className="text-gray-300 text-lg">Driving Rwanda research ecosystem forward</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Mission Side */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#050A14]">Mission</h3>
                      <p className="text-gray-600">Our core purpose</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      To democratize access to academic research in Rwanda by providing a centralized platform 
                      where researchers, students, and academics can share, discover, and collaborate on 
                      groundbreaking research that addresses national development challenges and contributes 
                      to global knowledge advancement.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-[#050A14] text-lg">What We Do:</h4>
                    <ul className="space-y-2">
                      {[
                        'Provide digital repository for research publications',
                        'Facilitate academic collaboration',
                        'Promote research commercialization',
                        'Support early-career researchers',
                        'Bridge academia-industry gap'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <span className="text-[#FFD700]">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Vision Side */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center">
                      <span className="text-3xl">🌟</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#050A14]">Vision</h3>
                      <p className="text-gray-600">Our future aspiration</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      To establish Rwanda as a continental leader in research and innovation, creating an 
                      ecosystem where academic knowledge directly translates into sustainable development, 
                      economic growth, and improved quality of life for all Rwandans by 2030.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-[#050A14] text-lg">Our Goals:</h4>
                    <ul className="space-y-2">
                      {[
                        'Connect all Rwandan academic institutions',
                        'Increase research visibility',
                        'Commercialize research projects',
                        'Establish Rwanda as East Africa research hub'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <span className="text-[#FFD700]">→</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PARTNERSHIPS SECTION */}
          <div className="mb-20">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#050A14] to-[#1a237e] p-8 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Our Partnerships</h2>
                <p className="text-gray-300 text-lg">Collaborating for greater impact</p>
              </div>

              <div className="p-8 space-y-12">
                {/* Academic Partners */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#050A14]">Academic Institutions</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {academicPartners.map((partner, index) => (
                      <span key={index} className="bg-blue-50 text-[#050A14] px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Government & Industry */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏛️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#050A14]">Government & Industry</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {governmentPartners.map((partner, index) => (
                      <span key={index} className="bg-blue-50 text-[#050A14] px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>

                {/* International Partners */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#050A14]">International Collaborations</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {internationalPartners.map((partner, index) => (
                      <span key={index} className="bg-gradient-to-r from-[#050A14] to-[#1a237e] text-white px-4 py-2 rounded-full text-sm font-medium">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TEAM SECTION */}
          
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
    </div>
  );
};

export default AboutPage;