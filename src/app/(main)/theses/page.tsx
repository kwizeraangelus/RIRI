'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/utils/api';

// ──────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────
interface Publication {
  id: number;
  year: number;
  title: string;
  status: string;
  authors: string;
  description: string;
  file_url: string;
  supervisor_name?: string;
  submission_type?: string;
  degree_type?: 'thesis' | 'dissertation';
  university_name?: string;
  average_rating?: number; // NEW - computed by backend (rating_sum / rating_count)
  rating_count?: number;   // NEW - number of ratings submitted
}

interface Counts {
  thesis: number;
  dissertation: number;
  engineering: number;
  medicine_health_sciences: number;
  arts_humanities: number;
  natural_sciences: number;
  social_sciences: number;
  business_economics: number;
  computer_science_it: number;
  education: number;
}

interface AuthUser {
  id: number;
  username: string;
  email: string;
  user_category: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
}

// ──────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────
const CORE_FIELDS = [
  'Engineering',
  'Medicine/Health Sciences',
  'Arts & Humanities',
  'Natural Sciences',
  'Social Sciences',
  'Business & Economics',
  'Computer Science/IT',
  'Education',
] as const;

// Maps display label → Counts key (for API/filter)
const FIELD_TO_KEY: Record<string, keyof Counts> = {
  'Engineering':              'engineering',
  'Medicine/Health Sciences': 'medicine_health_sciences',
  'Arts & Humanities':        'arts_humanities',
  'Natural Sciences':         'natural_sciences',
  'Social Sciences':          'social_sciences',
  'Business & Economics':     'business_economics',
  'Computer Science/IT':      'computer_science_it',
  'Education':                'education',
};

// Maps Counts key → clean display label
// NOTE: display label only — the underlying key/value stays "dissertation" everywhere else
const FIELD_DISPLAY_NAMES: Record<string, string> = {
  thesis:                   'Thesis',
  dissertation:             'FYP',
  engineering:              'Engineering',
  medicine_health_sciences: 'Medicine / Health Sciences',
  arts_humanities:          'Arts & Humanities',
  natural_sciences:         'Natural Sciences',
  social_sciences:          'Social Sciences',
  business_economics:       'Business & Economics',
  computer_science_it:      'Computer Science / IT',
  education:                'Education',
};

// Keywords sent to API for field filtering
const FIELD_KEYWORDS: Record<string, string[]> = {
  'Engineering':              ['engineering', 'electrical', 'mechanical', 'civil', 'iot', 'robotics'],
  'Medicine/Health Sciences': ['medicine', 'health', 'nursing', 'pharmacy', 'clinical', 'public health'],
  'Arts & Humanities':        ['law', 'literature', 'philosophy', 'history', 'arts', 'humanities', 'language'],
  'Natural Sciences':         ['biology', 'chemistry', 'physics', 'mathematics', 'geology', 'environment'],
  'Social Sciences':          ['sociology', 'psychology', 'anthropology', 'political', 'social', 'development'],
  'Business & Economics':     ['business', 'economics', 'finance', 'management', 'accounting', 'marketing'],
  'Computer Science/IT':      ['computer', 'it', 'informatics', 'ai', 'software', 'data', 'cyber'],
  'Education':                ['education', 'pedagogy', 'teaching', 'curriculum', 'learning'],
};

const RESULTS_PER_PAGE_OPTIONS = [1, 5, 10, 20, 40, 60, 80, 100];

// ──────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────

/**
 * Converts any submission_type value from the backend into a clean display label.
 * Handles underscores, slashes, and degree prefixes gracefully.
 * Examples:
 *   "social_sciences"          → "Social Sciences"
 *   "medicine/health_sciences" → "Medicine / Health Sciences"
 *   "thesis-computer_science_it" → "Computer Science / IT"
 */
