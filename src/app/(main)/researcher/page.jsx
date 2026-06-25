'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getApiUrl } from '@/utils/api';

export default function ResearcherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPublication, setShowAddPublication] = useState(false);
  const [orcid, setOrcid] = useState('0000-0002-2587-7963');
  const [researcherId, setResearcherId] = useState('HIK-3500-2022');

  const [isEditing, setIsEditing] = useState(false);

  const [bio, setBio] = useState(user?.bio || '');
  const [platformId, setPlatformId] = useState(user?.orcid || '');
  const [profileImage, setProfileImage] = useState(null);

  // NEW: Qualification & Position
  const [qualification, setQualification] = useState('');
  const [Field, setField] = useState('');
  
  const [Position, setPosition] = useState('');

  // Profile edit
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    profile_image: null,
    bio: '',
    cv: null,
    resume: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Publication form data
  const [publicationForm, setPublicationForm] = useState({
    title: '',
    authors: [''],
    journal_name: '',
    conference_info: '',
    doi: '',
    display_doi: '',
    url: '',
    publisher: '',
    book_title: '',
    patent_title:'',
    Conference_title:'',
    symposium_title:'',
    publication_type: 'journal'
  });

  useEffect(() => {
    fetchUserAndPublications();
  }, []);

  const fetchUserAndPublications = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }
     
    try {
      const [userRes, publicationsRes] = await Promise.all([
        fetch(getApiUrl('/api/me/'), {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(getApiUrl('/api/my-researches/'), {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      if (!userRes.ok) throw new Error('Unauthorized');
      const userData = await userRes.json();
      const publicationsData = await publicationsRes.json();
      setUser(userData);
      setPublications(publicationsData);
    } catch (err) {
      console.error("Auth failed, redirecting...", err);
      localStorage.removeItem('token'); 
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorChange = (index, value) => {
    const newAuthors = [...publicationForm.authors];
    newAuthors[index] = value;
    setPublicationForm(prev => ({ ...prev, authors: newAuthors }));
  };

  const addAuthorField = () => {
    setPublicationForm(prev => ({
      ...prev,
      authors: [...prev.authors, '']
    }));
  };

  const removeAuthorField = (index) => {
    if (publicationForm.authors.length > 1) {
      const newAuthors = publicationForm.authors.filter((_, i) => i !== index);
      setPublicationForm(prev => ({ ...prev, authors: newAuthors }));
    }
  };

  const handlePublicationInputChange = (e) => {
    const { name, value } = e.target;
    setPublicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPublication = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const publicationData = {
      ...publicationForm,
      authors: publicationForm.authors.filter(author => author.trim() !== '')
    };

    try {
      const res = await fetch(getApiUrl('/api/researches/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(publicationData)
      });

      if (res.ok) {
        const newPublication = await res.json();
        setPublications(prev => [newPublication, ...prev]);
        setShowAddPublication(false);
        resetPublicationForm();
        alert('Publication added successfully!');
      } else {
        const err = await res.json();
        alert('Error: ' + JSON.stringify(err));
      }
    } catch {
      alert('Network error');
    }
  };

  const resetPublicationForm = () => {
    setPublicationForm({
      title: '',
      authors: [''],
      journal_name: '',
      conference_info: '',
      doi: '',
      display_doi: '',
      url: '',
      publisher: '',
      book_title: '',
      patent_title:'',
      Conference_title:'',
      symposium_title:'',
      publication_type: 'journal'
    });
  };

  const openEditProfile = () => {
    setProfileForm({
      profile_image: null,
      bio: user?.bio || '',
      cv: null,
      resume: null
    });
    setImagePreview(user?.profile_image ? getApiUrl(user.profile_image) : null);
    setShowEditProfile(true);
  };

  const handleProfileSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  
  formData.append('bio', bio || '');
  formData.append('platformId', platformId || '');
  formData.append('qualification', qualification || '');
  formData.append('Field', Field || '');
  formData.append('Position', Position || '');

  if (profileImage) {
    formData.append('profile_image', profileImage);   // ← No [0], it's already a File
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(getApiUrl('/api/update-profile'), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const updatedUser = await response.json();
      alert('Profile updated successfully!');
      setUser(updatedUser);
      setIsEditing(false);
      setProfileImage(null);        // Reset file
      setImagePreview(null);
    } else {
      const errorData = await response.json();
      console.error('Update failed:', errorData);
      alert('Update failed: ' + JSON.stringify(errorData));
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Network error');
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center">
        <div className="text-3xl font-light text-slate-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F2FE]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="bg-blue-50 text-blue-700 px-5 py-2 rounded-full font-medium border border-blue-200 shadow-sm">
            {user?.user?.username}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Publications */}
        <div className="lg:col-span-2 space-y-8">
          {/* Publications Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Publications</h2>
                <p className="text-sm text-slate-500 mt-1">Your research contributions</p>
              </div>
              <button
                onClick={() => setShowAddPublication(!showAddPublication)}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md ${
                  showAddPublication 
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                {showAddPublication ? 'Cancel' : '+ Add Publication'}
              </button>
            </div>

            {/* Publications List */}
            <div className="space-y-6 mt-6">
              {publications.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-slate-500 text-lg">No publications yet.</p>
                  <p className="text-slate-400 text-sm mt-2">Add your first publication to get started!</p>
                </div>
              ) : (
                publications.map((pub, index) => (
                  <div key={pub.id} className="group border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white hover:border-blue-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                          {pub.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                          <span className="font-medium text-slate-700">Authors:</span>{' '}
                          {Array.isArray(pub.authors) ? pub.authors.join(' • ') : pub.authors}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-3 text-sm">
                          {pub.journal_name && (
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-700">
                              📔 {pub.journal_name}
                            </span>
                          )}
                          {pub.conference_info && (
                            <span className="px-3 py-1 bg-purple-100 rounded-full text-purple-700">
                              🎤 {pub.conference_info}
                            </span>
                          )}
                          {pub.publisher && (
                            <span className="px-3 py-1 bg-green-100 rounded-full text-green-700">
                              📍 {pub.publisher}
                            </span>
                          )}
                        </div>
                        {(pub.doi || pub.url) && (
                          <div className="mt-3 flex flex-wrap gap-4 text-xs">
                            {pub.doi && (
                              <span className="font-mono text-blue-600">
                                DOI: {pub.doi}
                              </span>
                            )}
                            
                          </div>
                        )}
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => alert(pub.abstract)} 
                            className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors"
                          >
                            📄 Abstract
                          </button>
                          {(pub.doi || pub.url) && (
                            <a 
                              href={pub.url || `https://doi.org/${pub.doi}`} 
                              target="_blank" 
                              className="text-xs px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md font-medium transition-colors"
                            >
                              🌐 HTML
                            </a>
                          )}
                          {pub.pdf_path && (
                            <a 
                              href={getApiUrl(pub.pdf_path)} 
                              target="_blank" 
                              className="text-xs px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md font-medium transition-colors"
                            >
                              📑 PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Publication Form */}
          {showAddPublication && (
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 animate-fadeIn">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Add New Publication</h3>
              <p className="text-sm text-slate-500 mb-8">Fill in the details below</p>
              
              <form onSubmit={handleSubmitPublication} className="space-y-6">
                {/* Publication Type Toggle */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Publication Type</label>
                  <div className="flex flex-wrap gap-3">
                    {['journal', 'book', 'Conference', 'symposium', 'patent'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPublicationForm(prev => ({ ...prev, publication_type: type }))}
                        className={`px-5 py-2.5 rounded-lg font-medium text-sm capitalize transition-all ${
                          publicationForm.publication_type === type
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={publicationForm.title}
                    onChange={handlePublicationInputChange}
                    required
                    className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none transition"
                    placeholder="Enter publication title"
                  />
                </div>

                {/* Authors */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Authors</label>
                  <div className="space-y-3">
                    {publicationForm.authors.map((author, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={author}
                          onChange={(e) => handleAuthorChange(index, e.target.value)}
                          className="flex-1 p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                          placeholder={`Author ${index + 1}`}
                        />
                        {index === publicationForm.authors.length - 1 ? (
                          <button
                            type="button"
                            onClick={addAuthorField}
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
                          >
                            +
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeAuthorField(index)}
                            className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Fields Based on Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publicationForm.publication_type === 'journal' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Journal Name</label>
                      <input
                        type="text"
                        name="journal_name"
                        value={publicationForm.journal_name}
                        onChange={handlePublicationInputChange}
                        className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="Journal name"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Conference Info</label>
                    <input
                      type="text"
                      name="conference_info"
                      value={publicationForm.conference_info}
                      onChange={handlePublicationInputChange}
                      className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="Conference information"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Publisher</label>
                    <input
                      type="text"
                      name="publisher"
                      value={publicationForm.publisher}
                      onChange={handlePublicationInputChange}
                      className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="Publisher name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">DOI</label>
                    <input
                      type="text"
                      name="doi"
                      value={publicationForm.doi}
                      onChange={handlePublicationInputChange}
                      className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="10.xxxx/xxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Display DOI</label>
                    <input
                      type="text"
                      name="display_doi"
                      value={publicationForm.display_doi}
                      onChange={handlePublicationInputChange}
                      className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="Display DOI"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">URL</label>
                    <input
                      type="url"
                      name="url"
                      value={publicationForm.url}
                      onChange={handlePublicationInputChange}
                      className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
                  >
                    Save Publication
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPublication(false)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Profile Sidebar */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 h-fit sticky top-24">
          {!isEditing ? (
            /* View Mode */
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Profile</h2>
                <p className="text-sm text-slate-500 mt-1">Researcher information</p>
              </div>

              {/* Profile Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                    {user?.profile_image ? (
                      <img 
                        src={getApiUrl(user.profile_image)} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400">
                        👤
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Bio</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {user?.bio || "No bio added yet."}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Academic Identity</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">ORCID:</span>
                      <span className="font-mono text-blue-600 font-medium">{user?.orcid || "Not set"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Researcher ID:</span>
                      <span className="font-mono text-indigo-600 font-medium">{researcherId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            /* Edit Mode */
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Profile</h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                  <textarea
                    className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Qualification - NEW */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Qualification</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Ph.D. in Computer Science"
                  />
                </div>
                 {/* Field - NEW */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Field </label>
                  <input
                    type="text"
                    value={Field}
                    onChange={(e) => setField(e.target.value)}
                    className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="teaching AI intergation"
                  />
                </div>

                {/* Position - NEW */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={Position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="UNILAK"
                  />
                </div>

                {/* Picture Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="border-2 border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition cursor-pointer">
                      <label className="cursor-pointer flex items-center gap-2">
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => setProfileImage(e.target.files[0])} 
                          accept="image/*"
                        />
                        <span className="text-2xl">📷</span>
                        <span className="text-sm text-slate-600">Upload</span>
                      </label>
                    </div>
                    {profileImage && (
                      <span className="text-sm text-green-600 font-medium">
                        ✓ File selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Platform ID */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Platform ID</label>
                  <input
                    type="text"
                    placeholder="ORCID / Researcher ID"
                    className="w-full border-2 border-slate-200 rounded-lg p-3 focus:border-blue-500 outline-none"
                    value={platformId}
                    onChange={(e) => setPlatformId(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-slate-200 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}