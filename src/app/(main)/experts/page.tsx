'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Expert = {
  id: string;
  name: string;
  qualification: string;
  email: string;
  contact: string;
  specialization: string;
  image: string;
};

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://localhost:8000/api/experts');

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      // Safety check
      if (Array.isArray(data)) {
        setExperts(data);
      } else {
        console.error("API did not return array:", data);
        setExperts([]);
        setError("Invalid data received from server");
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to load experts");
      setExperts([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = Array.isArray(experts) 
    ? experts.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) return <div className="text-center py-20 text-xl">Loading Experts...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#E0F2FE] py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-sm text-gray-500 mb-6">HOME / SCHOOL OF COMPUTER STUDIES / EXPERTS</div>

        <h1 className="text-3xl font-bold text-red-800 mb-8">Experts</h1>

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
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? "No matching experts found." : "No experts available yet."}
            </div>
          ) : (
            filtered.map((person) => (
              <div key={person.id} className="flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-8 last:border-none">
                <div className="w-32 h-40 flex-shrink-0 bg-gray-100">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover border border-gray-300" 
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/120x150/003087/ffffff?text=Expert';
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