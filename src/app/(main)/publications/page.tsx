'use client';
import { useState, useEffect, useMemo, ReactNode } from 'react';
import { getApiUrl } from '@/utils/api';

interface User {
  username?: string;
}

interface Publication {
  id: string;
  title?: string;
  authors?: string | string[];
  journal_name?: string;
  publisher?: string;
  publication_type?: string;
  pdf_path?: string;
  doi?: string;
  url?: string;
  user?: User;
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const res = await fetch(getApiUrl('/api/publications/public'));
        if (res.ok) setPublications(await res.json());
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPubs();
  }, []);

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  const filtered = useMemo<Publication[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return publications;
    return publications.filter((pub) => {
      const authors = Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors || '';
      return (
        (pub.title || '').toLowerCase().includes(q) ||
        authors.toLowerCase().includes(q) ||
        (pub.journal_name || '').toLowerCase().includes(q) ||
        (pub.publisher || '').toLowerCase().includes(q) ||
        (pub.publication_type || '').toLowerCase().includes(q)
      );
    });
  }, [query, publications]);

  const highlight = (text: string, q: string): ReactNode => {
    if (!q.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${q.trim()})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.trim().toLowerCase()
        ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part}</mark>
        : part
    );
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900">

      {/* HERO */}
      <section className="relative pt-20 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#050A14] mb-6">
            Explore Research <span className="text-[#FFD700]">Library</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-10">
            Explore the latest journals, books, and innovations from Rwanda&apos;s leading researchers.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 px-4 py-3 gap-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setOpenId(null); }}
                placeholder="Search by title, author, journal, type…"
                className="flex-1 text-base text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setOpenId(null); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#050A14]">
              {query.trim() ? `Results for "${query.trim()}"` : 'Research Library'}
            </h2>
            {!loading && (
              <span className="text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
                {filtered.length} {query.trim() ? 'found' : 'items'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between px-6 py-4 gap-4">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
              {query.trim() ? (
                <>
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <p className="text-gray-400 italic text-base">No results for &ldquo;{query}&rdquo;</p>
                  <button onClick={() => setQuery('')} className="mt-3 text-sm text-blue-600 hover:underline">
                    Clear search
                  </button>
                </>
              ) : (
                <p className="text-gray-400 italic text-base">No approved publications found.</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((pub) => {
                const isOpen = openId === pub.id;
                const authors = Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors || 'Unknown';
                const q = query.trim().toLowerCase();

                return (
                  <div
                    key={pub.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
                  >
                    {/* ROW */}
                    <button
                      onClick={() => toggle(pub.id)}
                      className="w-full flex items-start justify-between px-6 py-5 gap-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#050A14] text-base sm:text-lg break-words">
                          {highlight(pub.title || 'Untitled', q)}
                        </p>
                        <p className="text-gray-500 text-sm italic mt-1 text-left truncate">
                          {highlight(authors, q)}
                        </p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* EXPANDED DETAIL */}
                    {isOpen && (
                      <div className="px-6 pb-6 pt-3 bg-gray-50 border-t border-gray-100 text-base text-gray-600 space-y-3">
                        {pub.publication_type && (
                          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded">
                            {pub.publication_type}
                          </span>
                        )}
                        <p><span className="text-gray-400">Authors:</span> {highlight(authors, q)}</p>
                        {(pub.journal_name || pub.publisher) && (
                          <p>
                            <span className="text-gray-400">Journal / Publisher:</span>{' '}
                            {highlight(pub.journal_name || pub.publisher || '', q)}
                          </p>
                        )}
                        {pub.doi && (
                          <p>
                            <span className="text-gray-400">DOI:</span>{' '}
                            <a
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-blue-600 hover:underline"
                            >
                              {pub.doi}
                            </a>
                          </p>
                        )} 
                        {pub.pdf_path && (
  <a
    href={getApiUrl(pub.pdf_path)}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-[#050A14] font-semibold hover:underline mt-2 text-base"
  >
    📑 Read PDF
  </a>
)}
                        {pub.url && (
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#050A14] font-semibold hover:underline mt-2 text-base"
                          >
                            Read full work
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050A14] text-white py-12 mt-20 text-center">
        <p className="text-[#FFD700] font-bold text-5xl italic mb-2">RIRI</p>
        <p className="text-gray-400 text-base">Rwanda Innovation & Research Institute</p>
      </footer>
    </div>
  );
}