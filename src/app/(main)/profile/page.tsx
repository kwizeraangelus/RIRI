'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Phone, MapPin, BookOpen, Briefcase, Award,
  Edit3, Save, X, Camera, FileText, ExternalLink,
  Upload, Loader2, Check, AlertCircle, Lock, Eye, EyeOff,
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  user_category: string;
  university_name?: string;
  is_active?: boolean;
  is_staff?: boolean;
  age?: number;
  location?: string;
  details?: string;
  profile_image?: string;
  bio?: string;
  orcid?: string;
  cv?: string;
  resume?: string;
}

// ── ✅ FIX 1: point to NestJS port, not Next.js port ──────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// before


const CATEGORY_LABEL: Record<string, string> = {
  researcher: 'Researcher',          RESEARCHER: 'Researcher',
  university: 'University',          UNIVERSITY: 'University',
  conf_organizer: 'Conf. Organizer', CONF_ORGANIZER: 'Conf. Organizer',
  public_visitor: 'Public Visitor',  PUBLIC_VISITOR: 'Public Visitor',
  innovator: 'Innovator',            INNOVATOR: 'Innovator',
  admin: 'Administrator',            ADMIN: 'Administrator',
};

const CATEGORY_COLOR: Record<string, string> = {
  researcher: '#3B82F6',     RESEARCHER: '#3B82F6',
  university: '#8B5CF6',     UNIVERSITY: '#8B5CF6',
  conf_organizer: '#F59E0B', CONF_ORGANIZER: '#F59E0B',
  public_visitor: '#10B981', PUBLIC_VISITOR: '#10B981',
  innovator: '#EF4444',      INNOVATOR: '#EF4444',
  admin: '#FFD700',          ADMIN: '#FFD700',
};

const ACADEMIC = ['researcher','university','conf_organizer','RESEARCHER','UNIVERSITY','CONF_ORGANIZER'];

function safeParseUser(str: string | null): UserProfile | null {
  if (!str || str === 'undefined' || str === 'null') return null;
  try { const p = JSON.parse(str); return p && typeof p === 'object' ? p : null; }
  catch { return null; }
}

function getInitial(u: UserProfile | null) {
  return (u?.first_name?.[0] || u?.username?.[0] || 'U').toUpperCase();
}

function getGradient(ch: string) {
  const g = [
    'linear-gradient(135deg,#3B82F6,#1D4ED8)',
    'linear-gradient(135deg,#8B5CF6,#6D28D9)',
    'linear-gradient(135deg,#F59E0B,#D97706)',
    'linear-gradient(135deg,#10B981,#059669)',
    'linear-gradient(135deg,#EF4444,#DC2626)',
    'linear-gradient(135deg,#EC4899,#BE185D)',
  ];
  return g[ch.charCodeAt(0) % g.length];
}

function getToken() { return localStorage.getItem('access_token') || ''; }
function authHeader() { return { Authorization: `Bearer ${getToken()}` }; }

// ── ✅ FIX 2: correctly build image/file URLs from NestJS static path ─────────
function fileUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  // NestJS saves as e.g. "uploads/profiles/123.jpg" — serve via /uploads/...
  const clean = path.replace(/^\.?\/?/, '');
  return `${API}/${clean}`;
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 300, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 14, background: type === 'success' ? '#059669' : '#DC2626', color: '#fff', fontSize: 14, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,.4)' }}>
      {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '26px', backdropFilter: 'blur(12px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span style={{ color: '#FFD700' }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.38)' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, name, value, icon, editing, onChange, type = 'text', placeholder, readOnly = false }: {
  label: string; name: string; value?: string | number; icon?: React.ReactNode;
  editing: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string; placeholder?: string; readOnly?: boolean;
}) {
  const display = value !== undefined && value !== '' ? String(value) : '—';
  const isArea = type === 'textarea';
  const base: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(255,215,0,.3)', borderRadius: 10,
    padding: '9px 13px', color: '#fff', fontSize: 14,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.36)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
        {icon && <span style={{ opacity: .5 }}>{icon}</span>}{label}
      </label>
      {editing && !readOnly
        ? isArea
          ? <textarea name={name} value={String(value ?? '')} onChange={onChange} placeholder={placeholder} rows={4} style={{ ...base, resize: 'vertical' }} />
          : <input type={type} name={name} value={String(value ?? '')} onChange={onChange} placeholder={placeholder} style={base} />
        : <p style={{ fontSize: 14, color: display === '—' ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.82)', margin: 0, lineHeight: 1.65, wordBreak: 'break-word' }}>{display}</p>
      }
    </div>
  );
}

