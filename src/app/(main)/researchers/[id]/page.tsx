// app/researchers/[id]/page.tsx
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
  Position: string;
  ResearchArea: string;
  Field: string;
  bio: string;
  image: string;
  orcid?: string;
  publications: any[];
};

export default function PublicResearcherProfile() {
  const { id } = useParams();
  const [researcher, setResearcher] = useState<ResearcherDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAbstractId, setOpenAbstractId] = useState<string | null>(null);

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
        <div className="text-4xl font-light text-slate-600 animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  if (!researcher) {
    return <div className="text-center py-20 text-red-600 text-2xl">Researcher not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#E0F2FE]">
      {/* Header */}
      

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Right Sidebar - Appears FIRST on mobile, second on desktop */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 h-fit lg:sticky lg:top-24 order-first lg:order-last">
          <div className="space-y-6">
            {/* Square Profile Image */}
            <div className="flex justify-center">
              <div className="w-48 h-48 border-4 border-white shadow-lg overflow-hidden bg-gray-100 rounded-xl">
                <img
                  src={researcher.image ||  "https://placeholder.co"}
                  alt={researcher.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-5 text-base">
              <div>
                <p className="font-semibold text-gray-700 text-lg">
                  Position <span className="text-gray-400 text-base">(current Occupation)</span>
                </p>
                <p className="text-gray-600 mt-1">{researcher.Position}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-lg">Research Area</p>
                <p className="text-gray-600 mt-1">{researcher.ResearchArea}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-lg">Field</p>
                <p className="text-gray-600 mt-1">{researcher.Field}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-lg">Email</p>
                <a href={`mailto:${researcher.email}`} className="text-blue-600 hover:underline break-all">
                  {researcher.email}
                </a>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-lg">Contact Number</p>
                <p className="text-gray-600">{researcher.contact}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-lg">Qualification</p>
                <p className="text-gray-600">{researcher.qualification}</p>
              </div>
              {researcher.orcid && (
                <div>
                  <p className="font-semibold text-gray-700 text-lg">ORCID</p>
                  <p className="font-mono text-blue-600">{researcher.orcid}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Left Side - Bio + Publications - Appears SECOND on mobile, first on desktop */}
        <div className="lg:col-span-2 space-y-8 order-last lg:order-first">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">{researcher.name}</h1>
            <p className="text-slate-600 mb-6 text-lg">{researcher.qualification}</p>

            {/* Bio - with justified text */}
            <div className="prose text-gray-700 leading-relaxed text-justify text-lg">
              <p>{researcher.bio || "No biography available for this researcher."}</p>
            </div>
          </div>

          {/* Publications Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Publications</h2>

            {researcher.publications.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-lg">
                No publications available yet.
              </div>
            ) : (
              <div className="space-y-8">
                {researcher.publications.map((pub, index) => (
                  <div key={pub.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-base">
                          {index + 1}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-slate-800 leading-tight">
                            {pub.title}
                          </h3>

                          {/* Authors */}
                          <p className="text-base text-slate-600 mt-3">
                            <span className="font-medium">Authors:</span>{' '}
                            {Array.isArray(pub.authors) 
                              ? pub.authors.join(' • ') 
                              : researcher.name}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-3 mt-4">
                            {pub.journal_name && (
                              <span className="px-4 py-1.5 bg-slate-100 rounded-full text-slate-700 text-base flex items-center gap-1">
                                📍 {pub.journal_name}
                              </span>
                            )}
                            {pub.conference_info && (
                              <span className="px-4 py-1.5 bg-purple-100 rounded-full text-purple-700 text-base flex items-center gap-1">
                                🎤 {pub.conference_info}
                              </span>
                            )}
                            {pub.publisher && (
                              <span className="px-4 py-1.5 bg-green-100 rounded-full text-green-700 text-base flex items-center gap-1">
                                📔 {pub.publisher}
                              </span>
                            )}
                          </div>

                          {/* DOI */}
                          <div className="mt-5 flex flex-wrap gap-4 text-base">
                            {pub.doi && (
                              <a 
                                href={`https://doi.org/${pub.doi}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                              >
                                DOI: {pub.doi}
                              </a>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-6">
                            {pub.abstract && (
                              <button
                                onClick={() => setOpenAbstractId(openAbstractId === pub.id ? null : pub.id)}
                                className="text-sm px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition flex items-center gap-1.5"
                              >
                                📄 Abstract
                                <span className="text-slate-300 text-sm">{openAbstractId === pub.id ? '▲' : '▼'}</span>
                              </button>
                            )}
                            {!pub.abstract && (
                              <button
                                disabled
                                className="text-sm px-5 py-2.5 bg-slate-100 text-slate-400 rounded-lg font-medium cursor-not-allowed"
                              >
                                📄 Abstract
                              </button>
                            )}
                            {pub.url && (
                              <a 
                                href={pub.url} 
                                target="_blank" 
                                className="text-sm px-5 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition"
                              >
                                🌐 HTML
                              </a>
                            )}
                            {pub.pdf_path && (
                              <a 
                                href={pub.pdf_path} 
                                target="_blank" 
                                className="text-sm px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition"
                              >
                                📑 PDF
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Full-width Abstract - Below the publication info */}
                      {openAbstractId === pub.id && pub.abstract && (
                        <div className="mt-2 p-6 bg-gray-100 border border-gray-300 rounded-lg w-full">
                          <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Abstract</p>
                          <p className="text-base text-gray-900 leading-relaxed text-justify">{pub.abstract}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}