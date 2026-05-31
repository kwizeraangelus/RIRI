'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/utils/api';

type Researcher = {
  id: string;
  name: string;
  qualification: string;
  email: string;
  contact: string;
  specialization: string;
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
    r.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-xl">Loading Researchers...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#E0F2FE] py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-sm text-gray-500 mb-6">HOME / SCHOOL OF COMPUTER STUDIES / FACULTY</div>

        <h1 className="text-3xl font-bold text-red-800 mb-8">HOD & Directors</h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by Name or Specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-5 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-700"
          />
        </div>

        <div className="space-y-8">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No researchers found.</div>
          ) : (
            filtered.map((person) => (
              <div key={person.id} className="flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-8 last:border-none">
                <div className="w-32 h-40 flex-shrink-0 bg-gray-100">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover border border-gray-300" 
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
                      <span className="font-medium text-gray-700">Area Of Specialization:</span> {person.specialization}
                    </div>
                  </div>

                  <Link href={`/researchers/${person.id}`}>
                    <button className="mt-5 bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-2.5 rounded text-sm transition-colors">
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