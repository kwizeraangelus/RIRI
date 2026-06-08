'use client';
import React, { useEffect, useState } from 'react';
import { useParams  } from 'next/navigation';
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
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
                <h1 className="text-4xl font-bold text-gray-900">{expert.name}</h1>
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
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm">Years of Experience</p>
            <p className="text-3xl font-bold text-blue-600">{expert.yearOfExperience}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm">Areas of Expertise</p>
            <p className="text-2xl font-bold text-blue-600">{expert.expertise.length}</p>
          </div>
        </div>

        {/* Expertise */}
        {expert.expertise.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Expertise</h2>
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio</h2>
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Work Experience</h2>
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Certifications</h2>
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Preferred Environment</h2>
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
      </div>
    </div>
  );
}