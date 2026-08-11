'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getApiUrl } from '@/utils/api';

export default function ResearcherProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    Position: '',
    institution: '',
    location: '',
    qualification: '',
    graduation_university: '',
    graduation_country: '',
    Field: '',
    ResearchArea: '',
    orcid: '',
    bio: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const requiredFields = [
    'Position',
    'institution',
    'location',
    'qualification',
    'graduation_university',
    'graduation_country',
    'Field',
    'ResearchArea',
    'bio',
  ];

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    // TODO: wire this to your existing profile-photo upload endpoint,
    // the same one used on the researcher dashboard's photo upload/removal.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const newErrors: Record<string, boolean> = {};
    requiredFields.forEach((f) => {
      if (!formData[f as keyof typeof formData]?.trim()) newErrors[f] = true;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!uid || !token) {
      setApiError('This link is missing required info. Please sign up again.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`/profile/${uid}/complete-researcher`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...formData }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Could not save profile');
      }

      setSuccess(true);
      setTimeout(() => router.push('/'), 1800);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name: string) =>
    `w-full border rounded-[3px] bg-[#F7F5EF] px-3 py-2.5 text-[14.5px] outline-none transition-colors focus:border-[#B8863B] focus:bg-white ${
      errors[name] ? 'border-[#B3402E]' : 'border-[#C8C3B2]'
    }`;

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1C2B39] px-5 py-14">
      <div className="max-w-[640px] mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-[#8A6428] mb-2">
            RIRI &middot; Researcher directory
          </p>
          <h1 className="font-serif text-[34px] leading-[1.15] mb-2">Researcher profile</h1>
          <p className="text-[15px] text-[#6B6F76] max-w-[46ch]">
            Tell viewers who you are, and your academic and research focus. This appears on
            your public RIRI researcher profile.
          </p>
        </div>

        {success ? (
          <div className="bg-white border border-[#DEDACD] border-l-[3px] border-l-[#2F5233] rounded p-6">
            <p className="font-serif text-base text-[#2F5233] mb-1.5">Profile saved</p>
            <p className="text-sm text-[#6B6F76]">
              Your researcher profile is ready. Redirecting you now…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-[#DEDACD] rounded-[4px]">
            <div className="flex items-center gap-5 px-10 py-8 border-b border-[#DEDACD]">
              <label
                htmlFor="photoInput"
                className="w-[84px] h-[84px] rounded-full border-[1.5px] border-dashed border-[#C8C3B2] flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden bg-[#F7F5EF]"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="text-[11px] text-[#6B6F76]">Photo</span>
                )}
              </label>
              <input type="file" id="photoInput" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <div>
                <p className="text-sm font-medium">Profile photo</p>
                <p className="text-xs text-[#6B6F76] mt-0.5">Square image, at least 400&times;400px.</p>
              </div>
            </div>

            <div className="px-10 py-7 border-b border-[#DEDACD]">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-serif text-[13px] text-[#8A6428]">I</span>
                <span className="font-serif text-[17px]">Affiliation</span>
              </div>
              <Field label="Position" name="Position" value={formData.Position} onChange={handleChange} className={inputClass('Position')} placeholder="Senior lecturer, IT-Networking" />
              <Field label="Affiliation institution" name="institution" value={formData.institution} onChange={handleChange} className={inputClass('institution')} placeholder="University of Lay Adventists of Kigali" />
              <Field label="Current location" name="location" value={formData.location} onChange={handleChange} className={inputClass('location')} placeholder="Kigali, Rwanda" last />
            </div>

            <div className="px-10 py-7 border-b border-[#DEDACD]">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-serif text-[13px] text-[#8A6428]">II</span>
                <span className="font-serif text-[17px]">Academic credentials</span>
              </div>
              <div className="grid grid-cols-2 gap-3.5 mb-4">
                <Field label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} className={inputClass('qualification')} placeholder="EngD, Computer Science" bare />
                <Field label="Graduation university" name="graduation_university" value={formData.graduation_university} onChange={handleChange} className={inputClass('graduation_university')} placeholder="Xi'an University of Technology" bare />
              </div>
              <Field label="Country" name="graduation_country" value={formData.graduation_country} onChange={handleChange} className={inputClass('graduation_country')} placeholder="China" last />
            </div>

            <div className="px-10 py-7 border-b border-[#DEDACD]">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-serif text-[13px] text-[#8A6428]">III</span>
                <span className="font-serif text-[17px]">Research focus</span>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <Field label="Research field" name="Field" value={formData.Field} onChange={handleChange} className={inputClass('Field')} placeholder="Computer Science" bare last />
                <Field label="Research area" name="ResearchArea" value={formData.ResearchArea} onChange={handleChange} className={inputClass('ResearchArea')} placeholder="Network security, privacy-preserving AI" bare last />
              </div>
            </div>

            <div className="px-10 py-7 border-b border-[#DEDACD]">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-serif text-[13px] text-[#8A6428]">IV</span>
                <span className="font-serif text-[17px]">Academic identity</span>
              </div>
              <div>
                <label className="block text-[12.5px] font-medium text-[#6B6F76] mb-1.5">
                  Platform ID <span className="italic font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.orcid}
                  onChange={(e) => handleChange('orcid', e.target.value)}
                  placeholder="e.g. ORCID | ResearchID | SciProfiles | Etc"
                  className={`${inputClass('orcid')} font-mono text-[13.5px]`}
                />
              </div>
            </div>

            <div className="px-10 py-7 border-b border-[#DEDACD]">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-serif text-[13px] text-[#8A6428]">V</span>
                <span className="font-serif text-[17px]">About</span>
              </div>
              <div>
                <label className="block text-[12.5px] font-medium text-[#6B6F76] mb-1.5">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  maxLength={600}
                  placeholder="Summarize your research focus, key projects, and what you're looking to collaborate on."
                  className={`${inputClass('bio')} min-h-[96px] resize-y leading-[1.55]`}
                />
                <span className="block text-right text-[11.5px] text-[#6B6F76] font-mono mt-1">
                  {formData.bio.length}/600
                </span>
              </div>
            </div>

            <div className="px-10 py-6 flex items-center justify-between gap-4">
              <p className="text-[12.5px] text-[#6B6F76] max-w-[30ch]">
                Fields marked optional can be left blank. Everything else is required for your listing.
              </p>
              {apiError && <p className="text-sm text-[#B3402E]">{apiError}</p>}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1C2B39] text-white text-[14.5px] font-medium rounded-[3px] px-6 py-3 hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-60"
              >
                {loading ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  className,
  placeholder,
  bare,
  last,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  className: string;
  placeholder: string;
  bare?: boolean;
  last?: boolean;
}) {
  return (
    <div className={bare ? '' : `${last ? '' : 'mb-4'}`}>
      <label className="block text-[12.5px] font-medium text-[#6B6F76] mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}