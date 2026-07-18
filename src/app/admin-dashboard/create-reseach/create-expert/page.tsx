'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/utils/api';

interface Expert {
  id: string;
  name: string;
  title: string;
  location: string;
  profileImage?: string;
  yearOfExperience: number;
  verified: boolean;
}

interface PortfolioItem {
  title: string;
  description: string;
  technologies: string;
}

interface WorkExperienceItem {
  position: string;
  company: string;
  startYear: number;
  endYear?: number;
  description: string;
  technologies: string;
}

interface EducationItem {
  degree: string;
  institution: string;
  startYear: number;
  endYear: number;
}

interface CertificationItem {
  name: string;
  issuer: string;
  dateObtained: string;
}

interface FormData {
  name: string;
  title: string;
  location: string;
  bio: string;
  profileImage?: string;
  yearOfExperience: number;
  expertise: string;
  portfolio: PortfolioItem[];
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  skills: {
    libraries?: string;
    tools?: string;
    languages?: string;
    paradigms?: string;
    platforms?: string;
    storage?: string;
    frameworks?: string;
    other?: string;
  };
  preferredEnvironment: string;
}

const emptyPortfolio = (): PortfolioItem => ({ title: '', description: '', technologies: '' });
const emptyWorkExp = (): WorkExperienceItem => ({
  position: '', company: '', startYear: new Date().getFullYear(), endYear: undefined, description: '', technologies: '',
});
const emptyEducation = (): EducationItem => ({
  degree: '', institution: '', startYear: new Date().getFullYear() - 4, endYear: new Date().getFullYear(),
});
const emptyCertification = (): CertificationItem => ({ name: '', issuer: '', dateObtained: '' });

const defaultForm = (): FormData => ({
  name: '',
  title: '',
  location: '',
  bio: '',
  yearOfExperience: new Date().getFullYear() - 2000,
  expertise: '',
  portfolio: [],
  workExperience: [],
  education: [],
  certifications: [],
  skills: {},
  preferredEnvironment: '',
});

