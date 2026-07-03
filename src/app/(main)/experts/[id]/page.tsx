'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/utils/api';
import Image from 'next/image';

interface Expert {
  id: string;
  name: string;
  title: string;
  location: string;
  bio: string;
  profileImage?: string;
  yearOfExperience: number;
  expertise: string[];
  portfolio: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  workExperience: Array<{
    position: string;
    company: string;
    startYear: number;
    endYear?: number;
    description: string;
    technologies: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    startYear: number;
    endYear: number;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    dateObtained: string;
  }>;
  skills: {
    libraries?: string[];
    tools?: string[];
    languages?: string[];
    paradigms?: string[];
    platforms?: string[];
    storage?: string[];
    frameworks?: string[];
    other?: string[];
  };
  preferredEnvironment: string[];
  verified: boolean;
}

export default function ExpertDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchExpert();
  }, [id]);

  const fetchExpert = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`/experts/${id}`));
      if (!response.ok) throw new Error('Expert not found');
      const data = await response.json();
      setExpert(data);
    } catch (err) {
      setError('Failed to fetch expert details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!expert) return <div className="p-8 text-center">Expert not found</div>;

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900">
      {/* DARK NAVY TOP BAND */}
      <div className="h-28 bg-[#050A14]" aria-hidden="true" />

      {/* HERO SECTION */}
      <section className="relative -mt-28 pt-36 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#050A14] mb-6">
            Expert <span className="text-[#FFD700]">Profile</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Detailed credentials, experience, and expertise
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100">
            <div className="flex gap-6 items-start mb-6">
              {expert.profileImage && (
                <div className="relative h-32 w-32 flex-shrink-0">
                  <Image
                    src={expert.profileImage}
                    alt={expert.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-4xl font-bold text-[#050A14]">{expert.name}</h2>
                  {expert.verified && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-2xl text-blue-600 font-semibold mb-1">{expert.title}</p>
                <p className="text-gray-600 text-lg mb-3">{expert.location}</p>
                <p className="text-gray-700 leading-relaxed">{expert.bio}</p>
              </div>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <p className="text-gray-600 text-sm">Years of Experience</p>
              <p className="text-3xl font-bold text-blue-600">{expert.yearOfExperience}</p>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <p className="text-gray-600 text-sm">Areas of Expertise</p>
              <p className="text-3xl font-bold text-blue-600">{expert.expertise.length}</p>
            </div>
          </div>

          {/* Expertise */}
          {expert.expertise.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#050A14] mb-4">Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {expert.expertise.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {expert.portfolio.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#050A14] mb-4">Portfolio</h2>
              <div className="space-y-4">
                {expert.portfolio.map((project, idx) => (
                  <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {expert.workExperience.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#050A14] mb-4">Work Experience</h2>
              <div className="space-y-6">
                {expert.workExperience.map((exp, idx) => (
                  <div key={idx} className="border-l-4 border-green-600 pl-4 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-600">
                        {exp.startYear} - {exp.endYear || 'Present'}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{exp.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exp.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {expert.education.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#050A14] mb-4">Education</h2>
              <div className="space-y-4">
                {expert.education.map((edu, idx) => (
                  <div key={idx} className="border-l-4 border-purple-600 pl-4 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-blue-600 font-medium">{edu.institution}</p>
                    <p className="text-sm text-gray-600">
                      {edu.startYear} - {edu.endYear}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {expert.certifications.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#050A14] mb-4">Certifications</h2>
              <div className="space-y-3">
                {expert.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">{cert.name}</p>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {expert.skills && Object.values(expert.skills).some((arr) => arr?.length) && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#050A14] mb-4">Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {expert.skills.libraries?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Libraries/APIs</h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.skills.libraries.map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {expert.skills.languages?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.skills.languages.map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {expert.skills.tools?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.skills.tools.map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {expert.skills.platforms?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.skills.platforms.map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preferred Environment */}
          {expert.preferredEnvironment.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#050A14] mb-4">Preferred Environment</h2>
              <div className="flex flex-wrap gap-2">
                {expert.preferredEnvironment.map((env, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {env}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mb-10">
            <div className="bg-gradient-to-r from-[#050A14] to-[#1a237e] rounded-3xl p-12">
              <h3 className="text-3xl font-bold text-white mb-6">
                Want to collaborate with this expert?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/experts"
                  className="bg-[#FFD700] text-[#050A14] px-10 py-4 rounded-full text-lg font-bold hover:bg-yellow-500 transition-all hover:scale-105"
                >
                  Browse All Experts
                </Link>
                <Link
                  href="/login"
                  className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all"
                >
                  Join Our Community
                </Link>
              </div>
            </div>
          </div>

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
}