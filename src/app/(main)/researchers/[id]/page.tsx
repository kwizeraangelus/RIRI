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
  graduation_university: string;
  graduation_country: string;
  contact: string;
  Position: string;
  ResearchArea: string;
  institution: string;
  location: string;
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
        <div className="text-2xl sm:text-4xl font-light text-slate-600 animate-pulse">
          Loading Profile...
        </div>
      </div>
    );
  }

  if (!researcher) {
    return (
      <div className="text-center py-20 text-red-600 text-xl sm:text-2xl">
        Researcher not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F2FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Right Sidebar - Appears FIRST on mobile, second on desktop */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-6 h-fit lg:sticky lg:top-24 order-first lg:order-last">
          <div className="space-y-5 sm:space-y-6">
            {/* Square Profile Image */}
            <div className="flex justify-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 border-4 border-white shadow-lg overflow-hidden bg-gray-100 rounded-xl">
                <img
                  src={researcher.image || "https://placeholder.co"}
                  alt={researcher.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4 sm:space-y-5 text-sm sm:text-base">
              <div>
                <p className="font-semibold text-gray-700 text-base sm:text-lg">
                  Position <span className="text-gray-400 text-sm sm:text-base">(current Occupation)</span>
                </p>
                <p className="text-gray-600 mt-1">{researcher.Position}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-base sm:text-lg">Affiliation Institution</p>
                <p className="text-gray-600">{researcher.institution}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-base sm:text-lg">Research Area</p>
                <p className="text-gray-600 mt-1">{researcher.ResearchArea}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-base sm:text-lg">Field</p>
                <p className="text-gray-600 mt-1">{researcher.Field}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-base sm:text-lg">Contact Number</p>
                <p className="text-gray-600">{researcher.contact}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-base sm:text-lg">Graduation University</p>
                <p className="text-gray-600">{researcher.graduation_university}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-base sm:text-lg">Country</p>
                <p className="text-gray-600">{researcher.graduation_country}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-base sm:text-lg">Qualification</p>
                <p className="text-gray-600">{researcher.qualification}</p>
              </div>

              {researcher.orcid && (
                <div>
                  <p className="font-semibold text-gray-700 text-base sm:text-lg">ORCID</p>
                  <p className="font-mono text-blue-600 break-all">{researcher.orcid}</p>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-700 text-base sm:text-lg">Current location</p>
                <p className="text-gray-600">{researcher.location}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Left Side - Bio + Publications - Appears SECOND on mobile, first on desktop */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8 order-last lg:order-first">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
              {researcher.name}
            </h1>
            <p className="text-slate-600 mb-4 sm:mb-6 text-base sm:text-lg">
              {researcher.qualification}
            </p>

            {/* Bio - with justified text */}
            <div className="prose text-gray-700 leading-relaxed text-justify text-base sm:text-lg">
              <p>{researcher.bio || "No biography available for this researcher."}</p>
            </div>
          </div>

          {/* Publications Section */}
<div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 sm:p-8">
  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-5 sm:mb-6">
    Publications
  </h2>

  {researcher.publications.length === 0 ? (
    <div className="text-center py-10 sm:py-12 text-gray-500 text-base sm:text-lg">
      No publications available yet.
    </div>
  ) : (
    <div className="space-y-6 sm:space-y-8">
      {researcher.publications.map((pub, index) => (
        <div
          key={pub.id}
          className="border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm sm:text-base">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                {/* ── Publication type badge, above the title ── */}
                {pub.publication_type && (
                  <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded mb-2">
                    {pub.publication_type === 'journal'
                      ? 'Article'
                      : pub.publication_type === 'conference'
                      ? 'Conference Paper'
                      : pub.publication_type}
                  </span>
                )}

                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 leading-tight">
                  {pub.title}
                </h3>

                {/* Authors */}
<p className="text-sm sm:text-base text-slate-600 mt-2 sm:mt-3">
  <span className="font-medium">Authors:</span>{' '}
  {Array.isArray(pub.authors)
    ? pub.authors.join(' • ')
    : researcher.name}
</p>

{/* ── Journal/Conference + DOI row, with PDF button on the right ── */}
<div className="mt-1 flex flex-wrap items-center justify-between gap-2">
  <p className="text-sm text-slate-600 m-0">
    {[pub.journal_name, pub.conference_info, pub.publisher, pub.year]
      .filter(Boolean)
      .join(' • ')}
    {pub.doi && (
      <>
        {' • '}
        
         <a href={`https://doi.org/${pub.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-mono hover:underline"
          title={pub.doi}
        >
          DOI
        </a>
      </>
    )}
  </p>

  {pub.pdf_path && (
    
    <a  href={pub.pdf_path}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition shrink-0"
    >
      📑 PDF
    </a>
  )}
</div>

                {/* Action Buttons (Abstract / HTML) */}
              {/* <div className="flex flex-wrap gap-2 sm:gap-3 mt-5 sm:mt-6">
                  {pub.abstract && (
                    <button
                      onClick={() =>
                        setOpenAbstractId(
                          openAbstractId === pub.id ? null : pub.id
                        )
                      }
                      className="text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition flex items-center gap-1.5"
                    >
                      📄 Abstract
                      <span className="text-slate-300 text-xs sm:text-sm">
                        {openAbstractId === pub.id ? '▲' : '▼'}
                      </span>
                    </button>
                  )}
                  {!pub.abstract && (
                    <button
                      disabled
                      className="text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-100 text-slate-400 rounded-lg font-medium cursor-not-allowed"
                    >
                      📄 Abstract
                    </button>
                  )}
                  {pub.url && (
                    
                     <a href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition"
                    >
                      🌐 HTML
                    </a>
                  )}
                </div> */}
              </div>
            </div>

            {/* Full-width Abstract */}
            {openAbstractId === pub.id && pub.abstract && (
              <div className="mt-2 p-4 sm:p-6 bg-gray-100 border border-gray-300 rounded-lg w-full">
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wider">
                  Abstract
                </p>
                <p className="text-sm sm:text-base text-gray-900 leading-relaxed text-justify">
                  {pub.abstract}
                </p>
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