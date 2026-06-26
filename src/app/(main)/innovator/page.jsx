'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getApiUrl } from '@/utils/api';

const TABS = { INNOVATIONS: 'innovations', EVENTS: 'events' };

export default function InnovationDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(TABS.INNOVATIONS);
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);

  // ── Innovations ───────────────────────────────────────────────────────────
  const [innovations, setInnovations]               = useState([]);
  const [showInnovationForm, setShowInnovationForm] = useState(false);
  const [uploadingInnovation, setUploadingInnovation] = useState(false);
  const [innovationForm, setInnovationForm]         = useState({
    name: '', description: '', photo: null, sponsorship_needed: 'no-need',
  });
  const [innovationPhotoPreview, setInnovationPhotoPreview] = useState(null);

  // ── Edit Innovation ────────────────────────────────────────────────────────
  const [showEditInnovation, setShowEditInnovation] = useState(false);
  const [editingInnovation, setEditingInnovation] = useState(null);
  const [editInnovationForm, setEditInnovationForm] = useState({
    name: '', description: '', photo: null, sponsorship_needed: 'no-need',
  });
  const [editInnovationPhotoPreview, setEditInnovationPhotoPreview] = useState(null);

  // ── Delete Confirmation ────────────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingInnovationId, setDeletingInnovationId] = useState(null);
  const [isDeletingInnovation, setIsDeletingInnovation] = useState(false);

  // ── Events ────────────────────────────────────────────────────────────────
  const [events, setEvents]               = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [eventForm, setEventForm]         = useState({
    title: '', description: '', date: '', location: '',
    link: '', photo: null, icon: 'Calendar',
  });
  const [eventPhotoPreview, setEventPhotoPreview] = useState(null);

  // ── Auth helper ───────────────────────────────────────────────────────────
  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const [userRes, invRes, evtRes] = await Promise.all([
        fetch(getApiUrl('/api/me/'),             { headers: authHeaders() }),
        fetch(getApiUrl('/api/my-innovations/'), { headers: authHeaders() }),
        fetch(getApiUrl('/api/my-events/'),      { headers: authHeaders() }),
      ]);
      if (!userRes.ok) throw new Error('Unauthorized');
      const [userData, invData, evtData] = await Promise.all([
        userRes.json(), invRes.json(), evtRes.json(),
      ]);
      setUser(userData);
      setInnovations(invData);
      setEvents(evtData);
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ══════════════════════════════════════════════════════════════════════════
  // INNOVATION handlers
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
    e.preventDefault();
    setUploadingInnovation(true);
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
      } else {
        alert('Error: ' + JSON.stringify(await res.json()));
      }
    } catch { alert('Network error'); }
    finally { setUploadingInnovation(false); }
  };

  // ── EDIT INNOVATION ──
  const openEditInnovation = (inv) => {
    setEditingInnovation(inv);
    setEditInnovationForm({
      name: inv.name || '',
      description: inv.description || '',
      photo: null,
      sponsorship_needed: inv.sponsorship_needed || 'no-need',
    });
    setEditInnovationPhotoPreview(inv.photo ? getApiUrl(inv.photo) : null);
    setShowEditInnovation(true);
  };

  const handleEditInnovationInput = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const f = files[0];
      setEditInnovationForm(p => ({ ...p, photo: f }));
      setEditInnovationPhotoPreview(f ? URL.createObjectURL(f) : null);
    } else {
      setEditInnovationForm(p => ({ ...p, [name]: value }));
    }
  };

  const handleSubmitEditInnovation = async (e) => {
    e.preventDefault();
    if (!editingInnovation) return;

    setUploadingInnovation(true);
    const data = new FormData();
    data.append('name', editInnovationForm.name);
    data.append('description', editInnovationForm.description);
    data.append('sponsorship_needed', editInnovationForm.sponsorship_needed);
    if (editInnovationForm.photo) data.append('photo', editInnovationForm.photo);

    try {
      const res = await fetch(getApiUrl(`/api/innovations/${editingInnovation.id}`), {
        method: 'PATCH', headers: authHeaders(), body: data,
      });
      if (res.ok) {
        const updatedInv = await res.json();
        setInnovations(p => p.map(inv => inv.id === updatedInv.id ? updatedInv : inv));
        setShowEditInnovation(false);
        setEditingInnovation(null);
        alert('Innovation updated successfully!');
      } else {
        alert('Error: ' + JSON.stringify(await res.json()));
      }
    } catch {
      alert('Network error');
    } finally {
      setUploadingInnovation(false);
    }
  };

  // ── DELETE INNOVATION ──
  const openDeleteConfirm = (inv) => {
    setDeletingInnovationId(inv.id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteInnovation = async () => {
    if (!deletingInnovationId) return;

    setIsDeletingInnovation(true);
    try {
      const res = await fetch(getApiUrl(`/api/innovations/${deletingInnovationId}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (res.ok) {
        setInnovations(p => p.filter(inv => inv.id !== deletingInnovationId));
        setShowDeleteConfirm(false);
        setDeletingInnovationId(null);
        alert('Innovation deleted successfully!');
      } else {
        alert('Error deleting innovation');
      }
    } catch {
      alert('Network error');
    } finally {
      setIsDeletingInnovation(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT handlers
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
    e.preventDefault();
    setUploadingEvent(true);
    const data = new FormData();
    data.append('title',       eventForm.title);
    data.append('description', eventForm.description);
    data.append('date',        eventForm.date);
    data.append('location',    eventForm.location);
    data.append('link',        eventForm.link);
    data.append('icon',        eventForm.icon);
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
      } else {
        alert('Error: ' + JSON.stringify(await res.json()));
      }
    } catch { alert('Network error'); }
    finally { setUploadingEvent(false); }
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
  // TABS CONFIG
  // ══════════════════════════════════════════════════════════════════════════
  const tabs = [
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
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow"></div>
            <span className="text-lg font-bold text-slate-800 hidden sm:block">Innovation Hub</span>
          </div>
          <div className="bg-purple-50 text-purple-700 px-5 py-2 rounded-full font-medium border border-purple-200 shadow-sm text-sm">
            {user?.user?.username}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ── Left sidebar: tab nav ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 space-y-2 sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-3">My Work</p>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full py-3 px-4 text-left font-semibold border rounded-lg transition-all flex items-center gap-3 text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50 hover:border-purple-200'
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
        </div>

        {/* ── Main content ── */}
        <div className="lg:col-span-3 space-y-6">

          {/* ══ INNOVATIONS TAB ══ */}
          {activeTab === TABS.INNOVATIONS && (
            <>
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">Share Your Innovation</h3>
                <p className="text-purple-800 text-sm leading-relaxed">Submit ideas, prototypes, or projects to inspire and attract support.</p>
              </div>

              <button
                onClick={() => setShowInnovationForm(!showInnovationForm)}
                className={`w-full font-bold text-lg py-5 rounded-2xl shadow-xl transition flex items-center justify-center gap-3 ${
                  showInnovationForm
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                }`}
              >
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
                      className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-purple-500" />
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
                  <p className="text-center text-slate-500 py-12 text-lg">No innovations submitted yet. Share your first idea!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {innovations.map(inv => {
                      const status = String(inv.status || 'pending');
                      const sponsorLabel = inv.sponsorship_needed === 'sponsored' ? 'Sponsored'
                        : inv.sponsorship_needed === 'unsponsored' ? 'Seeking Sponsor' : 'No Need';
                      const sponsorColor = inv.sponsorship_needed === 'sponsored' ? 'bg-emerald-600'
                        : inv.sponsorship_needed === 'unsponsored' ? 'bg-orange-600' : 'bg-slate-600';
                      return (
                        <div key={inv.id} className="border-2 border-purple-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition relative bg-white">
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
                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => openEditInnovation(inv)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition text-sm"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => openDeleteConfirm(inv)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition text-sm"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ══ EVENTS TAB ══ */}
          {activeTab === TABS.EVENTS && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-amber-900 mb-2">Create Amazing Events</h3>
                <p className="text-amber-800 text-sm leading-relaxed">Workshops, conferences, meetups, webinars — share them with the community!</p>
              </div>

              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className={`w-full font-bold text-lg py-5 rounded-2xl shadow-xl transition flex items-center justify-center gap-3 ${
                  showEventForm
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
              >
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
                      const statusLabel = evt.status_display ||
                        (status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending');
                      return (
                        <div key={evt.id} className="border-2 border-blue-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition relative bg-white">
                          {evt.photo
                            ? <img src={getApiUrl(evt.photo)} alt={evt.title} className="w-full h-44 object-cover" />
                            : <div className="bg-gradient-to-br from-blue-400 to-indigo-500 h-44 flex items-center justify-center text-5xl text-white">📅</div>
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
            </>
          )}

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* EDIT INNOVATION MODAL */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {showEditInnovation && editingInnovation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Edit Innovation</h3>
            <form onSubmit={handleSubmitEditInnovation} className="space-y-6">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center">
                <p className="text-sm text-purple-600">Editing</p>
                <p className="text-xl font-bold text-purple-900 line-clamp-2">{editingInnovation.name}</p>
              </div>

              {editInnovationPhotoPreview && (
                <div className="flex justify-center">
                  <img src={editInnovationPhotoPreview} alt="Preview" className="w-full max-w-sm h-48 object-cover rounded-xl shadow-lg" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Innovation Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editInnovationForm.name}
                  onChange={handleEditInnovationInput}
                  required
                  className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={editInnovationForm.description}
                  onChange={handleEditInnovationInput}
                  required
                  rows={5}
                  className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Sponsorship Needed *</label>
                  <select
                    name="sponsorship_needed"
                    value={editInnovationForm.sponsorship_needed}
                    onChange={handleEditInnovationInput}
                    className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-purple-500"
                  >
                    <option value="no-need">No Need</option>
                    <option value="unsponsored">Seeking Sponsor</option>
                    <option value="sponsored">Already Sponsored</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Photo (optional)</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleEditInnovationInput}
                    className="w-full p-3 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50 file:bg-purple-600 file:text-white file:py-2 file:px-6 file:rounded-lg file:border-0"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={uploadingInnovation}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl transition"
                >
                  {uploadingInnovation ? 'Updating…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditInnovation(false);
                    setEditingInnovation(null);
                  }}
                  className="flex-1 bg-slate-500 hover:bg-slate-600 text-white font-bold py-4 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Delete Innovation?</h3>
            <p className="text-slate-600 mb-6">This action cannot be undone. Are you sure you want to delete this innovation?</p>

            <div className="flex gap-4">
              <button
                onClick={handleDeleteInnovation}
                disabled={isDeletingInnovation}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition"
              >
                {isDeletingInnovation ? 'Deleting…' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingInnovationId(null);
                }}
                className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}