// ─── Reusable section wrapper ────────────────────────────────────────────────
function SectionHeader({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3 mt-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{label}</h3>
      <button
        type="button"
        onClick={onAdd}
        className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded hover:bg-blue-100"
      >
        + Add
      </button>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-red-500 hover:text-red-700 text-xs font-medium ml-auto"
    >
      Remove
    </button>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50 space-y-3">
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white';
const textareaCls = `${inputCls} resize-none`;

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminExpertsPage() {
  const router = useRouter();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm());

  useEffect(() => { fetchExperts(); }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/experts'));
      setExperts(await res.json());
    } catch (err) {
      setError('Failed to fetch experts');
    } finally {
      setLoading(false);
    }
  };

  // ── Generic top-level field handler ────────────────────────────────────────
  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'yearOfExperience' ? parseInt(value) || 0 : value }));
  };

  // ── Skills handler ──────────────────────────────────────────────────────────
  const handleSkill = (key: keyof FormData['skills'], value: string) =>
    setFormData(prev => ({ ...prev, skills: { ...prev.skills, [key]: value } }));

  // ── Array item updaters ─────────────────────────────────────────────────────
  function updateArrayItem<T>(
    key: 'portfolio' | 'workExperience' | 'education' | 'certifications',
    index: number,
    field: keyof T,
    value: string | number
  ) {
    setFormData(prev => {
      const arr = [...(prev[key] as T[])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });
  }

  function addItem<T>(key: 'portfolio' | 'workExperience' | 'education' | 'certifications', empty: T) {
    setFormData(prev => ({ ...prev, [key]: [...(prev[key] as T[]), empty] }));
  }

  function removeItem(key: 'portfolio' | 'workExperience' | 'education' | 'certifications', index: number) {
    setFormData(prev => ({ ...prev, [key]: (prev[key] as unknown[]).filter((_, i) => i !== index) }));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const payload = {
        ...formData,
        expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean),
        preferredEnvironment: formData.preferredEnvironment.split(',').map(s => s.trim()).filter(Boolean),
        skills: Object.fromEntries(
          Object.entries(formData.skills).map(([k, v]) => [
            k, typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : v,
          ])
        ),
        portfolio: formData.portfolio.map(p => ({
          ...p,
          technologies: p.technologies.split(',').map(s => s.trim()).filter(Boolean),
        })),
        workExperience: formData.workExperience.map(w => ({
          ...w,
          startYear: Number(w.startYear),
          endYear: w.endYear ? Number(w.endYear) : undefined,
          technologies: w.technologies.split(',').map(s => s.trim()).filter(Boolean),
        })),
        education: formData.education.map(e => ({
          ...e,
          startYear: Number(e.startYear),
          endYear: Number(e.endYear),
        })),
      };

      const url = editingId ? getApiUrl(`/experts/${editingId}`) : getApiUrl('/experts');
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) { window.location.href = '/login'; return; }
      if (!res.ok) throw new Error(await res.text());

      setSuccess(editingId ? 'Expert updated successfully' : 'Expert created successfully');
      resetForm();
      fetchExperts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save expert');
    }
  };
  const handleEditClick = async (id: string) => {
  try {
    const res = await fetch(getApiUrl(`/experts/${id}`));
    if (!res.ok) throw new Error();
    const data = await res.json();

    setFormData({
      name: data.name || '',
      title: data.title || '',
      location: data.location || '',
      bio: data.bio || '',
      profileImage: data.profileImage,
      yearOfExperience: data.yearOfExperience || 0,
      expertise: (data.expertise || []).join(', '),
      portfolio: (data.portfolio || []).map((p: any) => ({
        title: p.title,
        description: p.description,
        technologies: (p.technologies || []).join(', '),
      })),
      workExperience: (data.workExperience || []).map((w: any) => ({
        position: w.position,
        company: w.company,
        startYear: w.startYear,
        endYear: w.endYear,
        description: w.description,
        technologies: (w.technologies || []).join(', '),
      })),
      education: data.education || [],
      certifications: (data.certifications || []).map((c: any) => ({
        name: c.name,
        issuer: c.issuer,
        dateObtained: c.dateObtained ? String(c.dateObtained).split('T')[0] : '',
      })),
      skills: Object.fromEntries(
        Object.entries(data.skills || {}).map(([k, v]) =>
          [k, Array.isArray(v) ? v.join(', ') : (v ?? '')]
        )
      ),
      preferredEnvironment: (data.preferredEnvironment || []).join(', '),
    });

    setEditingId(id);
    setImagePreview(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    setError('Failed to load expert for editing');
  }
};

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expert?')) return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const res = await fetch(getApiUrl(`/experts/${id}`), { method: 'DELETE',headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, });
      if (!res.ok) throw new Error();
      setSuccess('Expert deleted successfully');
      fetchExperts();
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Failed to delete expert'); }
  };

  const handleVerify = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const res = await fetch(getApiUrl(`/experts/${id}/verify`), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setSuccess('Expert verified successfully');
      fetchExperts();
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Failed to verify expert'); }
  };

  const resetForm = () => { setFormData(defaultForm()); setEditingId(null); setShowForm(false); setImagePreview(null); };

  // ── Profile image upload ────────────────────────────────────────────────────
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    setImageUploading(true);
    try {
      const token = localStorage.getItem('token');
      const body = new FormData();
      body.append('file', file);

      const requestUrl = editingId
        ? getApiUrl(`/experts/${editingId}/upload-profile-image`)
        : getApiUrl('/experts/upload-profile-image');

      const res = await fetch(requestUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      if (!res.ok) throw new Error('Upload failed');
      const { url: uploadedUrl } = await res.json();          // expects { url: "https://..." }
      setFormData(prev => ({ ...prev, profileImage: uploadedUrl }));
    } catch (err) {
      setError('Image upload failed. Please try again.');
      setImagePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Experts Management</h1>
          <div className="flex gap-3">
            <Link href="/experts" className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
              Public List
            </Link>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : '+ Add Expert'}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Expert' : 'Add New Expert'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-2">

              {/* ── Basic Info ─────────────────────────────────────────────── */}
              <div className="pb-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Basic Info</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input className={inputCls} type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleField} required />
                  <input className={inputCls} type="text" name="title" placeholder="Job Title *" value={formData.title} onChange={handleField} required />
                  <input className={inputCls} type="text" name="location" placeholder="Location *" value={formData.location} onChange={handleField} required />
                  <input className={inputCls} type="number" name="yearOfExperience" placeholder="Years of Experience *" value={formData.yearOfExperience} onChange={handleField} required min={0} />
                  {/* Profile image upload */}
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">Profile Image (optional)</label>
                    <div className="flex items-center gap-4">
                      {/* Avatar preview */}
                      <div className="w-16 h-16 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {imagePreview || formData.profileImage ? (
                          <img
                            src={imagePreview ?? formData.profileImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        {/* File picker */}
                        <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 ${imageUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                          </svg>
                          {imageUploading ? 'Uploading…' : 'Choose image'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={imageUploading}
                          />
                        </label>

                        {/* Uploaded URL (read-only confirmation) */}
                        {formData.profileImage && !imageUploading && (
                          <p className="text-xs text-green-700 truncate max-w-xs">
                            ✓ Uploaded: {formData.profileImage}
                          </p>
                        )}

                        {/* Clear button */}
                        {(imagePreview || formData.profileImage) && (
                          <button
                            type="button"
                            onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, profileImage: undefined })); }}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Remove image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <textarea className={`${textareaCls} mt-3`} name="bio" placeholder="Bio / Summary *" value={formData.bio} onChange={handleField} required rows={3} />
              </div>

              {/* ── Expertise & Environment ──────────────────────────────── */}
              <div className="border-t pt-4 pb-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Expertise & Environment</h3>
                <input className={`${inputCls} mb-3`} type="text" name="expertise" placeholder="Areas of expertise (comma-separated) e.g. React, NestJS, DevOps" value={formData.expertise} onChange={handleField} />
                <input className={inputCls} name="preferredEnvironment" placeholder="Preferred environments (comma-separated) e.g. Remote, Startup, Agile" value={formData.preferredEnvironment} onChange={e => setFormData(prev => ({ ...prev, preferredEnvironment: e.target.value }))} />
              </div>

              {/* ── Skills ───────────────────────────────────────────────── */}
              <div className="border-t pt-4 pb-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Skills</h3>
                <p className="text-xs text-gray-500 mb-3">Enter each category as comma-separated values.</p>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    ['languages', 'Languages e.g. TypeScript, Python'],
                    ['frameworks', 'Frameworks e.g. NestJS, Next.js'],
                    ['libraries', 'Libraries e.g. React Query, Lodash'],
                    ['tools', 'Tools e.g. Docker, Git, Webpack'],
                    ['platforms', 'Platforms e.g. AWS, Vercel, Linux'],
                    ['storage', 'Storage e.g. PostgreSQL, Redis, S3'],
                    ['paradigms', 'Paradigms e.g. OOP, Functional, TDD'],
                    ['other', 'Other skills'],
                  ] as [keyof FormData['skills'], string][]).map(([key, placeholder]) => (
                    <input
                      key={key}
                      className={inputCls}
                      type="text"
                      placeholder={placeholder}
                      value={formData.skills[key] || ''}
                      onChange={e => handleSkill(key, e.target.value)}
                    />
                  ))}
                </div>
              </div>

              {/* ── Portfolio ─────────────────────────────────────────────── */}
              <div className="border-t pt-4">
                <SectionHeader label="Portfolio" onAdd={() => addItem('portfolio', emptyPortfolio())} />
                {formData.portfolio.length === 0 && (
                  <p className="text-xs text-gray-400 italic mb-2">No portfolio items yet. Click "+ Add" to add one.</p>
                )}
                {formData.portfolio.map((item, i) => (
                  <FieldGroup key={i}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Project #{i + 1}</span>
                      <RemoveButton onClick={() => removeItem('portfolio', i)} />
                    </div>
                    <input className={inputCls} type="text" placeholder="Project title *" value={item.title}
                      onChange={e => updateArrayItem<PortfolioItem>('portfolio', i, 'title', e.target.value)} />
                    <textarea className={textareaCls} placeholder="Project description *" value={item.description} rows={2}
                      onChange={e => updateArrayItem<PortfolioItem>('portfolio', i, 'description', e.target.value)} />
                    <input className={inputCls} type="text" placeholder="Technologies used (comma-separated) *" value={item.technologies}
                      onChange={e => updateArrayItem<PortfolioItem>('portfolio', i, 'technologies', e.target.value)} />
                  </FieldGroup>
                ))}
              </div>

              {/* ── Work Experience ────────────────────────────────────────── */}
              <div className="border-t pt-4">
                <SectionHeader label="Work Experience" onAdd={() => addItem('workExperience', emptyWorkExp())} />
                {formData.workExperience.length === 0 && (
                  <p className="text-xs text-gray-400 italic mb-2">No work experience yet. Click "+ Add" to add one.</p>
                )}
                {formData.workExperience.map((item, i) => (
                  <FieldGroup key={i}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Position #{i + 1}</span>
                      <RemoveButton onClick={() => removeItem('workExperience', i)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input className={inputCls} type="text" placeholder="Job title / Position *" value={item.position}
                        onChange={e => updateArrayItem<WorkExperienceItem>('workExperience', i, 'position', e.target.value)} />
                      <input className={inputCls} type="text" placeholder="Company name *" value={item.company}
                        onChange={e => updateArrayItem<WorkExperienceItem>('workExperience', i, 'company', e.target.value)} />
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Start Year *</label>
                        <input className={inputCls} type="number" placeholder="e.g. 2020" value={item.startYear}
                          onChange={e => updateArrayItem<WorkExperienceItem>('workExperience', i, 'startYear', parseInt(e.target.value))} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">End Year (blank = Present)</label>
                        <input className={inputCls} type="number" placeholder="e.g. 2023 or leave blank" value={item.endYear ?? ''}
                          onChange={e => updateArrayItem<WorkExperienceItem>('workExperience', i, 'endYear', e.target.value === '' ? '' as unknown as number : parseInt(e.target.value))} />
                      </div>
                    </div>
                    <textarea className={textareaCls} placeholder="Role description *" value={item.description} rows={2}
                      onChange={e => updateArrayItem<WorkExperienceItem>('workExperience', i, 'description', e.target.value)} />
                    <input className={inputCls} type="text" placeholder="Technologies used (comma-separated) *" value={item.technologies}
                      onChange={e => updateArrayItem<WorkExperienceItem>('workExperience', i, 'technologies', e.target.value)} />
                  </FieldGroup>
                ))}
              </div>

              {/* ── Education ─────────────────────────────────────────────── */}
              <div className="border-t pt-4">
                <SectionHeader label="Education" onAdd={() => addItem('education', emptyEducation())} />
                {formData.education.length === 0 && (
                  <p className="text-xs text-gray-400 italic mb-2">No education entries yet. Click "+ Add" to add one.</p>
                )}
                {formData.education.map((item, i) => (
                  <FieldGroup key={i}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Education #{i + 1}</span>
                      <RemoveButton onClick={() => removeItem('education', i)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input className={inputCls} type="text" placeholder="Degree / Qualification *" value={item.degree}
                        onChange={e => updateArrayItem<EducationItem>('education', i, 'degree', e.target.value)} />
                      <input className={inputCls} type="text" placeholder="Institution name *" value={item.institution}
                        onChange={e => updateArrayItem<EducationItem>('education', i, 'institution', e.target.value)} />
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Start Year *</label>
                        <input className={inputCls} type="number" placeholder="e.g. 2016" value={item.startYear}
                          onChange={e => updateArrayItem<EducationItem>('education', i, 'startYear', parseInt(e.target.value))} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">End Year *</label>
                        <input className={inputCls} type="number" placeholder="e.g. 2020" value={item.endYear}
                          onChange={e => updateArrayItem<EducationItem>('education', i, 'endYear', parseInt(e.target.value))} />
                      </div>
                    </div>
                  </FieldGroup>
                ))}
              </div>

              {/* ── Certifications ────────────────────────────────────────── */}
              <div className="border-t pt-4">
                <SectionHeader label="Certifications" onAdd={() => addItem('certifications', emptyCertification())} />
                {formData.certifications.length === 0 && (
                  <p className="text-xs text-gray-400 italic mb-2">No certifications yet. Click "+ Add" to add one.</p>
                )}
                {formData.certifications.map((item, i) => (
                  <FieldGroup key={i}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Certification #{i + 1}</span>
                      <RemoveButton onClick={() => removeItem('certifications', i)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input className={inputCls} type="text" placeholder="Certification name *" value={item.name}
                        onChange={e => updateArrayItem<CertificationItem>('certifications', i, 'name', e.target.value)} />
                      <input className={inputCls} type="text" placeholder="Issuing organisation *" value={item.issuer}
                        onChange={e => updateArrayItem<CertificationItem>('certifications', i, 'issuer', e.target.value)} />
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500 mb-1 block">Date Obtained *</label>
                        <input className={inputCls} type="date" value={item.dateObtained}
                          onChange={e => updateArrayItem<CertificationItem>('certifications', i, 'dateObtained', e.target.value)} />
                      </div>
                    </div>
                  </FieldGroup>
                ))}
              </div>

              {/* ── Submit ────────────────────────────────────────────────── */}
              <div className="border-t pt-6 flex gap-3">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  {editingId ? 'Update Expert' : 'Create Expert'}
                </button>
                <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Experts Table ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Title', 'Location', 'Experience', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {experts.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No experts found.</td></tr>
              ) : experts.map(expert => (
                <tr key={expert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900">{expert.name}</td>
                  <td className="px-5 py-4 text-gray-600">{expert.title}</td>
                  <td className="px-5 py-4 text-gray-600">{expert.location}</td>
                  <td className="px-5 py-4 text-gray-600">{expert.yearOfExperience} yrs</td>
                  <td className="px-5 py-4">
                    {expert.verified
                      ? <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">Verified</span>
                      : <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">Pending</span>}
                  </td>
                  
                  <td className="px-5 py-4 flex gap-3 flex-wrap">
                  <Link href={`/experts/${expert.id}`} className="text-blue-600 hover:underline text-xs">View</Link>
                  <button onClick={() => handleEditClick(expert.id)} className="text-indigo-600 hover:underline text-xs">Edit</button>
                  {!expert.verified && (
                    <button onClick={() => handleVerify(expert.id)} className="text-green-600 hover:underline text-xs">Verify</button>
                  )}
                  <button onClick={() => handleDelete(expert.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}