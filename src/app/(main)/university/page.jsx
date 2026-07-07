'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getApiUrl } from '@/utils/api';

const ACADEMIC_FIELDS = [
  'Engineering', 'Medicine/Health Sciences', 'Arts & Humanities', 'Natural Sciences', 'Social Sciences',
  'Business & Economics', 'Computer Science/IT', 'Medicine', 'Agriculture', 'Education', 'IOT'
];

export default function UniversityDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // NEW - tracks which upload is currently being deleted
  const [activeTab, setActiveTab] = useState('research'); // 'research' or 'events'

  // Research Upload States
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [degreeType, setDegreeType] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [showOtherField, setShowOtherField] = useState(false);

  // Edit Upload States
  const [showEditUpload, setShowEditUpload] = useState(false);
  const [editingUpload, setEditingUpload] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    authors: '',
    description: '',
    supervisor_name: '',
    year: '',
    file: null
  });

  // Research Form Data
  const [formData, setFormData] = useState({
    submission_type: '',
    university_name: '',
    title: '',
    authors: '',
    year: '',
    description: '',
    file: null,
    supervisor_name: '',
    other_field: ''
  });

  const [existingFileUrl, setExistingFileUrl] = useState(null); // NEW
  const [removeFile, setRemoveFile] = useState(false);

  // Event States
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    link: '',
    photo: null,
    icon: 'Calendar'
  });
  const [eventPhotoPreview, setEventPhotoPreview] = useState(null);

  // Profile Edit
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    profile_image: null,
    age: '',
    phone_number: '',
    location: '',
    university: '',
    details: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [removeProfileImage, setRemoveProfileImage] = useState(false); // NEW

  useEffect(() => {
    fetchUserAndData();
  }, []);

  const fetchUserAndData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const [userRes, uploadsRes, eventsRes] = await Promise.all([
        fetch(getApiUrl('/api/me/'), {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(getApiUrl('/api/my-uploads/'), {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(getApiUrl('/api/my-events/'), {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!userRes.ok) throw new Error('Unauthorized');
      const userData = await userRes.json();
      const uploadsData = await uploadsRes.json();
      const eventsData = eventsRes.ok ? await eventsRes.json() : [];

      setUser(userData);
      setUploads(uploadsData);
      setEvents(eventsData);
    } catch (err) {
      console.error("Auth failed, redirecting...", err);
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // ============= RESEARCH HANDLERS =============
  const handleFieldChange = (value) => {
    setSelectedField(value);
    setShowOtherField(value === 'other');
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
     if (name === 'file' && files) {
    setRemoveFile(false); // NEW
  }
    setEditForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  useEffect(() => {
    if (degreeType && selectedField && selectedField !== 'other') {
      const cleanField = selectedField.toLowerCase().replace(/\s+/g, '_');
      setFormData(prev => ({
        ...prev,
        submission_type: `${degreeType}-${cleanField}`
      }));
    } else if (degreeType && selectedField === 'other' && formData.other_field.trim()) {
      const cleanField = formData.other_field.toLowerCase().replace(/\s+/g, '_');
      setFormData(prev => ({
        ...prev,
        submission_type: `${degreeType}-${cleanField}`
      }));
    }
  }, [degreeType, selectedField, formData.other_field]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.submission_type) {
      alert('Please complete all steps');
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append('submission_type', formData.submission_type);
    data.append('university', formData.university_name);
    data.append('title', formData.title);
    data.append('authors', formData.authors);
    data.append('year', formData.year);
    data.append('description', formData.description);
    data.append('supervisor_name', formData.supervisor_name);
    if (formData.file) data.append('file', formData.file);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(getApiUrl('/api/upload/'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        const newUpload = await res.json();
        setUploads(prev => [newUpload, ...prev]);
        setShowUploadForm(false);
        resetForm();
        alert('Research submitted successfully!');
      } else {
        const err = await res.json();
        alert('Error: ' + JSON.stringify(err));
      }
    } catch {
      alert('Network error');
    } finally {
      setUploading(false);
    }
  };

  const openEditUpload = (upload) => {
    setEditingUpload(upload);
    setEditForm({
      title: upload.title,
      authors: upload.authors,
      description: upload.description,
      supervisor_name: upload.supervisor_name,
      year: upload.year.toString(),
      file: null
    });
    setExistingFileUrl(upload.file_path || upload.file || null); // NEW — adjust field name to match your API
    setRemoveFile(false);
    setShowEditUpload(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUpload) return;

    setUploading(true);
    const data = new FormData();
    data.append('title', editForm.title);
    data.append('authors', editForm.authors);
    data.append('description', editForm.description);
    data.append('supervisor_name', editForm.supervisor_name);
    data.append('year', editForm.year);
    if (editForm.file) data.append('file', editForm.file);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(getApiUrl(`/api/upload/${editingUpload.id}`), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        const updatedUpload = await res.json();
        setUploads(prev => prev.map(u => u.id === updatedUpload.id ? updatedUpload : u));
        setShowEditUpload(false);
        setEditingUpload(null);
        alert('Research updated successfully!');
      } else {
        const err = await res.json();
        alert('Error: ' + JSON.stringify(err));
      }
    } catch {
      alert('Network error');
    } finally {
      setUploading(false);
    }
  };

  // ============= DELETE UPLOAD HANDLER (NEW) =============
  // Hits the same base route as edit (PATCH /api/upload/:id) but with DELETE,
  // matching your NestJS controller's @Delete('upload/:id') under the same
  // prefix as @Patch('upload/:id'). Adjust the path below if your delete
  // route lives under a different prefix.
  const handleDeleteUpload = async (upload) => {
    const confirmed = window.confirm(`Delete "${upload.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(upload.id);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(getApiUrl(`/api/upload/${upload.id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setUploads(prev => prev.filter(u => u.id !== upload.id));
      } else if (res.status === 403) {
        alert('You can only delete your own uploads.');
      } else if (res.status === 404) {
        alert('This upload no longer exists.');
        setUploads(prev => prev.filter(u => u.id !== upload.id));
      } else {
        const err = await res.json().catch(() => ({}));
        alert('Error: ' + JSON.stringify(err));
      }
    } catch {
      alert('Network error');
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setDegreeType('');
    setSelectedField('');
    setShowOtherField(false);
    setFormData({
      submission_type: '', university_name: '', title: '', authors: '',
      year: '', description: '', file: null, supervisor_name: '', other_field: ''
    });
  };

  // ============= EVENT HANDLERS =============
  const handleEventInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const file = files[0];
      setEventFormData(prev => ({ ...prev, photo: file }));
      setEventPhotoPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setEventFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const data = new FormData();
    data.append('title', eventFormData.title);
    data.append('description', eventFormData.description);
    data.append('date', eventFormData.date);
    data.append('location', eventFormData.location);
    data.append('link', eventFormData.link);
    data.append('icon', eventFormData.icon);

    if (eventFormData.photo) {
      data.append('photo', eventFormData.photo);
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(getApiUrl('/api/events/create/'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        const newEvent = await res.json();
        setEvents(prev => [newEvent, ...prev]);
        setShowEventForm(false);
        setEventFormData({ title: '', description: '', date: '', location: '', link: '', photo: null, icon: 'Calendar' });
        setEventPhotoPreview(null);
        alert('Event created successfully!');
      } else {
        const err = await res.json();
        alert('Error: ' + JSON.stringify(err));
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setUploading(false);
    }
  };

  // ============= PROFILE HANDLERS =============
  const openEditProfile = () => {
    setProfileForm({
      profile_image: null,
      age: user?.age || '',
      phone_number: user?.phone_number || '',
      location: user?.location || '',
      university: user?.university || '',
      details: user?.details || '',
    });
    setImagePreview(user?.profile_image || null);
    setRemoveProfileImage(false); // NEW
    setShowEditProfile(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.entries(profileForm).forEach(([k, v]) => {
      if (v !== '' && v !== null) data.append(k, v);
    });
    if (removeProfileImage) {
    data.append('remove_profile_image', 'true'); // NEW
  }

    const res = await fetch(getApiUrl('/api/update/'), {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data,
    });

    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setShowEditProfile(false);
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-amber-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F2FE]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg"></div>
            <h1 className="text-2xl font-bold text-gray-800">University Portal</h1>
          </div>
          <div className="bg-blue-50 text-blue-700 px-5 py-2 rounded-full font-medium">
            {user?.user?.username}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content with Tabs */}
        <div className="lg:col-span-2 space-y-10">
          {/* Tab Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('research')}
              className={`flex-1 py-4 px-6 font-bold rounded-2xl transition ${
                activeTab === 'research'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-800 border-2 border-blue-200 hover:border-blue-600'
              }`}
            >
              🎓 Research
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-4 px-6 font-bold rounded-2xl transition ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-800 border-2 border-blue-200 hover:border-blue-600'
              }`}
            >
              📅 Events
            </button>
          </div>

          {/* ============= RESEARCH TAB ============= */}
          {activeTab === 'research' && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-amber-900 mb-3">Important Guidelines</h3>
                <p className="text-amber-800 leading-relaxed">
                  Submit original work only. Include Abstract, Introduction, Methodology, Results, Conclusion & References. Review within 48 hours.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowUploadForm(!showUploadForm);
                  if (!showUploadForm) resetForm();
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl py-6 rounded-2xl shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <span className="text-3xl">🎓</span> {showUploadForm ? 'Cancel Upload' : 'Upload New Research'}
              </button>

              {showUploadForm && (
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-10">Submit Your Research</h3>

                  {!degreeType && (
                    <div className="text-center mb-12">
                      <p className="text-xl font-semibold text-gray-700 mb-8">What type of academic work are you submitting?</p>
                      <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
                        <button onClick={() => setDegreeType('thesis')} className="py-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-2xl rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition">
                          Thesis
                        </button>
                        <button onClick={() => setDegreeType('dissertation')} className="py-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-2xl rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition">
                          FYP
                        </button>
                      </div>
                    </div>
                  )}

                  {degreeType && !selectedField && (
                    <div className="text-center pb-4">
                      <p className="text-xl font-semibold text-gray-700 mb-8">Select your field of study</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {ACADEMIC_FIELDS.map(field => (
                          <button
                            key={field}
                            onClick={() => handleFieldChange(field.toLowerCase().replace(/\s+/g, '_'))}
                            className="py-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-500 text-blue-800 font-bold rounded-xl transition transform hover:scale-105 shadow-md"
                          >
                            {field}
                          </button>
                        ))}
                        <button
                          onClick={() => handleFieldChange('other')}
                          className="py-6 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 hover:border-gray-500 font-bold rounded-xl transition hover:scale-105"
                        >
                          Other
                        </button>
                      </div>
                    </div>
                  )}

                  {showOtherField && !formData.other_field && (
                    <div className="max-w-md mx-auto mt-8">
                      <input
                        type="text"
                        placeholder="Enter your field (e.g., Psychology)"
                        className="w-full p-5 text-lg border-2 border-blue-300 rounded-xl focus:border-blue-600 outline-none text-gray-900"
                        onChange={(e) => setFormData(prev => ({ ...prev, other_field: e.target.value }))}
                      />
                    </div>
                  )}

                  {formData.submission_type && (
                    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                        <p className="text-sm text-blue-600">Selected Category</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {degreeType.charAt(0).toUpperCase() + degreeType.slice(1)} -{' '}
                          {selectedField === 'other' ? formData.other_field : selectedField.replace(/_/g, ' ')}
                        </p>
                      </div>

                      <input name="university_name" placeholder="University Name " onChange={handleInputChange} required className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
                      <input name="title" placeholder="Title " onChange={handleInputChange} required className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
                      <input name="authors" placeholder="Authors " onChange={handleInputChange} required className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
                      <input name="supervisor_name" placeholder="Supervisor Name *" onChange={handleInputChange} required className="w-full p-4 border border-gray-300 rounded-xl bg-blue-50 text-gray-900" />
                      <input name="year" type="number" placeholder="Year " onChange={handleInputChange} required className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
                      <textarea name="description" placeholder="Brief description / Abstract " rows={4} onChange={handleInputChange} required className="w-full p-4 border border-gray-300 rounded-xl resize-none text-gray-900" />
                      <input type="file" name="file" accept=".pdf,.doc,.docx" onChange={handleInputChange} required className="w-full p-4 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 file:bg-blue-600 file:text-white file:py-3 file:px-8 file:rounded-lg" />

                      <button type="submit" disabled={uploading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 rounded-xl text-lg shadow-lg disabled:opacity-70">
                        {uploading ? 'Submitting...' : 'Submit Research'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-3xl font-bold text-gray-800 text-center mb-10">My Uploads</h3>
                {uploads.length === 0 ? (
                  <p className="text-center text-gray-500 py-16 text-lg">No uploads yet. Start sharing your research!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {uploads.map(upload => (
                      <div key={upload.id} className="transform transition-all hover:scale-105">
                        <div
                          className="rounded-2xl overflow-hidden shadow-xl border-2 bg-gradient-to-br from-blue-50 to-indigo-50 relative cursor-pointer"
                          style={{ borderColor: upload.status === 'approved' ? '#10b981' : upload.status === 'rejected' ? '#ef4444' : '#f59e0b' }}
                          onClick={() => router.push(`/book/${upload.id}`)}
                        >
                          <div className="h-64 flex flex-col items-center justify-center">
                            <span className="text-9xl">🎓</span>
                            <p className="text-2xl font-medium text-gray-600 mt-4">THESIS</p>
                          </div>
                          <div className={`absolute top-4 right-4 px-5 py-2 rounded-full text-sm font-bold text-white shadow-lg ${getStatusBadge(upload.status)}`}>
                            {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-bold text-gray-800 text-lg line-clamp-2 text-center">{upload.title}</h4>
                          <p className="text-gray-600 mt-1 text-center">{upload.year}</p>
                          {upload.supervisor_name && <p className="text-sm text-blue-700 mt-2 text-center">Supervisor: {upload.supervisor_name}</p>}

                          {upload.feedback && (
                            <div className={`mt-4 p-4 rounded-xl text-sm font-medium border-l-4 ${upload.status === 'rejected' ? 'bg-red-50 border-red-500 text-red-800' : 'bg-amber-50 border-amber-500 text-amber-800'}`}>
                              <p className="font-bold">{upload.status === 'rejected' ? 'Reason:' : 'Note:'}</p>
                              <p className="mt-1 whitespace-pre-wrap">{upload.feedback}</p>
                            </div>
                          )}

                          {upload.status === 'approved' && !upload.feedback && (
                            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-sm text-center">
                              Congratulations! Your work is now public.
                            </div>
                          )}

                          {/* Edit + Delete buttons */}
                          <div className="mt-6 flex gap-3">
                            <button
                              onClick={() => openEditUpload(upload)}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUpload(upload)}
                              disabled={deletingId === upload.id}
                              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition"
                            >
                              {deletingId === upload.id ? 'Deleting...' : '🗑️ Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ============= EVENTS TAB ============= */}
          {activeTab === 'events' && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-amber-900 mb-3">Create Amazing Events</h3>
                <p className="text-amber-800 leading-relaxed">
                  Workshops, conferences, meetups, webinars — share them all with the community!
                </p>
              </div>

              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl py-6 rounded-2xl shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-3"
              >
                {showEventForm ? 'Cancel' : 'Create New Event'}
              </button>

              {showEventForm && (
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-10">Create New Event</h3>

                  {eventPhotoPreview && (
  <div className="flex flex-col items-center gap-2 mb-6">
    <img src={eventPhotoPreview} alt="Preview" className="w-full max-w-lg h-64 object-cover rounded-xl shadow-lg" />
    <button
      type="button"
      onClick={() => {
        setEventFormData(prev => ({ ...prev, photo: null }));
        setEventPhotoPreview(null);
      }}
      className="text-xs px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md font-medium transition-colors"
    >
      ✕ Clear Photo
    </button>
  </div>
)}

                  <form onSubmit={handleEventSubmit} className="space-y-6">
                    <input name="title" placeholder="Event Title *" value={eventFormData.title} onChange={handleEventInputChange} required className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
                    <textarea name="description" placeholder="Description *" rows="5" value={eventFormData.description} onChange={handleEventInputChange} required className="w-full p-4 border border-gray-300 rounded-xl resize-none text-gray-900" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="datetime-local" name="date" value={eventFormData.date} onChange={handleEventInputChange} required className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
                      <input name="location" placeholder="Location (e.g. Zoom, Kigali)" value={eventFormData.location} onChange={handleEventInputChange} required className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
                    </div>

                    <input name="link" placeholder="Registration Link (optional)" value={eventFormData.link} onChange={handleEventInputChange} className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />

                    <div className="grid grid-cols-2 gap-4">
                      <select name="icon" value={eventFormData.icon} onChange={handleEventInputChange} className="p-4 border border-gray-300 rounded-xl text-gray-900">
                        <option>Calendar</option>
                        <option>Laptop</option>
                        <option>Users</option>
                        <option>GraduationCap</option>
                        <option>Presentation</option>
                      </select>
                      <input type="file" name="photo" accept="image/*" onChange={handleEventInputChange} className="w-full p-4 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 file:bg-blue-600 file:text-white file:py-3 file:px-8 file:rounded-lg text-gray-900" />
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 rounded-xl text-lg shadow-lg disabled:opacity-70"
                    >
                      {uploading ? 'Creating...' : 'Publish Event'}
                    </button>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-3xl font-bold text-gray-800 text-center mb-10">My Events</h3>

                {events.length === 0 ? (
                  <p className="text-center text-gray-500 py-16 text-lg">No events yet. Create your first one!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {events.map(event => {
                      const status = event.status || 'pending';
                      const statusDisplay = event.status_display ||
                        (status === 'pending' ? 'Pending' :
                          status === 'approved' ? 'Approved' :
                            status === 'rejected' ? 'Rejected' : 'Pending');

                      return (
                        <div key={event.id} className="group bg-white border-2 border-blue-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105 cursor-pointer relative">
                          {event.photo ? (
                            <img src={event.photo} alt={event.title} className="w-full h-48 object-cover" />
                          ) : (
                            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 h-48 flex items-center justify-center text-6xl text-white">
                              {event.icon || 'Calendar'}
                            </div>
                          )}

                          <div className={`absolute top-4 right-4 px-5 py-2 rounded-full text-sm font-bold text-white shadow-lg
                            ${status === 'approved' ? 'bg-emerald-600' :
                              status === 'rejected' ? 'bg-red-600' :
                                'bg-amber-600'}`}
                          >
                            {statusDisplay}
                          </div>

                          <div className="p-6">
                            <h4 className="font-bold text-xl text-gray-800 line-clamp-2">{event.title}</h4>
                            <p className="text-sm text-gray-600 mt-2">
                              {event.date ? format(new Date(event.date), 'PPP • p') : 'No date'}
                            </p>
                            <p className="text-gray-700">{event.location || 'No location'}</p>
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

        {/* Profile Sidebar */}
        <div className="bg-white rounded-2xl shadow-xl p-8 h-fit border sticky top-24">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Profile</h3>
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
            {user?.profile_image ? (
              <Image
                src={user?.profile_image || user?.user?.profile_image}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <div className="space-y-4 text-gray-700">
            <div><strong>Name:</strong> {user?.username}</div>
            <div><strong>Email:</strong> {user?.email}</div>
            {user?.age && <div><strong>Age:</strong> {user.age}</div>}
            {user?.phone_number && <div><strong>Phone:</strong> {user.phone_number}</div>}
            {user?.location && <div><strong>Location:</strong> {user.location}</div>}
            {user?.university && <div><strong>University:</strong> {user.university}</div>}
            {user?.details && (
              <div>
                <strong>Bio:</strong>
                <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-wrap">{user.details}</p>
              </div>
            )}
          </div>

          <button
           onClick={() => window.location.href = `/profile`}
            className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h3>
            <form onSubmit={saveProfile} className="space-y-6">
             <div className="flex flex-col items-center">
  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-2 relative">
    {imagePreview ? (
      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
    ) : (
      <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">No Image</div>
    )}
  </div>

  {imagePreview && (
    <button
      type="button"
      onClick={() => {
        setImagePreview(null);
        setProfileForm(prev => ({ ...prev, profile_image: null }));
        setRemoveProfileImage(true); // NEW
      }}
      className="text-xs text-red-600 hover:text-red-800 underline mb-3"
    >
      Remove photo
    </button>
  )}

  <label className="cursor-pointer">
    <span className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">Choose Photo</span>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          setProfileForm(prev => ({ ...prev, profile_image: file }));
          setImagePreview(URL.createObjectURL(file));
          setRemoveProfileImage(false); // NEW — picking new photo cancels remove
        }
      }}
      className="hidden"
    />
  </label>
</div>

              <input type="number" placeholder="Age" value={profileForm.age} onChange={e => setProfileForm(p => ({ ...p, age: e.target.value }))} className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
              <input type="tel" placeholder="Phone" value={profileForm.phone_number} onChange={e => setProfileForm(p => ({ ...p, phone_number: e.target.value }))} className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
              <input type="text" placeholder="Location" value={profileForm.location} onChange={e => setProfileForm(p => ({ ...p, location: e.target.value }))} className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
              <input type="text" placeholder="University" value={profileForm.university} onChange={e => setProfileForm(p => ({ ...p, university: e.target.value }))} className="w-full p-4 border border-gray-300 rounded-xl text-gray-900" />
              <textarea
                placeholder="Short bio (optional)"
                rows={4}
                value={profileForm.details}
                onChange={e => setProfileForm(p => ({ ...p, details: e.target.value }))}
                className="w-full p-4 border border-gray-300 rounded-xl resize-none"
              />

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl">Save Changes</button>
                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Upload Modal */}
      {showEditUpload && editingUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Research</h3>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                <p className="text-sm text-blue-600">Editing</p>
                <p className="text-xl font-bold text-blue-900 line-clamp-2">{editingUpload.title}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-600 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ">Authors *</label>
                <input
                  type="text"
                  name="authors"
                  value={editForm.authors}
                  onChange={handleEditInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-600 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Supervisor Name *</label>
                <input
                  type="text"
                  name="supervisor_name"
                  value={editForm.supervisor_name}
                  onChange={handleEditInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-600 outline-none bg-blue-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                <input
                  type="number"
                  name="year"
                  value={editForm.year}
                  onChange={handleEditInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-600 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description / Abstract *</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  required
                  rows={6}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-600 outline-none resize-none text-gray-900"
                />
              </div>

              <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">Update File (optional)</label>

  {existingFileUrl && !removeFile && !editForm.file && (
    <div className="flex items-center justify-between p-3 mb-2 bg-blue-50 border border-blue-200 rounded-lg">
      <a href={existingFileUrl} target="_blank" className="text-xs text-blue-600 hover:underline truncate">
        📄 Current file attached
      </a>
      <button
        type="button"
        onClick={() => setRemoveFile(true)}
        className="text-xs text-red-600 hover:text-red-800 font-medium underline ml-3"
      >
        Remove
      </button>
    </div>
  )}

  {removeFile && (
    <div className="flex items-center justify-between p-3 mb-2 bg-red-50 border border-red-200 rounded-lg">
      <span className="text-xs text-red-700 italic">File will be removed when you save.</span>
      <button
        type="button"
        onClick={() => setRemoveFile(false)}
        className="text-xs text-blue-600 hover:text-blue-800 underline ml-3"
      >
        Undo
      </button>
    </div>
  )}

  <input
    type="file"
    name="file"
    accept=".pdf,.doc,.docx"
    onChange={handleEditInputChange}
    className="w-full p-4 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 file:bg-blue-600 file:text-white file:py-3 file:px-8 file:rounded-lg text-gray-900"
  />
  {editForm.file && (
    <div className="flex items-center gap-2 mt-1">
      <p className="text-xs text-green-600">✓ {editForm.file.name}</p>
      <button
        type="button"
        onClick={() => setEditForm(p => ({ ...p, file: null }))}
        className="text-xs text-red-600 hover:text-red-800 font-medium underline"
      >
        Clear
      </button>
    </div>
  )}
  <p className="text-xs text-gray-500 mt-2">Leave empty to keep current file</p>
</div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl transition"
                >
                  {uploading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUpload(false);
                    setEditingUpload(null);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}