export default function ProfilePage() {
  const router    = useRouter();
  const photoRef  = useRef<HTMLInputElement>(null);
  const cvRef     = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  const [profile,   setProfile]   = useState<UserProfile | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [editing,   setEditing]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [tab,       setTab]       = useState<'info' | 'academic' | 'documents' | 'password'>('info');
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const [f, setF] = useState({
    first_name: '', last_name: '', phone_number: '',
    age: '', location: '', details: '', bio: '', orcid: '', university_name: '',
  });
  const [pw,     setPw]     = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);

  function fillForm(u: UserProfile) {
    setF({
      first_name:      u.first_name      || '',
      last_name:       u.last_name       || '',
      phone_number:    u.phone_number    || '',
      age:             u.age !== undefined ? String(u.age) : '',
      location:        u.location        || '',
      details:         u.details         || '',
      bio:             u.bio             || '',
      orcid:           u.orcid           || '',
      university_name: u.university_name || '',
    });
  }

  function syncLocal(updated: UserProfile) {
    localStorage.setItem('user', JSON.stringify(updated));
    setProfile(updated);
  }

  function notify(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
  }

  // ── Load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const tk   = localStorage.getItem('access_token');
    const user = safeParseUser(localStorage.getItem('user'));
    if (!tk || !user) { router.push('/'); return; }

    fetch(`${API}/profile/${user.id}`, { headers: authHeader() })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: UserProfile) => { syncLocal(data); fillForm(data); })
      .catch(() => { setProfile(user); fillForm(user); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Save text fields ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/profile/${profile.id}`, {
        method: 'PATCH',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name:      f.first_name      || undefined,
          last_name:       f.last_name       || undefined,
          phone_number:    f.phone_number    || undefined,
          age:             f.age ? Number(f.age) : undefined,
          location:        f.location        || undefined,
          details:         f.details         || undefined,
          bio:             f.bio             || undefined,
          orcid:           f.orcid           || undefined,
          university_name: f.university_name || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || 'Update failed');
      }
      const updated: UserProfile = await res.json();
      syncLocal({ ...profile, ...updated });
      setEditing(false);
      notify('Profile saved!');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { if (profile) fillForm(profile); setEditing(false); };

  // ── ✅ FIX 3: photo upload — field name must match FileInterceptor('profile_image') ──
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Show local preview instantly while uploading
    const localPreview = URL.createObjectURL(file);
    setProfile(prev => prev ? { ...prev, profile_image: localPreview } : prev);
    setUploading(u => ({ ...u, photo: true }));

    try {
      const fd = new FormData();
      fd.append('profile_image', file); // ← must match FileInterceptor('profile_image')
      const res = await fetch(`${API}/profile/${profile.id}/photo`, {
        method: 'PATCH',
        headers: authHeader(), // ← NO Content-Type header! browser sets multipart boundary
        body: fd,
      });
      if (!res.ok) throw new Error('Photo upload failed');
      const updated: UserProfile = await res.json();
      // Replace blob preview with real server path
      URL.revokeObjectURL(localPreview);
      syncLocal({ ...profile, ...updated });
      notify('Photo updated!');
    } catch (e) {
      // Revert preview on failure
      setProfile(prev => prev ? { ...prev, profile_image: profile.profile_image } : prev);
      notify(e instanceof Error ? e.message : 'Photo upload failed', 'error');
    } finally {
      setUploading(u => ({ ...u, photo: false }));
      e.target.value = '';
    }
  };

  // ── ✅ FIX 4: cv/resume — field name matches FileInterceptor('cv') / ('resume') ──
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cv' | 'resume') => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(u => ({ ...u, [field]: true }));
    try {
      const fd = new FormData();
      fd.append(field, file); // ← 'cv' or 'resume' — matches FileInterceptor
      const res = await fetch(`${API}/profile/${profile.id}/${field}`, {
        method: 'PATCH',
        headers: authHeader(), // ← NO Content-Type header!
        body: fd,
      });
      if (!res.ok) throw new Error(`${field.toUpperCase()} upload failed`);
      const updated: UserProfile = await res.json();
      syncLocal({ ...profile, ...updated });
      notify(`${field.toUpperCase()} uploaded!`);
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Upload failed', 'error');
    } finally {
      setUploading(u => ({ ...u, [field]: false }));
      e.target.value = '';
    }
  };

  // ── Password ───────────────────────────────────────────────────────────────
  const handlePasswordChange = async () => {
    if (!profile) return;
    if (pw.next !== pw.confirm) { notify('New passwords do not match', 'error'); return; }
    if (pw.next.length < 6)    { notify('Password must be at least 6 characters', 'error'); return; }
    setPwSaving(true);
    try {
      const res = await fetch(`${API}/profile/${profile.id}/change-password`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: pw.current, new_password: pw.next }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || 'Password change failed');
      }
      setPw({ current: '', next: '', confirm: '' });
      notify('Password changed successfully!');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Password change failed', 'error');
    } finally {
      setPwSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading || !profile) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a1628,#0c1e30,#0d2240)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={36} style={{ color: '#FFD700', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const initial    = getInitial(profile);
  const catColor   = CATEGORY_COLOR[profile.user_category] || '#FFD700';
  const fullName   = (profile.first_name || profile.last_name)
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : profile.username;
  const showAcademic = ACADEMIC.includes(profile.user_category);

  const tabs = [
    { key: 'info'      as const, label: 'Personal Info', icon: <User size={14} /> },
    ...(showAcademic ? [{ key: 'academic' as const, label: 'Academic', icon: <BookOpen size={14} /> }] : []),
    { key: 'documents' as const, label: 'Documents',     icon: <FileText size={14} /> },
    { key: 'password'  as const, label: 'Password',      icon: <Lock size={14} /> },
  ];

  const pwInputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(255,215,0,.3)', borderRadius: 10,
    padding: '9px 40px 9px 13px', color: '#fff', fontSize: 14,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setF(prev => ({ ...prev, [name]: value }));
  };

  // Decide which src to show for the avatar
  const avatarSrc = profile.profile_image
    ? (profile.profile_image.startsWith('blob:') ? profile.profile_image : fileUrl(profile.profile_image))
    : '';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a1628 0%,#0c1e30 55%,#0d2240 100%)', paddingTop: 96, paddingBottom: 80, color: '#fff', fontFamily: 'var(--font-poppins,sans-serif)' }}>
      <style>{`
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        input:focus,textarea:focus{border-color:rgba(255,215,0,.65)!important;box-shadow:0 0 0 3px rgba(255,215,0,.1)}
        button:disabled{opacity:.5;cursor:not-allowed}
        *{box-sizing:border-box}
      `}</style>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 20px' }}>

        {/* Hero */}
        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 22, padding: '36px 36px 28px', backdropFilter: 'blur(20px)', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#FFD700,#FFA500,transparent)' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28, flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: getGradient(initial), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, border: '3px solid rgba(255,215,0,.3)', overflow: 'hidden', position: 'relative' }}>
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                  : <span>{initial}</span>
                }
                {uploading.photo && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 size={20} style={{ color: '#FFD700', animation: 'spin 1s linear infinite' }} />
                  </div>
                )}
              </div>
              <button
                onClick={() => photoRef.current?.click()}
                disabled={uploading.photo}
                title="Change photo"
                style={{ position: 'absolute', bottom: 2, right: 2, width: 27, height: 27, borderRadius: '50%', background: '#FFD700', border: '2px solid #0c1e30', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#000' }}
              >
                <Camera size={12} />
              </button>
              <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
            </div>

            {/* Name + badges */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{fullName}</h1>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, background: `${catColor}22`, border: `1px solid ${catColor}44`, color: catColor }}>
                  {CATEGORY_LABEL[profile.user_category] || profile.user_category}
                </span>
                {profile.is_staff && (
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, background: 'rgba(255,215,0,.15)', border: '1px solid rgba(255,215,0,.3)', color: '#FFD700' }}>Staff</span>
                )}
              </div>
              <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 13, margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={12} /> {profile.email}</p>
              <p style={{ color: 'rgba(255,255,255,.28)', fontSize: 12, margin: 0 }}>@{profile.username}</p>
              {profile.details && <p style={{ color: 'rgba(255,255,255,.62)', fontSize: 14, marginTop: 10, maxWidth: 480, lineHeight: 1.6 }}>{profile.details}</p>}
            </div>

            {/* Edit/Save/Cancel */}
            <div style={{ flexShrink: 0, display: 'flex', gap: 10 }}>
              {tab !== 'password' && tab !== 'documents' && (
                !editing ? (
                  <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', background: 'rgba(255,215,0,.12)', border: '1px solid rgba(255,215,0,.4)', borderRadius: 12, color: '#FFD700', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Edit3 size={14} /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12, color: 'rgba(255,255,255,.55)', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                      <X size={13} /> Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: '#FFD700', border: 'none', borderRadius: 12, color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 3, marginBottom: 18, background: 'rgba(255,255,255,.04)', padding: 4, borderRadius: 13, border: '1px solid rgba(255,255,255,.06)', width: 'fit-content', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setEditing(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: tab === t.key ? 'rgba(255,215,0,.15)' : 'transparent', color: tab === t.key ? '#FFD700' : 'rgba(255,255,255,.4)', fontWeight: tab === t.key ? 600 : 400, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Personal Info */}
        {tab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 18 }}>
            <Card title="Basic Details" icon={<User size={15} />}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                <Field label="First Name" name="first_name"   value={f.first_name}   editing={editing} onChange={handleFieldChange} placeholder="Jane" />
                <Field label="Last Name"  name="last_name"    value={f.last_name}    editing={editing} onChange={handleFieldChange} placeholder="Doe" />
              </div>
              <Field label="Username"    name="username"     value={profile.username} editing={false} onChange={() => {}} />
              <Field label="Age"         name="age"          value={f.age}           editing={editing} onChange={handleFieldChange} type="number" placeholder="25" />
              <Field label="Location"    name="location"     value={f.location}      editing={editing} onChange={handleFieldChange} icon={<MapPin size={11}/>} placeholder="Kigali, Rwanda" />
              <Field label="Phone"       name="phone_number" value={f.phone_number}  editing={editing} onChange={handleFieldChange} icon={<Phone size={11}/>} type="tel" placeholder="+250 7XX XXX XXX" />
            </Card>

            <Card title="About" icon={<Briefcase size={15} />}>
              <Field label="Tagline" name="details" value={f.details} editing={editing} onChange={handleFieldChange} placeholder="e.g. AI Researcher at RIRI" />
              <Field label="Bio"     name="bio"     value={f.bio}     editing={editing} onChange={handleFieldChange} type="textarea" placeholder="Write a short bio about yourself…" />
              <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.07)' }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.32)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Account</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, padding: '3px 11px', borderRadius: 16, background: profile.is_active !== false ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)', border: `1px solid ${profile.is_active !== false ? 'rgba(16,185,129,.3)' : 'rgba(239,68,68,.3)'}`, color: profile.is_active !== false ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                    {profile.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                  <span style={{ fontSize: 12, padding: '3px 11px', borderRadius: 16, background: `${catColor}18`, border: `1px solid ${catColor}33`, color: catColor, fontWeight: 600 }}>
                    {CATEGORY_LABEL[profile.user_category] || profile.user_category}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Academic */}
        {tab === 'academic' && showAcademic && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 18 }}>
            <Card title="Academic Info" icon={<Award size={15} />}>
              <Field label="University / Institution" name="university_name" value={f.university_name} icon={<BookOpen size={11}/>} editing={editing} onChange={handleFieldChange} placeholder="University of Rwanda" />
              <Field label="ORCID ID" name="orcid" value={f.orcid} editing={editing} onChange={handleFieldChange} placeholder="0000-0000-0000-0000" />
              {!editing && profile.orcid && (
                <a href={`https://orcid.org/${profile.orcid}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#FFD700', textDecoration: 'none', marginTop: -4 }}>
                  View on ORCID <ExternalLink size={12} />
                </a>
              )}
            </Card>
          </div>
        )}

        {/* Documents */}
        {tab === 'documents' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
            {(['cv', 'resume'] as const).map(field => {
              const hasFile = !!profile[field];
              const url     = hasFile ? fileUrl(profile[field]) : '';
              const ref     = field === 'cv' ? cvRef : resumeRef;
              return (
                <Card key={field} title={field === 'cv' ? 'Curriculum Vitae' : 'Resume'} icon={<FileText size={15} />}>
                  {hasFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: 'rgba(255,255,255,.05)', borderRadius: 10, border: '1px solid rgba(255,255,255,.08)', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <FileText size={17} style={{ color: '#FFD700' }} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{field.toUpperCase()} on file</p>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', margin: 0 }}>Saved in database</p>
                        </div>
                      </div>
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
                        Open <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : (
                    <p style={{ color: 'rgba(255,255,255,.28)', fontSize: 13, marginBottom: 14 }}>No {field.toUpperCase()} uploaded yet.</p>
                  )}
                  <button onClick={() => ref.current?.click()} disabled={uploading[field]}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'transparent', border: '1px dashed rgba(255,215,0,.35)', borderRadius: 10, color: 'rgba(255,215,0,.7)', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', width: '100%', justifyContent: 'center' }}>
                    {uploading[field] ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={13} />}
                    {uploading[field] ? 'Uploading…' : hasFile ? `Replace ${field.toUpperCase()}` : `Upload ${field.toUpperCase()}`}
                  </button>
                  <input ref={ref} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => handleFile(e, field)} />
                </Card>
              );
            })}
          </div>
        )}

        {/* Password */}
        {tab === 'password' && (
          <div style={{ maxWidth: 460 }}>
            <Card title="Change Password" icon={<Lock size={15} />}>
              {([
                { key: 'current' as const, label: 'Current Password' },
                { key: 'next'    as const, label: 'New Password' },
                { key: 'confirm' as const, label: 'Confirm New Password' },
              ]).map(({ key, label }) => (
                <div key={key} style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.36)', display: 'block', marginBottom: 7 }}>{label}</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw[key] ? 'text' : 'password'} value={pw[key]} onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))} style={pwInputStyle} placeholder="••••••••" />
                    <button onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', display: 'flex', padding: 0 }}>
                      {showPw[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={handlePasswordChange} disabled={pwSaving || !pw.current || !pw.next || !pw.confirm}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '11px', background: '#FFD700', border: 'none', borderRadius: 12, color: '#000', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}>
                {pwSaving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Lock size={15} />}
                {pwSaving ? 'Changing…' : 'Change Password'}
              </button>
            </Card>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}