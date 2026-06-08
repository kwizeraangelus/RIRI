'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getApiUrl } from '@/utils/api';

interface Expert {
  id: string;
  name: string;
  title: string;
  location: string;
  bio: string;
  profileImage?: string;
  yearOfExperience: number;
  expertise: string[];
  verified: boolean;
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/experts'));
      const data = await response.json();
      setExperts(data);
    } catch (err) {
      setError('Failed to fetch experts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading experts...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Expert Directory</h1>
          
        </div>

        {experts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No experts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <Link key={expert.id} href={`/experts/${expert.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  {expert.profileImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={expert.profileImage}
                        alt={expert.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">{expert.name}</h2>
                      {expert.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-blue-600 font-medium mb-1">{expert.title}</p>
                    <p className="text-gray-600 text-sm mb-2">{expert.location}</p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{expert.bio}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {expert.yearOfExperience} years exp.
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {expert.expertise.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {expert.expertise.length > 3 && (
                        <span className="text-gray-500 text-xs px-2 py-1">
                          +{expert.expertise.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}