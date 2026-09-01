// app/researchers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/utils/api';
import { Search } from 'lucide-react';

type Researcher = {
  id: string;
  name: string;
  qualification: string;
  email: string;
  contact: string;
  Position: string;
  Field: string;
  ResearchArea: string;
  image: string;
};

export default function ResearchersPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Pagination (10 per page, same style as the Publications page) ──
  const resultsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);




  useEffect(() => {
    fetchResearchers();
  }, []);

  const fetchResearchers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(getApiUrl('/api/researchers'));
      
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      
      const data = await res.json();
      setResearchers(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load researchers");
    } finally {
      setLoading(false);
    }
  };
   
  const filtered = researchers.filter(r => {
    const term = searchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(term) ||
      (r.qualification && r.qualification.toLowerCase().includes(term)) ||
      (r.Position && r.Position.toLowerCase().includes(term)) ||
      (r.ResearchArea && r.ResearchArea.toLowerCase().includes(term)) ||
      (r.Field && r.Field.toLowerCase().includes(term))
    );
  });

  // Reset to page 1 whenever the filtered result set changes (new search, data reload, etc.)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, researchers]);

  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage));
  const pageStartIndex = (currentPage - 1) * resultsPerPage;
  const pageResearchers = filtered.slice(pageStartIndex, pageStartIndex + resultsPerPage);

  const PersonAvatar: React.FC<{ image?: string; name: string }> = ({ image, name }) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = !!image && !imgError;

  return (
    <div className="w-36 h-44 bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
  {image ? (
    <img
      src={image}
      alt={name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextElementSibling?.classList.remove('hidden');
      }}
    />
  ) : null}
  <svg
    className={`w-16 h-16 text-gray-300 ${image ? 'hidden' : ''}`}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v2h14v-2c0-2.761-3.134-5-7-5z" />
  </svg>
</div>
  );
};

  if (loading) return <div className="text-center py-20 text-3xl">Loading Researchers...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-3xl">Error: {error}</div>;

  return (
    <div className=" bg-[#E0F2FE] text-gray-900">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-2xl md:text-3xl text-gray-700 max-w-2xl mx-auto">
            Meet the brilliant minds advancing research and innovation in Rwanda
          </p>
        </div>
      </section>

      {/* SEARCH BAR */}
      <div className="max-w-5xl mx-auto px-6 mb-10">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600">
            <Search size={28} />
          </div>
          <input
            type="text"
            placeholder="Search by Name, Qualification, Position, Research Area, Field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-300 rounded-2xl text-lg focus:outline-none focus:border-[#FFD700] shadow-sm"
          />
        </div>
        {searchTerm && (
          <p className="text-center text-base text-slate-500 mt-3">
            {totalResults} result{totalResults !== 1 ? 's' : ''} for <span className="font-semibold text-slate-700">"{searchTerm}"</span>
          </p>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="space-y-8">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-2xl text-gray-500">No researchers found.</div>
          ) : (
            pageResearchers.map((person) => (
              <div 
                key={person.id} 
                className="flex flex-col md:flex-row gap-8 border-b border-gray-200 pb-10 last:border-none bg-white rounded-2xl p-6 shadow-sm"
              >
                {/* Left Column: Image + Button */}
               <div className="flex flex-col items-center md:items-start w-full md:w-52 flex-shrink-0">
  <PersonAvatar image={person.image} name={person.name} />

  <Link href={`/researchers/${person.id}`} className="w-full md:w-auto">
    <button className="w-full md:w-auto bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-3 rounded-xl text-lg transition-colors">
      VIEW PROFILE
    </button>
  </Link>
</div>

{/* Right Column: Text Content */}
<div className="flex-1 pt-1">
  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{person.name}</h3>

  <div className="space-y-2 text-lg">
    <div className="text-gray-500">
      <span className="font-medium text-gray-700">Qualification:</span> {person.qualification}
    </div>
    <div className="text-gray-500">
      <span className="font-medium text-gray-700">E-Mail ID:</span>{' '}
      <a href={`mailto:${person.email}`} className="text-blue-600 hover:underline">{person.email}</a>
    </div>
    <div className="text-gray-500">
      <span className="font-medium text-gray-700">Position:</span> {person.Position}
    </div>
    <div className="text-gray-500">
      <span className="font-medium text-gray-700">Research Area:</span> {person.ResearchArea}
    </div>
    <div className="text-gray-500">
      <span className="font-medium text-gray-700">Field:</span> {person.Field}
    </div>
  </div>
</div>
              </div>
            ))
          )}
        </div>

        {/* Pagination – 10 items per page, same style as the Publications page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8 mb-4">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              First
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous"
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-[34px] px-2.5 py-1.5 text-sm border rounded ${
                  currentPage === page
                    ? 'bg-teal-500 text-white border-teal-500 font-medium'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}