const formatFieldName = (submissionType?: string): string => {
  if (!submissionType) return 'Unknown Field';

  // Strip degree prefix (e.g. "thesis-" or "dissertation_")
  const cleaned = submissionType.replace(/^(thesis|dissertation)[_-]/i, '');

  // Normalize to underscore key: replace spaces and slashes with _
  const normalized = cleaned.toLowerCase().replace(/[\s/]+/g, '_');

  // Look up in display names map first
  if (FIELD_DISPLAY_NAMES[normalized]) {
    return FIELD_DISPLAY_NAMES[normalized];
  }

  // Fallback: replace underscores/slashes with spaces and title-case
  return cleaned
    .replace(/[_/]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/** Converts a raw degree_type value into the label shown in the UI ("thesis" -> "Thesis", "dissertation" -> "FYP"). */
const formatDegreeType = (degreeType?: string): string => {
  if (!degreeType) return '';
  return degreeType === 'thesis' ? 'Thesis' : degreeType === 'dissertation' ? 'FYP' : degreeType;
};

/** Converts a raw Counts key to a display label. */
const formatCountKey = (key: string): string =>
  FIELD_DISPLAY_NAMES[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Returns true if a publication matches the search query across all relevant fields. */
const matchesSearch = (pub: Publication, query: string): boolean => {
  if (!query) return true;
  const q = query.toLowerCase();
  return [
    pub.year,
    pub.title,
    pub.authors,
    pub.university_name,
    pub.supervisor_name,
    pub.degree_type,
    formatFieldName(pub.submission_type),
    formatDegreeType(pub.degree_type),
  ].some((field) => String(field ?? '').toLowerCase().includes(q));
};

/** Safely parses the stored user JSON from localStorage. */
const safeParseUser = (str: string | null): AuthUser | null => {
  if (!str || str === 'undefined' || str === 'null' || str === '') return null;
  try {
    const parsed = JSON.parse(str);
    if (parsed && typeof parsed === 'object') {
      return {
        id: parsed.id || 0,
        username: parsed.username || '',
        email: parsed.email || '',
        user_category: (parsed.user_category || '').toUpperCase(),
        first_name: parsed.first_name || '',
        last_name: parsed.last_name || '',
        is_staff: parsed.is_staff || false,
      };
    }
    return null;
  } catch {
    return null;
  }
};

/** Resolves where the "Upload Book" button should send the user. */
const getUploadDestination = (user: AuthUser | null): string => {
  if (user && user.user_category?.toUpperCase() === 'UNIVERSITY') {
    return '/university';
  }else if(user && user.user_category?.toUpperCase() === 'ADMIN'){
    return 'admin-dashboard';
  }
  return '/login';
};

// ──────────────────────────────────────────────────────
// StarRating — read-only display, or interactive (click to submit)
// ──────────────────────────────────────────────────────
const StarRating: React.FC<{
  average: number;
  count: number;
  interactive?: boolean;
  onRate?: (rating: number) => Promise<void> | void;
  size?: 'sm' | 'lg';
}> = ({ average, count, interactive = false, onRate, size = 'lg' }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // What value drives the filled stars: hover preview (interactive) or the real average
  const displayValue = hovered ?? average;
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-6 h-6';

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex" onMouseLeave={() => setHovered(null)}>
        {[1, 2, 3, 4, 5].map((star) => {
          // Partial-fill support: e.g. average 3.6 -> star 4 is 60% filled
          const fillPercent = Math.max(0, Math.min(1, displayValue - (star - 1))) * 100;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive || submitting}
              onMouseEnter={() => interactive && setHovered(star)}
              onClick={async (e) => {
                e.stopPropagation();
                if (!interactive || !onRate || submitting) return;
                setSubmitting(true);
                try {
                  await onRate(star);
                } finally {
                  setSubmitting(false);
                }
              }}
              className={`relative ${starSize} ${interactive ? 'cursor-pointer' : 'cursor-default'} ${
                submitting ? 'opacity-50' : ''
              }`}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              {/* Empty star (background) */}
              <svg className={`${starSize} absolute inset-0 text-gray-300`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
              </svg>
              {/* Filled star (clipped to fillPercent) */}
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                <svg className={`${starSize} text-[#FFD700]`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
      {count > 0 && (
        <span className="text-xs text-gray-500">
          {average.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────
// MiniPublicationCard — shown in the search dropdown
// ──────────────────────────────────────────────────────
const MiniPublicationCard: React.FC<Publication & { onClick: () => void }> = ({
  title, authors, university_name, degree_type, average_rating = 0, rating_count = 0, onClick,
}) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 cursor-pointer flex flex-col h-full min-h-[120px]"
  >
    <div className={`h-2 ${degree_type === 'thesis' ? 'bg-blue-500' : 'bg-purple-500'}`} />
    <div className="p-3 flex flex-col flex-1">
      <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-700 mb-2">
        {title}
      </h4>
      <div className="mt-auto space-y-1 text-xs">
        <p className="text-gray-700 line-clamp-1">
          <span className="text-gray-500">By:</span> {authors}
        </p>
        {university_name && <p className="text-gray-600 line-clamp-1">{university_name}</p>}
      </div>
      <div className="mt-1.5">
        <StarRating average={average_rating} count={rating_count} size="sm" />
      </div>
      {degree_type && (
        <div className="mt-2">
          <span
            className={`inline-block px-2.5 py-1 rounded text-[10px] font-medium text-white uppercase tracking-wide ${
              degree_type === 'thesis' ? 'bg-blue-600' : 'bg-purple-600'
            }`}
          >
            {degree_type === 'thesis' ? 'Thesis' : 'FYP'}
          </span>
        </div>
      )}
    </div>
  </div>
);

// ──────────────────────────────────────────────────────
// PublicationListItem — DSpace-style row shown in the main results list
// ──────────────────────────────────────────────────────
const PublicationListItem: React.FC<
  Publication & {
    expanded: boolean;
    onToggleExpand: () => void;
    onRate?: (id: number, rating: number) => Promise<void>;
  }
> = ({
  id, title, year, authors, description, supervisor_name, university_name, degree_type,
  average_rating = 0, rating_count = 0, expanded, onToggleExpand, onRate,
}) => {
  const router = useRouter();

  return (
    <div className="flex gap-5 py-6 border-b border-gray-200 last:border-b-0">
      {/* Thumbnail */}
      <button
        onClick={() => router.push(`/books/${id}`)}
        className="hidden sm:flex flex-shrink-0 w-[110px] h-[140px] bg-white border border-gray-300 rounded-sm shadow-sm items-center justify-center overflow-hidden"
        aria-label={`Open ${title}`}
      >
        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12h6m-6 4h6m-7 5h8a2 2 0 002-2V7.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0013.586 3H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        

        <h3
          onClick={() => router.push(`/books/${id}`)}
          className="text-lg sm:text-xl font-medium text-blue-700 hover:underline cursor-pointer leading-snug mb-1"
        >
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-2">
  {university_name && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/university/${encodeURIComponent(university_name)}`);
      }}
      className="font-semibold text-green-700 hover:underline text-left p-0 bg-transparent border-none cursor-pointer block"
    >
      <span className="text-gray-500 font-medium">University: </span>
      {university_name},
    </button>
  )}
 {!university_name && year ? <>({year}) </> : null}
{university_name && year ? <span className="text-gray-500"> {year} </span> : null}
{authors && <span className="text-gray-500"> · </span>}
{authors}
{supervisor_name && (
  <>
    <span className="text-gray-500">  </span>
    <span className="text-gray-500">Supervisor: </span>
    {supervisor_name}
  </>
)}
</p>

        <p className={`text-sm text-gray-700 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {description || 'No description available.'}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <button
            onClick={onToggleExpand}
            className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
          >
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {expanded ? 'Show less' : 'Show more'}
          </button>

          {degree_type && (
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-semibold text-white uppercase tracking-wide ${
                degree_type === 'thesis' ? 'bg-blue-600' : 'bg-purple-600'
              }`}
            >
              {degree_type === 'thesis' ? 'Thesis' : 'FYP'}
            </span>
          )}

          <StarRating
            average={average_rating}
            count={rating_count}
            interactive={!!onRate}
            onRate={onRate ? (rating) => onRate(id, rating) : undefined}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────
// ThesesPage — main page component
// ──────────────────────────────────────────────────────
export default function ThesesPage() {
  const router = useRouter();

  const [allPublications, setAllPublications] = useState<Publication[]>([]);
  const [counts, setCounts] = useState<Counts>({
    thesis: 0, dissertation: 0,
    engineering: 0, medicine_health_sciences: 0, arts_humanities: 0,
    natural_sciences: 0, social_sciences: 0, business_economics: 0,
    computer_science_it: 0, education: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [degreeFilter, setDegreeFilter] = useState<'all' | 'thesis' | 'dissertation'>('all');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // ── List view controls (results-per-page / sort / pagination / expand) ──
  const resultsPerPage = 10; // fixed – always 10 theses per page
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const settingsRef = useRef<HTMLDivElement | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_QUICK_RESULTS = 6;

  // ── Read logged-in user from localStorage on mount ──
  useEffect(() => {
    const storedUserStr = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    const user = safeParseUser(storedUserStr);
    setAuthUser(user && storedToken ? user : null);
  }, []);

  // ── Close the settings dropdown on outside click ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── API URL builder (field/degree only — search is client-side) ──
  const buildApiUrl = useCallback((): string => {
    const params = new URLSearchParams();
    if (degreeFilter !== 'all') params.append('degree_type', degreeFilter);
    if (selectedField && FIELD_KEYWORDS[selectedField]) {
      params.append('field_keywords', FIELD_KEYWORDS[selectedField].join(','));
    }
    const base = getApiUrl('/api/innovations/public-list/');
    return params.toString() ? `${base}?${params.toString()}` : base;
  }, [degreeFilter, selectedField]);

  // ── Fetch publications ──
  const fetchPublications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(buildApiUrl(), { cache: 'no-store' });
      if (res.ok) {
        const data: Publication[] = await res.json();
        setAllPublications(data.filter((p) => p.status === 'approved'));
      }
    } catch (err) {
      console.error('Fetch publications error:', err);
      setAllPublications([]);
    } finally {
      setIsLoading(false);
    }
  }, [buildApiUrl]);

  // ── Fetch counts ──
  const fetchCounts = useCallback(async () => {
    let url = getApiUrl('/api/innovations/public-counts/');
    if (degreeFilter !== 'all') url += `?degree_type=${degreeFilter}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data: Partial<Counts> = await res.json();
        setCounts((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Fetch counts error:', err);
    }
  }, [degreeFilter]);

  useEffect(() => { fetchPublications(); }, [fetchPublications]);
  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  // Reset to page 1 whenever the underlying result set changes
  useEffect(() => {
    setCurrentPage(1);
  }, [degreeFilter, selectedField, resultsPerPage, sortOrder]);

  // Cleanup debounce on unmount
  useEffect(() => () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
  }, []);

  // ── Instant client-side search ──
  const searchResults = useMemo(() => {
    const q = inputValue.trim();
    if (q.length < 2) return [];
    return allPublications.filter((pub) => matchesSearch(pub, q));
  }, [inputValue, allPublications]);

  const isSearching = inputValue.trim().length > 1;

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    setShowSearchResults(value.trim().length > 1);
  };

  const clearSearch = () => {
    setInputValue('');
    setShowSearchResults(false);
  };

  // ── Sort + paginate the currently-filtered publications for the list view ──
  const sortedPublications = useMemo(() => {
    const sorted = [...allPublications].sort((a, b) =>
      (a.title || '').localeCompare(b.title || '')
    );
    return sortOrder === 'desc' ? sorted.reverse() : sorted;
  }, [allPublications, sortOrder]);
  

  const totalResults = sortedPublications.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage));
  const pageStartIndex = (currentPage - 1) * resultsPerPage;
  const pagePublications = sortedPublications.slice(pageStartIndex, pageStartIndex + resultsPerPage);
  const rangeStart = totalResults === 0 ? 0 : pageStartIndex + 1;
  const rangeEnd = Math.min(pageStartIndex + resultsPerPage, totalResults);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Submit a rating for a publication ──
  // Expects the backend endpoint (NestJS `addRating`) to be mounted at
  // POST /api/innovations/:id/rate/  with body { rating: number } and to
  // return { success: boolean, average: number }.
  // Adjust the path below if your real route differs.
  const handleRate = useCallback(async (id: number, rating: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(getApiUrl(`/api/innovations/${id}/rate/`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) throw new Error('Rating request failed');
      const data: { success: boolean; average: number } = await res.json();

      // Update the card in place so the stars/count refresh immediately
      setAllPublications((prev) =>
        prev.map((pub) =>
          pub.id === id
            ? {
                ...pub,
                average_rating: data.average,
                rating_count: (pub.rating_count ?? 0) + 1,
              }
            : pub
        )
      );
    } catch (err) {
      console.error('Rating error:', err);
    }
  }, [router]);

  // Where the floating "Upload Book" button should go
  const uploadDestination = getUploadDestination(authUser);

  // Total count for the "All" pill. When a degree filter is active the backend
  // recomputes thesis/dissertation counts scoped to that filter, so summing
  // them always reflects what's currently loaded.
  const totalDegreeCount = counts.thesis + counts.dissertation;

  const DEGREE_TABS: { key: 'all' | 'thesis' | 'dissertation'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: totalDegreeCount },
    { key: 'thesis', label: 'Theses', count: counts.thesis },
    { key: 'dissertation', label: 'FYP', count: counts.dissertation },
  ];

  const degreeTabStyles: Record<'all' | 'thesis' | 'dissertation', { active: string; inactive: string }> = {
    all: {
      active: 'bg-[#050A14] text-[#FFD700] border-2 border-[#050A14] shadow-lg scale-105',
      inactive: 'bg-white text-gray-500 border-2 border-gray-300 hover:border-gray-400',
    },
    thesis: {
      active: 'bg-blue-600 text-white border-2 border-blue-600 shadow-lg scale-105',
      inactive: 'bg-white text-blue-600 border-2 border-blue-300 hover:border-blue-500',
    },
    dissertation: {
      active: 'bg-purple-600 text-white border-2 border-purple-600 shadow-lg scale-105',
      inactive: 'bg-white text-purple-600 border-2 border-purple-300 hover:border-purple-500',
    },
  };

  // ──────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#E0F2FE] text-gray-900 relative overflow-x-hidden">

      {/* Hero */}
      <section className="relative -mt-28 pt-36 pb-6 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Explore theses and Final Year Projects (FYP) from Rwandan-based Universities and
            Rwandans who studied in foreign universities
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="pt-2 pb-10 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Search bar */}
          <div className="relative flex justify-center mb-6 z-30">
            <div className="w-full max-w-2xl relative">
              <input
                type="text"
                placeholder="Search by title, author, supervisor, university, field..."
                value={inputValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => { if (inputValue.trim().length > 1) setShowSearchResults(true); }}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 180)}
                className="w-full pl-14 pr-12 py-5 rounded-full bg-white border-2 border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#FFD700] focus:shadow-xl transition-all text-lg shadow-lg"
              />
              {/* Search icon */}
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#050A14] pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {/* Clear button */}
              {inputValue && (
                <button
                  onClick={clearSearch}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Floating search results panel */}
            {showSearchResults && isSearching && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[70vh] overflow-y-auto z-40">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-10 text-center text-gray-600">
                    No matches found for <strong>{inputValue.trim()}</strong>
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                      <p className="text-sm font-medium text-gray-600">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                        {searchResults.length > MAX_QUICK_RESULTS && ` – showing first ${MAX_QUICK_RESULTS}`}
                      </p>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {searchResults.slice(0, MAX_QUICK_RESULTS).map((pub) => (
                        <MiniPublicationCard
                          key={pub.id}
                          {...pub}
                          onClick={() => {
                            setShowSearchResults(false);
                            router.push(`/books/${pub.id}`);
                          }}
                        />
                      ))}
                    </div>
                    {searchResults.length > MAX_QUICK_RESULTS && (
                      <div className="p-5 text-center border-t border-gray-100">
                        <button
                          onClick={() => setShowSearchResults(false)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          See all {searchResults.length} results ↓
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Degree filter pills — All / Theses / FYP */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-12 flex-wrap">
            {DEGREE_TABS.map((tab) => {
              const isActive = degreeFilter === tab.key;
              const styles = degreeTabStyles[tab.key];
              return (
                <button
                  key={tab.key}
                  onClick={() => setDegreeFilter(tab.key)}
                  className={`px-6 sm:px-7 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all ${
                    isActive ? styles.active : styles.inactive
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              );
            })}
          </div>

          {/* Field filters + publications list (hidden while search dropdown is open) */}
          {!showSearchResults && (
            <>
              {/* Field filter buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
                {CORE_FIELDS.map((field) => {
                  const key = FIELD_TO_KEY[field];
                  const count = counts[key] ?? 0;
                  const isActive = selectedField === field;
                  const isEmpty = count === 0;

                  return (
                    <button
                      key={field}
                      onClick={() => setSelectedField((prev) => prev === field ? null : field)}
                      disabled={isEmpty}
                      className={[
                        'py-5 px-3 rounded-2xl font-bold text-xs transition-all shadow-xl',
                        'flex flex-col items-center justify-center gap-1 min-h-[80px]',
                        isActive
                          ? 'bg-[#050A14] text-[#FFD700] scale-105 shadow-2xl'
                          : isEmpty
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                          : 'bg-white text-[#050A14] border-4 border-gray-300 hover:border-[#FFD700] hover:scale-105',
                      ].join(' ')}
                    >
                      <span
                        style={{
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                          lineHeight: '1.35',
                          display: 'block',
                          width: '100%',
                        }}
                      >
                        {field}
                      </span>
                      <span className="text-[11px] opacity-70 mt-1">{count} items</span>
                    </button>
                  );
                })}
              </div>

              {/* Results toolbar — back link, "Now showing", settings gear */}
              

              {/* Publications list */}
{isLoading ? (
  <div className="text-center py-32">
    <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-[#FFD700] border-t-transparent" />
    <p className="mt-6 text-xl text-[#050A14] font-medium">Loading publications...</p>
  </div>
) : allPublications.length === 0 ? (
  <div className="text-center py-32 bg-white/90 rounded-3xl shadow-2xl">
    <p className="text-3xl font-bold text-gray-600">No publications found</p>
    <p className="text-gray-500 mt-4">Try adjusting your filters.</p>
  </div>
) : (
  <div className="bg-white rounded-2xl shadow-lg px-5 sm:px-8">
    {pagePublications.map((pub) => (
      <PublicationListItem
        key={pub.id}
        {...pub}
        expanded={expandedIds.has(pub.id)}
        onToggleExpand={() => toggleExpand(pub.id)}
        onRate={handleRate}
      />
    ))}
  </div>
)}

              {/* Pagination – below the list, 10 items per page */}
{!isLoading && totalPages > 1 && (
  <div className="flex items-center justify-center gap-1.5 mt-8 mb-6">
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

      {/* Upload FAB — sends logged-in users to their dashboard, others to login */}
      <Link
        href={uploadDestination}
        className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 flex items-center gap-2 sm:gap-3 bg-[#FFD700] text-[#050A14] px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl hover:scale-110 transition-all font-bold text-xs sm:text-sm uppercase"
      >
        Upload Book
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>

      {/* Footer */}
      <footer className="bg-[#0c1e30] text-white pt-14 pb-8 px-4 sm:px-8">
              <div className="max-w-6xl mx-auto">
      
                {/* Top grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
      
                  {/* Brand col */}
                  <div className="lg:col-span-1">
                    <p
                      className="font-bold uppercase text-white mb-1"
                      style={{ fontFamily: "'Bell MT', 'Palatino Linotype', Georgia, serif", fontSize: '38px', letterSpacing: '4px', fontStyle: 'italic', lineHeight: 1 }}
                    >
                      RIRI
                    </p>
                    <p className="text-[#FFD700] text-[9px] uppercase tracking-widest mb-4">Discover · Innovate · Inspire</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Rwanda's premier platform connecting researchers, innovators, and knowledge seekers.
                    </p>
                  </div>
      
                  {/* Quick links */}
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
      
                  {/* Contact */}
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
      
                  {/* Social */}
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
      
                {/* Bottom bar */}
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