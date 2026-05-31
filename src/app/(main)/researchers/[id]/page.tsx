'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getApiUrl } from '@/utils/api';

type ResearcherDetail = {
  id: string;
  name: string;
  qualification: string;
  email: string;
  contact: string;
  specialization: string;
  bio: string;
  image: string;
  orcid?: string;
  publications: any[];
};

export default function PublicResearcherProfile() {
  const { id } = useParams();
  const [researcher, setResearcher] = useState<ResearcherDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(getApiUrl(`/api/researchers/${id}`))
      .then(res => res.json())
      .then(setResearcher)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center">
        <div className="text-3xl font-light text-slate-600 animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  if (!researcher) {
    return <div className="text-center py-20 text-red-600">Researcher not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#E0F2FE]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md flex items-center justify-center">
              <span className="text-white font-bold text-xl">RP</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Research Portal
            </h1>
          </div>
          <div className="text-sm text-slate-500">Faculty Profile</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side - Bio + Publications */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{researcher.name}</h1>
            <p className="text-slate-600 mb-6">{researcher.qualification}</p>

            {/* Bio */}
            <div className="prose text-gray-700 leading-relaxed">
              <p>{researcher.bio || "No biography available for this researcher."}</p>
            </div>
          </div>

          {/* Publications Section - Professional & Clean */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Publications</h2>

            {researcher.publications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No publications available yet.
              </div>
            ) : (
              <div className="space-y-8">
                {researcher.publications.map((pub, index) => (
                  <div key={pub.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-800 leading-tight">
                          {pub.title}
                        </h3>

                        {/* Authors */}
                        <p className="text-sm text-slate-600 mt-3">
                          <span className="font-medium">Authors:</span>{' '}
                          {Array.isArray(pub.authors) 
                            ? pub.authors.join(' • ') 
                            : researcher.name}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-3 mt-4">
                          {pub.journal_name && (
                            <span className="px-4 py-1.5 bg-slate-100 rounded-full text-slate-700 text-sm flex items-center gap-1">
                              📍  {pub.journal_name}
                            </span>
                          )}
                          {pub.conference_info && (
                            <span className="px-4 py-1.5 bg-purple-100 rounded-full text-purple-700 text-sm flex items-center gap-1">
                              🎤 {pub.conference_info}
                            </span>
                          )}
                          {pub.publisher && (
                            <span className="px-4 py-1.5 bg-green-100 rounded-full text-green-700 text-sm flex items-center gap-1">
                              📔 {pub.publisher}
                            </span>
                          )}
                        </div>

                        {/* DOI & Links */}
                        <div className="mt-5 flex flex-wrap gap-4 text-sm">
                          {pub.doi && (
                            <span className="font-mono text-blue-600">
                              DOI: {pub.doi}
                            </span>
                          )}
                          {pub.url && (
                            <a 
                              href={pub.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline font-medium"
                            >
                              View Publication →
                            </a>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                          <button 
                            onClick={() => alert(pub.abstract || "Abstract not available.")}
                            className="text-xs px-5 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
                          >
                            📄 Abstract
                          </button>
                          {pub.url && (
                            <a 
                              href={pub.url} 
                              target="_blank" 
                              className="text-xs px-5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition"
                            >
                              🌐 HTML
                            </a>
                          )}
                          {pub.pdf_path && (
                            <a 
                              href={getApiUrl(pub.pdf_path)} 
                              target="_blank" 
                              className="text-xs px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition"
                            >
                              📑 PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Square Image + Info */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 h-fit sticky top-24">
          <div className="space-y-6">
            {/* Square Profile Image */}
            <div className="flex justify-center">
              <div className="w-48 h-48 border-4 border-white shadow-lg overflow-hidden bg-gray-100 rounded-xl">
                <img
                  src={getApiUrl(researcher.image)}
                  alt={researcher.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-5 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Specialization</p>
                <p className="text-gray-600 mt-1">{researcher.specialization}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Email</p>
                <a href={`mailto:${researcher.email}`} className="text-blue-600 hover:underline break-all">
                  {researcher.email}
                </a>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Contact Number</p>
                <p className="text-gray-600">{researcher.contact}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Qualification</p>
                <p className="text-gray-600">{researcher.qualification}</p>
              </div>

              {researcher.orcid && (
                <div>
                  <p className="font-semibold text-gray-700">ORCID</p>
                  <p className="font-mono text-blue-600">{researcher.orcid}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}