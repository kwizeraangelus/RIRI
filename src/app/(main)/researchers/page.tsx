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
  image: string;
};

export default function ResearchersPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const filtered = researchers.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.Position && r.Position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="text-center py-20 text-xl">Loading Researchers...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900">
      {/* DARK NAVY TOP BAND */}
      <div className="h-28 bg-[#050A14]" aria-hidden="true" />

      {/* HERO SECTION - Only this part changed */}
      <section className="relative -mt-28 pt-36 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#050A14] mb-6">
            Our <span className="text-[#FFD700]">Researchers</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Meet the brilliant minds advancing research and innovation in Rwanda
          </p>
        </div>
      </section>

      {/* SEARCH BAR - Kept close to original */}
      <div className="max-w-5xl mx-auto px-6 mb-10">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600">
            <Search size={24} />
          </div>
          <input
            type="text"
            placeholder="Search by Name or Position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-300 rounded-2xl text-lg focus:outline-none focus:border-[#FFD700] shadow-sm"
          />
        </div>
      </div>

      {/* MAIN CONTENT - Unchanged from your original style */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="space-y-8">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No researchers found.</div>
          ) : (
            filtered.map((person) => (
              <div key={person.id} className="flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-8 last:border-none">
                <div className="w-32 h-40 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/120x150/003087/ffffff?text=No+Image';
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{person.name}</h3>

                  <div className="space-y-2 text-sm">
                    <div className="text-gray-500">
                      <span className="font-medium text-gray-700">Qualification:</span> {person.qualification}
                    </div>
                    <div className="text-gray-500">
                      <span className="font-medium text-gray-700">E-Mail ID:</span>{' '}
                      <a href={`mailto:${person.email}`} className="text-blue-600 hover:underline">{person.email}</a>
                    </div>
                    <div className="text-gray-500">
                      <span className="font-medium text-gray-700">Contact Number:</span> {person.contact}
                    </div>
                    <div className="text-gray-500">
                      <span className="font-medium text-gray-700">Position:</span> {person.Position}
                    </div>
                  </div>

                  <Link href={`/researchers/${person.id}`}>
                    <button className="mt-5 bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors">
                      VIEW PROFILE
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}