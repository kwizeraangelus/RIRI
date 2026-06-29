'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getApiUrl } from '@/utils/api';

// ─── Tab IDs ────────────────────────────────────────────────────────────────
const TABS = {
  PUBLICATIONS: 'publications',
  INNOVATIONS:  'innovations',
  EVENTS:       'events',
};

export default function ResearcherDashboard() {
  const router = useRouter();

  // ── Shared ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]       = useState(TABS.PUBLICATIONS);
  const [user, setUser]                 = useState(null);
  const [loading, setLoading]           = useState(true);

  // ── Publications ──────────────────────────────────────────────────────────
  const [publications, setPublications] = useState([]);
  const [showAddPublication, setShowAddPublication] = useState(false);
  const [showAbstractField, setShowAbstractField] = useState(false);
  const [openAbstractId, setOpenAbstractId] = useState(null); // NEW: track which abstract is open
  const [publicationForm, setPublicationForm] = useState({
    title: '', authors: [''], journal_name: '', conference_info: '',
    doi: '', display_doi: '', url: '', publisher: '',
    book_title: '', patent_title: '', Conference_title: '',
    symposium_title: '', publication_type: 'journal',
    abstract: '',
  });

  // ── Innovations ───────────────────────────────────────────────────────────
  const [innovations, setInnovations]         = useState([]);
  const [showInnovationForm, setShowInnovationForm] = useState(false);
  const [uploadingInnovation, setUploadingInnovation] = useState(false);
  const [innovationForm, setInnovationForm]   = useState({
    name: '', description: '', photo: null, sponsorship_needed: 'no-need',
  });
  const [innovationPhotoPreview, setInnovationPhotoPreview] = useState(null);

  // ── Events ────────────────────────────────────────────────────────────────
  const [events, setEvents]               = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [eventForm, setEventForm]         = useState({
    title: '', description: '', date: '', location: '',
    link: '', photo: null, icon: 'Calendar',
  });
  const [eventPhotoPreview, setEventPhotoPreview] = useState(null);

  // ── Profile edit ──────────────────────────────────────────────────────────
  const [isEditing, setIsEditing]     = useState(false);
  const [bio, setBio]                 = useState('');
  const [platformId, setPlatformId]   = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [qualification, setQualification] = useState('');
  const [Field, setField]             = useState('');
  const [Position, setPosition]       = useState('');
  const [ResearchArea, setResearchArea] = useState('');

  // ── Fetch everything on mount ─────────────────────────────────────────────
  useEffect(() => { fetchAll(); }, []);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchAll = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const [userRes, pubRes, invRes, evtRes] = await Promise.all([
        fetch(getApiUrl('/api/me/'),               { headers: authHeaders() }),
        fetch(getApiUrl('/api/my-researches/'),    { headers: authHeaders() }),
        fetch(getApiUrl('/api/my-innovations/'),   { headers: authHeaders() }),
        fetch(getApiUrl('/api/my-events/'),        { headers: authHeaders() }),
      ]);
      if (!userRes.ok) throw new Error('Unauthorized');
      const [userData, pubData, invData, evtData] = await Promise.all([
        userRes.json(), pubRes.json(), invRes.json(), evtRes.json(),
      ]);
      setUser(userData);
      setPublications(pubData);
      setInnovations(invData);
      setEvents(evtData);
    } catch (err) {
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // PUBLICATION helpers
  // ══════════════════════════════════════════════════════════════════════════
  const handleAuthorChange = (i, v) => {
    const a = [...publicationForm.authors]; a[i] = v;
    setPublicationForm(p => ({ ...p, authors: a }));
  };
  const addAuthorField    = () => setPublicationForm(p => ({ ...p, authors: [...p.authors, ''] }));
  const removeAuthorField = (i) => {
    if (publicationForm.authors.length > 1)
      setPublicationForm(p => ({ ...p, authors: p.authors.filter((_, idx) => idx !== i) }));
  };
  const handlePubInput = (e) => {
    const { name, value } = e.target;
    setPublicationForm(p => ({ ...p, [name]: value }));
  };
  const resetPubForm = () => {
    setPublicationForm({
      title: '', authors: [''], journal_name: '', conference_info: '',
      doi: '', display_doi: '', url: '', publisher: '',
      book_title: '', patent_title: '', Conference_title: '',
      symposium_title: '', publication_type: 'journal',
      abstract: '',
    });
    setShowAbstractField(false);
  };
  const handleSubmitPublication = async (e) => {
    e.preventDefault();
    const body = { ...publicationForm, authors: publicationForm.authors.filter(a => a.trim()) };
    try {
      const res = await fetch(getApiUrl('/api/researches/'), {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const newPub = await res.json();
        setPublications(p => [newPub, ...p]);
        setShowAddPublication(false); resetPubForm();
        alert('Publication added!');
      } else { alert('Error: ' + JSON.stringify(await res.json())); }
    } catch { alert('Network error'); }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // INNOVATION helpers
  // ══════════════════════════════════════════════════════════════════════════
  const handleInnovationInput = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const f = files[0];
      setInnovationForm(p => ({ ...p, photo: f }));
      setInnovationPhotoPreview(f ? URL.createObjectURL(f) : null);
    } else {
      setInnovationForm(p => ({ ...p, [name]: value }));
    }
  };
  const handleSubmitInnovation = async (e) => {
    e.preventDefault(); setUploadingInnovation(true);
    const data = new FormData();
    Object.keys(innovationForm).forEach(k => {
      if (innovationForm[k] !== null && innovationForm[k] !== '') data.append(k, innovationForm[k]);
    });
    try {
      const res = await fetch(getApiUrl('/api/innovations/create/'), {
        method: 'POST', headers: authHeaders(), body: data,
      });
      if (res.ok) {
        const newInv = await res.json();
        setInnovations(p => [newInv, ...p]);
        setShowInnovationForm(false);
        setInnovationForm({ name: '', description: '', photo: null, sponsorship_needed: 'no-need' });
        setInnovationPhotoPreview(null);
        alert('Innovation submitted!');
      } else { alert('Error: ' + JSON.stringify(await res.json())); }
    } catch { alert('Network error'); }
    finally { setUploadingInnovation(false); }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT helpers
  // ══════════════════════════════════════════════════════════════════════════
  const handleEventInput = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const f = files[0];
      setEventForm(p => ({ ...p, photo: f }));
      setEventPhotoPreview(f ? URL.createObjectURL(f) : null);
    } else {
      setEventForm(p => ({ ...p, [name]: value }));
    }
  };
  const handleSubmitEvent = async (e) => {
    e.preventDefault(); setUploadingEvent(true);
    const data = new FormData();
    data.append('title', eventForm.title);
    data.append('description', eventForm.description);
    data.append('date', eventForm.date);
    data.append('location', eventForm.location);
    data.append('link', eventForm.link);
    data.append('icon', eventForm.icon);
    if (eventForm.photo) data.append('photo', eventForm.photo);
    try {
      const res = await fetch(getApiUrl('/api/events/create/'), {
        method: 'POST', headers: authHeaders(), body: data,
      });
      if (res.ok) {
        const newEvt = await res.json();
        setEvents(p => [newEvt, ...p]);
        setShowEventForm(false);
        setEventForm({ title: '', description: '', date: '', location: '', link: '', photo: null, icon: 'Calendar' });
        setEventPhotoPreview(null);
        alert('Event created!');
      } else { alert('Error: ' + JSON.stringify(await res.json())); }
    } catch { alert('Network error'); }
    finally { setUploadingEvent(false); }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // PROFILE helpers
  // ══════════════════════════════════════════════════════════════════════════
  const openEdit = () => {
    setBio(user?.bio || ''); setPlatformId(user?.orcid || '');
    setQualification(user?.qualification || ''); setField(user?.Field || '');
    setPosition(user?.Position || ''); setResearchArea(user?.ResearchArea || '');
    setIsEditing(true);
  };
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bio', bio || '');
    formData.append('platformId', platformId || '');
    formData.append('qualification', qualification || '');
    formData.append('Field', Field || '');
    formData.append('Position', Position || '');
    formData.append('ResearchArea', ResearchArea || '');
    if (profileImage) formData.append('profile_image', profileImage);
    try {
      const res = await fetch(getApiUrl('/api/update-profile'), {
        method: 'PATCH', headers: authHeaders(), body: formData,
      });
      if (res.ok) {
        setUser(await res.json()); setIsEditing(false); setProfileImage(null);
        alert('Profile updated!');
      } else { alert('Update failed: ' + JSON.stringify(await res.json())); }
    } catch { alert('Network error'); }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // LOADING
  // ══════════════════════════════════════════════════════════════════════════
  if (loading) return (
    <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center">
      <div className="text-3xl font-light text-slate-600 animate-pulse">Loading…</div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // TAB NAV CONFIG
  // ══════════════════════════════════════════════════════════════════════════
  const tabs = [
    {
      id: TABS.PUBLICATIONS,
      label: 'Publications',
      count: publications.length,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      ),
    },
    {
      id: TABS.INNOVATIONS,
      label: 'Innovations',
      count: innovations.length,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      ),
    },
    {
      id: TABS.EVENTS,
      label: 'Events',
      count: events.length,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      ),
    },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#E0F2FE]">

      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow"></div>
            <span className="text-lg font-bold text-slate-800 hidden sm:block">Research Portal</span>
          </div>
          <div className="bg-blue-50 text-blue-700 px-5 py-2 rounded-full font-medium border border-blue-200 shadow-sm text-sm">
            {user?.user?.username}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ════ LEFT SIDEBAR: Tab Nav + Profile ════ */}
        <div className="space-y-6">

          {/* Tab navigation */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-3">My Work</p>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full py-3 px-4 text-left font-semibold border rounded-lg transition-all flex items-center gap-3 text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {tab.icon}
                </svg>
                <span className="flex-1">{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            {!isEditing ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Profile</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Researcher information</p>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                      {user?.profile_image
                        ? <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-3xl text-slate-400">👤</div>
                      }
                    </div>
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Bio</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{user?.bio || 'No bio added yet.'}</p>
                  </div>
                  {(user?.qualification || user?.Position || user?.ResearchArea) && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-1 text-sm">
                      {user?.qualification && <div><span className="text-slate-500">Qualification: </span><span className="font-medium text-slate-700">{user.qualification}</span></div>}
                      {user?.Position      && <div><span className="text-slate-500">Position: </span><span className="font-medium text-slate-700">{user.Position}</span></div>}
                      {user?.ResearchArea  && <div><span className="text-slate-500">Research Area: </span><span className="font-medium text-slate-700">{user.ResearchArea}</span></div>}
                    </div>
                  )}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">ORCID</p>
                    <p className="font-mono text-blue-600 text-sm">{user?.orcid || 'Not set'}</p>
                  </div>
                </div>
                <button onClick={openEdit}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md text-sm">
                  Edit Profile
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-5">Edit Profile</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <textarea className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none text-sm" placeholder="Bio…" value={bio} onChange={e => setBio(e.target.value)} rows={3} />
                  <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm" placeholder="Qualification" value={qualification} onChange={e => setQualification(e.target.value)} />
                  <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm" placeholder="Research Area" value={ResearchArea} onChange={e => setResearchArea(e.target.value)} />
                  <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm" placeholder="Position" value={Position} onChange={e => setPosition(e.target.value)} />
                  <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm" placeholder="Field" value={Field} onChange={e => setField(e.target.value)} />
                  <div className="border-2 border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition">
                    <label className="cursor-pointer flex items-center gap-2 text-sm text-slate-600">
                      <input type="file" className="hidden" onChange={e => setProfileImage(e.target.files[0])} accept="image/*" />
                      <span className="text-xl">📷</span>
                      {profileImage ? <span className="text-green-600 font-medium">✓ Selected</span> : 'Upload photo'}
                    </label>
                  </div>
                  <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm" placeholder="ORCID / Platform ID" value={platformId} onChange={e => setPlatformId(e.target.value)} />
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md text-sm">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-300 transition text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ════ MAIN CONTENT (2 cols) ════ */}
        <div className="lg:col-span-2 space-y-8">

          {/* ══ PUBLICATIONS TAB ══ */}
          {activeTab === TABS.PUBLICATIONS && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Publications</h2>
                    <p className="text-sm text-slate-500 mt-1">Your research contributions</p>
                  </div>
                  <button onClick={() => setShowAddPublication(!showAddPublication)}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md ${
                      showAddPublication
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    }`}>
                    {showAddPublication ? 'Cancel' : '+ Add Publication'}
                  </button>
                </div>

                <div className="space-y-5">
                  {publications.length === 0 ? (
                    <div className="text-center py-14 px-4">
                      <div className="text-5xl mb-3">📚</div>
                      <p className="text-slate-500">No publications yet.</p>
                      <p className="text-slate-400 text-sm mt-1">Add your first publication to get started!</p>
                    </div>
                  ) : publications.map((pub, idx) => (
                    <div key={pub.id} className="group border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white hover:border-blue-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">{idx + 1}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{pub.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">
                            <span className="font-medium text-slate-700">Authors:</span>{' '}
                            {Array.isArray(pub.authors) ? pub.authors.join(' • ') : pub.authors}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2 text-sm">
                            {pub.journal_name    && <span className="px-2.5 py-1 bg-slate-100 rounded-full text-slate-700 text-xs">📔 {pub.journal_name}</span>}
                            {pub.conference_info && <span className="px-2.5 py-1 bg-purple-100 rounded-full text-purple-700 text-xs">🎤 {pub.conference_info}</span>}
                            {pub.publisher       && <span className="px-2.5 py-1 bg-green-100 rounded-full text-green-700 text-xs">📍 {pub.publisher}</span>}
                          </div>
                          {pub.doi && <p className="mt-2 font-mono text-blue-600 text-xs">DOI: {pub.doi}</p>}

                          <div className="flex gap-2 mt-3">
                            {/* ── Abstract toggle button ── */}
                            {pub.abstract && (
                              <button
                                onClick={() => setOpenAbstractId(openAbstractId === pub.id ? null : pub.id)}
                                className="text-xs px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-gray-700 rounded-md font-medium transition-colors flex items-center gap-1"
                              >
                                📄 Abstract
                                <span className="text-blue-500">{openAbstractId === pub.id ? '▲' : '▼'}</span>
                              </button>
                            )}
                            {(pub.doi || pub.url) && (
                              <a href={pub.url || `https://doi.org/${pub.doi}`} target="_blank"
                                className="text-xs px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md font-medium transition-colors">🌐 HTML</a>
                            )}
                            {pub.pdf_path && (
                              <a href={getApiUrl(pub.pdf_path)} target="_blank"
                                className="text-xs px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md font-medium transition-colors">📑 PDF</a>
                            )}
                          </div>

                          {/* ── Inline abstract paragraph ── */}
                          {openAbstractId === pub.id && pub.abstract && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs font-semibold text-gray-900 mb-1">Abstract</p>
                              <p className="text-xs text-gray-700 leading-relaxed">{pub.abstract}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ============= ADD PUBLICATION FORM ============= */}
              {showAddPublication && (
                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">Add New Publication</h3>
                  <p className="text-sm text-slate-500 mb-7">Fill in the details below</p>
                  <form onSubmit={handleSubmitPublication} className="space-y-6">
                    {/* Type toggle */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Publication Type</label>
                      <div className="flex flex-wrap gap-2">
                        {['journal','book','Conference','symposium','patent'].map(t => (
                          <button key={t} type="button"
                            onClick={() => setPublicationForm(p => ({ ...p, publication_type: t }))}
                            className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all ${
                              publicationForm.publication_type === t
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                      <input type="text" name="title" value={publicationForm.title} onChange={handlePubInput} required
                        className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none" placeholder="Publication title" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Authors</label>
                      <div className="space-y-2">
                        {publicationForm.authors.map((a, i) => (
                          <div key={i} className="flex gap-2">
                            <input type="text" value={a} onChange={e => handleAuthorChange(i, e.target.value)}
                              className="flex-1 p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none" placeholder={`Author ${i + 1}`} />
                            {i === publicationForm.authors.length - 1
                              ? <button type="button" onClick={addAuthorField} className="px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold">+</button>
                              : <button type="button" onClick={() => removeAuthorField(i)} className="px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold">×</button>
                            }
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {publicationForm.publication_type === 'journal' && (
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Journal Name</label>
                          <input type="text" name="journal_name" value={publicationForm.journal_name} onChange={handlePubInput}
                            className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none" placeholder="Journal name" />
                        </div>
                      )}
                      {['conference_info','publisher','doi','display_doi','url'].map(field => (
                        <div key={field}>
                          <label className="block text-sm font-semibold text-slate-700 mb-2 capitalize">{field.replace('_',' ')}</label>
                          <input type={field === 'url' ? 'url' : 'text'} name={field} value={publicationForm[field]} onChange={handlePubInput}
                            className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            placeholder={field === 'doi' ? '10.xxxx/xxxxx' : field === 'url' ? 'https://…' : ''} />
                        </div>
                      ))}
                    </div>

                    {/* ============= ABSTRACT TOGGLE BUTTON ============= */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowAbstractField(!showAbstractField)}
                        className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-between ${
                          showAbstractField
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{showAbstractField ? '▼' : '▶'}</span>
                          Add Abstract
                        </span>
                        {publicationForm.abstract && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold">Added</span>
                        )}
                      </button>
                    </div>

                    {/* ============= ABSTRACT FIELD (COLLAPSIBLE) ============= */}
                    {showAbstractField && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Abstract</label>
                        <textarea
                          name="abstract"
                          value={publicationForm.abstract}
                          onChange={handlePubInput}
                          placeholder="Write a brief summary of your publication…"
                          rows={5}
                          className="w-full p-4 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:shadow-lg focus:ring-2 focus:ring-blue-200 outline-none resize-none transition-all text-sm"
                        />
                        <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                          <span>💡</span> Help readers understand your research at a glance
                        </p>
                        <div className="text-xs text-slate-500 mt-2 text-right">
                          {publicationForm.abstract.length} characters
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-2">
                      <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md transition hover:from-blue-700 hover:to-indigo-700">Save Publication</button>
                      <button type="button" onClick={() => setShowAddPublication(false)} className="flex-1 bg-slate-200 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-300 transition">Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ══ INNOVATIONS TAB ══ */}
          {activeTab === TABS.INNOVATIONS && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">Share Your Innovation</h3>
                <p className="text-purple-800 text-sm leading-relaxed">Submit ideas, prototypes, or projects to inspire and attract support.</p>
              </div>

              <button onClick={() => setShowInnovationForm(!showInnovationForm)}
                className={`w-full font-bold text-lg py-5 rounded-2xl shadow-xl transition flex items-center justify-center gap-3 ${
                  showInnovationForm
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                }`}>
                {showInnovationForm ? 'Cancel' : '💡 Submit New Innovation'}
              </button>

              {showInnovationForm && (
                <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Submit Innovation</h3>
                  {innovationPhotoPreview && (
                    <div className="flex justify-center mb-6">
                      <img src={innovationPhotoPreview} alt="Preview" className="w-full max-w-lg h-56 object-cover rounded-xl shadow-lg" />
                    </div>
                  )}
                  <form onSubmit={handleSubmitInnovation} className="space-y-5">
                    <input name="name" placeholder="Name of Innovation *" value={innovationForm.name} onChange={handleInnovationInput} required
                      className="w-full p-4 border border-slate-300 rounded-xl outline-none focus:border-purple-500 border-2" />
                    <textarea name="description" placeholder="Detailed Description *" rows={5} value={innovationForm.description} onChange={handleInnovationInput} required
                      className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-purple-500 resize-none" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Sponsorship Needed?</label>
                        <select name="sponsorship_needed" value={innovationForm.sponsorship_needed} onChange={handleInnovationInput}
                          className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-purple-500">
                          <option value="no-need">No Need</option>
                          <option value="unsponsored">Seeking Sponsor</option>
                          <option value="sponsored">Already Sponsored</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Innovation Photo</label>
                        <input type="file" name="photo" accept="image/*" onChange={handleInnovationInput}
                          className="w-full p-3 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50 file:bg-purple-600 file:text-white file:py-2 file:px-6 file:rounded-lg file:border-0" />
                      </div>
                    </div>
                    <button type="submit" disabled={uploadingInnovation}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg disabled:opacity-70 transition">
                      {uploadingInnovation ? 'Submitting…' : 'Submit Innovation'}
                    </button>
                  </form>
                </div>
              )}

              {/* Innovation cards */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">My Innovations</h3>
                {innovations.length === 0 ? (
                  <p className="text-center text-slate-500 py-12 text-lg">No innovations submitted yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {innovations.map(inv => {
                      const status = String(inv.status || 'pending');
                      const sponsorLabel = inv.sponsorship_needed === 'sponsored' ? 'Sponsored'
                        : inv.sponsorship_needed === 'unsponsored' ? 'Seeking Sponsor' : 'No Need';
                      const sponsorColor = inv.sponsorship_needed === 'sponsored' ? 'bg-emerald-600'
                        : inv.sponsorship_needed === 'unsponsored' ? 'bg-orange-600' : 'bg-slate-600';
                      return (
                        <div key={inv.id} className="group border-2 border-purple-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition relative bg-white">
                          {inv.photo
                            ? <img src={getApiUrl(inv.photo)} alt={inv.name} className="w-full h-44 object-cover" />
                            : <div className="bg-gradient-to-br from-purple-400 to-pink-500 h-44 flex items-center justify-center text-5xl">💡</div>
                          }
                          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow ${
                            status === 'approved' ? 'bg-emerald-600' : status === 'rejected' ? 'bg-red-600' : 'bg-amber-600'}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </div>
                          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow ${sponsorColor}`}>
                            {sponsorLabel}
                          </div>
                          <div className="p-5">
                            <h4 className="font-bold text-lg text-slate-800 line-clamp-2">{inv.name}</h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {inv.created_at && !isNaN(new Date(inv.created_at)) ? format(new Date(inv.created_at), 'PPP') : 'Unknown date'}
                            </p>
                            <p className="text-slate-700 mt-2 text-sm line-clamp-3">{inv.description}</p>
                            {inv.feedback && (
                              <div className={`mt-4 p-3 rounded-xl text-xs font-medium border-l-4 ${
                                status === 'rejected' ? 'bg-red-50 border-red-500 text-red-800' : 'bg-amber-50 border-amber-500 text-amber-800'}`}>
                                <p className="font-bold mb-1">{status === 'rejected' ? 'Rejection reason:' : 'Admin note:'}</p>
                                <p className="whitespace-pre-wrap break-words">{inv.feedback}</p>
                              </div>
                            )}
                            {status === 'approved' && !inv.feedback && (
                              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs font-medium">
                                Congratulations! Your innovation is now visible to the public.
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ EVENTS TAB ══ */}
          {activeTab === TABS.EVENTS && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-amber-900 mb-2">Create Amazing Events</h3>
                <p className="text-amber-800 text-sm leading-relaxed">Workshops, conferences, meetups, webinars — share them with the community!</p>
              </div>

              <button onClick={() => setShowEventForm(!showEventForm)}
                className={`w-full font-bold text-lg py-5 rounded-2xl shadow-xl transition flex items-center justify-center gap-3 ${
                  showEventForm
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}>
                {showEventForm ? 'Cancel' : '📅 Create New Event'}
              </button>

              {showEventForm && (
                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Create New Event</h3>
                  {eventPhotoPreview && (
                    <div className="flex justify-center mb-6">
                      <img src={eventPhotoPreview} alt="Preview" className="w-full max-w-lg h-56 object-cover rounded-xl shadow-lg" />
                    </div>
                  )}
                  <form onSubmit={handleSubmitEvent} className="space-y-5">
                    <input name="title" placeholder="Event Title *" value={eventForm.title} onChange={handleEventInput} required
                      className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500" />
                    <textarea name="description" placeholder="Description *" rows={4} value={eventForm.description} onChange={handleEventInput} required
                      className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500 resize-none" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date & Time *</label>
                        <input type="datetime-local" name="date" value={eventForm.date} onChange={handleEventInput} required
                          className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                        <input name="location" placeholder="Zoom, Kigali, etc." value={eventForm.location} onChange={handleEventInput} required
                          className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <input name="link" placeholder="Registration Link (optional)" value={eventForm.link} onChange={handleEventInput}
                      className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
                        <select name="icon" value={eventForm.icon} onChange={handleEventInput}
                          className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500">
                          {['Calendar','Laptop','Users','GraduationCap','Presentation'].map(i => <option key={i}>{i}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Event Photo</label>
                        <input type="file" name="photo" accept="image/*" onChange={handleEventInput}
                          className="w-full p-3 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 file:bg-blue-600 file:text-white file:py-2 file:px-5 file:rounded-lg file:border-0" />
                      </div>
                    </div>
                    <button type="submit" disabled={uploadingEvent}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg disabled:opacity-70 transition">
                      {uploadingEvent ? 'Creating…' : 'Publish Event'}
                    </button>
                  </form>
                </div>
              )}

              {/* Event cards */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">My Events</h3>
                {events.length === 0 ? (
                  <p className="text-center text-slate-500 py-12 text-lg">No events yet. Create your first one!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map(evt => {
                      const status = evt.status || 'pending';
                      const statusLabel = evt.status_display || (status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending');
                      return (
                        <div key={evt.id} className="group border-2 border-blue-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition relative bg-white">
                          {evt.photo
                            ? <img src={getApiUrl(evt.photo)} alt={evt.title} className="w-full h-44 object-cover" />
                            : <div className="bg-gradient-to-br from-blue-400 to-indigo-500 h-44 flex items-center justify-center text-5xl text-white">{evt.icon || '📅'}</div>
                          }
                          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow ${
                            status === 'approved' ? 'bg-emerald-600' : status === 'rejected' ? 'bg-red-600' : 'bg-amber-600'}`}>
                            {statusLabel}
                          </div>
                          <div className="p-5">
                            <h4 className="font-bold text-lg text-slate-800 line-clamp-2">{evt.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {evt.date ? format(new Date(evt.date), 'PPP • p') : 'No date'}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">{evt.location || 'No location'}</p>
                            {evt.link && (
                              <a href={evt.link} target="_blank"
                                className="inline-block mt-3 text-xs px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md font-medium transition-colors">
                                🔗 Registration Link
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>{/* end main col */}
      </div>
    </div>
  );
}