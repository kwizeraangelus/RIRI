'use client';
import { useState, useEffect, useMemo, ReactNode } from 'react';
import Link from 'next/link';
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
  year?: string;
  doi?: string;
  url?: string;
  user?: User;
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  // ── Pagination (10 per page, same style as the Theses page) ──
  const resultsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset to page 1 whenever the filtered result set changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, publications]);

  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage));
  const pageStartIndex = (currentPage - 1) * resultsPerPage;
  const pagePublications = filtered.slice(pageStartIndex, pageStartIndex + resultsPerPage);

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

      {/* HERO – reduced top space */}
      <section className="relative pt-8 pb-2 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-6">
            Explore research articles, conference papers from Rwanda&apos;s leading researchers which are published in various journals.
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

      {/* LIST – reduced space under search */}
      <section className="pt-6 pb-16 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
              {totalResults} {query.trim() ? 'found' : 'publications'}
            </span>
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
            <>
              <div className="flex flex-col gap-2">
                {pagePublications.map((pub) => {
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
                          <p className="font-medium text-black text-base sm:text-lg break-words">
                            {highlight(pub.title || 'Untitled', q)}
                          </p>
                          {!isOpen && (
                            <p className="text-black text-sm italic mt-1 text-left truncate">
                              {highlight(authors, q)}
                            </p>
                          )}
                        </div>
                        <svg
                          className={`w-5 h-5 text-black flex-shrink-0 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* EXPANDED DETAIL */}
                      {isOpen && (
                        <div className="px-6 pb-6 pt-3 bg-gray-50 border-t border-gray-100 text-base text-gray-600 space-y-3">
                          {/* ── Publication type badge, above the title ── */}
{pub.publication_type && (
  <span className="inline-block text-sm font-bold  tracking-wider bg-blue-100 text-blue-500 px-3 py-1 rounded mb-2">
    {pub.publication_type === 'journal'
      ? 'Article'
      : pub.publication_type === 'conference'
      ? 'Conference Paper'
      : pub.publication_type}
  </span>
)}
                         <p><span className="text-black font-bold">Authors:</span> {highlight(authors, q)}</p>
{(pub.journal_name || pub.publisher || pub.year || pub.doi) && (
  <p>
    {(pub.journal_name || pub.publisher) && (
      <>
        <span className="text-black font-bold">Journal / Publisher:</span>{' '}
        {highlight(pub.journal_name || pub.publisher || '', q)}.
      </>
    )}
    {pub.year && <> {pub.year}.</>}
    {pub.doi && (
      
      <a  href={`https://doi.org/${pub.doi}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-blue-600 hover:underline"
        title={pub.doi}
      >
        DOI
      </a>
    )}
  </p>
)}
                         
                          {pub.pdf_path && (
                            <a
                              href={pub.pdf_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#050A14] font-semibold hover:underline mt-2 text-base"
                            >
                              📑 Read PDF
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-8 mb-2">
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
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0c1e30] text-white pt-14 pb-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
            <div className="lg:col-span-1">
              <p
                className="font-bold uppercase text-white mb-1"
                style={{ fontFamily: "'Bell MT', 'Palatino Linotype', Georgia, serif", fontSize: '38px', letterSpacing: '4px', fontStyle: 'italic', lineHeight: 1 }}
              >
                RIRI
              </p>
              <p className="text-[#FFD700] text-[9px] uppercase tracking-widest mb-4"></p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Rwanda's premier platform connecting researchers, innovators, and knowledge seekers.
              </p>
            </div>

            <div>
              <h4 className="text-[#FFD700] font-bold uppercase tracking-widest text-xs mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {['Researchers', 'Theses', 'Publications', 'Innovations', 'Events'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-gray-300 hover:text-[#FFD700] transition text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#FFD700] font-bold uppercase tracking-widest text-xs mb-5">Contact Us</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">✉</span>
                  <span>info@riri.rw</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">📍</span>
                  <span>Kigali, Rwanda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#FFD700]">📞</span>
                  <span>+250 793211640</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#FFD700] font-bold uppercase tracking-widest text-xs mb-5">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Facebook', icon: 'f' },
                  { name: 'WhatsApp', icon: 'w' },
                  { name: 'Instagram', icon: 'ig' },
                  { name: 'TikTok', icon: 'tt' },
                ].map((social) => (
                  <button
                    key={social.name}
                    onClick={() => notifyInfo(social.name)}
                    className="px-4 py-2 rounded-full border border-white/20 text-sm text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] transition"
                  >
                    {social.name}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-6 leading-relaxed">
                Stay updated with the latest research events and innovations from Rwanda.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} RIRI. All Rights Reserved.</p>
            <div className="flex gap-5">
              <Link href="/about" className="hover:text-[#FFD700] transition">About</Link>
              <Link href="/contact" className="hover:text-[#FFD700] transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}