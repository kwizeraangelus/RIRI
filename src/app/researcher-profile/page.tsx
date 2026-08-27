'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { getApiUrl } from '@/utils/api';

export default function ResearcherProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Loading…</p>
        </div>
      }
    >
      <ResearcherProfileForm />
    </Suspense>
  );
}

function ResearcherProfileForm() {
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
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name: string) =>
    `w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-green-500 text-lg outline-none transition-colors ${
      errors[name] ? 'border-red-400' : 'border-gray-300'
    }`;

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-20 px-6">
        <div className="w-full max-w-md bg-white text-black rounded-2xl shadow-2xl p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <UserPlus size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Profile saved</h2>
          <p className="text-gray-600">
            We just sent a confirmation link to your email. Click it to activate your account,
            then log in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F2FE] py-14 px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto bg-white text-black rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserPlus className="text-green-600" size={32} />
            Researcher profile
          </h1>
          <p className="text-gray-600 mt-2">
            Tell viewers who you are, your academic and research focus. This appears on
            your public RIRI researcher profile.
          </p>
        </div>

        {apiError && (
          <div className="mx-8 mt-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <div className="p-8 space-y-8">
          <div className="flex items-center gap-5">
            <label
              htmlFor="photoInput"
              className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden bg-gray-50 hover:border-green-500 transition-colors"
            >
              {avatarPreview ? (
                <img src={avatarPreview} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-xs text-gray-500">Photo</span>
              )}
            </label>
            <input
              type="file"
              id="photoInput"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <div>
              <p className="text-lg font-semibold">Profile photo</p>
              <p className="text-sm text-gray-500 mt-0.5">Square image, at least 400&times;400px.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-green-700">Affiliation</h2>
            <Field
              label="Position"
              name="Position"
              value={formData.Position}
              onChange={handleChange}
              className={inputClass('Position')}
              placeholder="e.g. Senior lecturer"
            />
            <Field
              label="Affiliation institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className={inputClass('institution')}
              placeholder="e.g. Institution name"
            />
            <Field
              label="Current location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClass('location')}
              placeholder="e.g. Kigali, Rwanda"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-green-700">Academic credentials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className={inputClass('qualification')}
                placeholder="e.g. EngD, PhD"
              />
              <Field
                label="Graduation university"
                name="graduation_university"
                value={formData.graduation_university}
                onChange={handleChange}
                className={inputClass('graduation_university')}
                placeholder="e.g. University of Rwanda"
              />
            </div>
            <Field
              label="Country"
              name="graduation_country"
              value={formData.graduation_country}
              onChange={handleChange}
              className={inputClass('graduation_country')}
              placeholder="e.g. Rwanda"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-green-700">Research focus</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Research field"
                name="Field"
                value={formData.Field}
                onChange={handleChange}
                className={inputClass('Field')}
                placeholder=""
              />
              <Field
                label="Research area"
                name="ResearchArea"
                value={formData.ResearchArea}
                onChange={handleChange}
                className={inputClass('ResearchArea')}
                placeholder=""
              />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-green-700">Academic identity</h2>
            <label className="block text-sm font-medium text-gray-600">
              Platform ID <span className="italic font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.orcid}
              onChange={(e) => handleChange('orcid', e.target.value)}
              placeholder="e.g. ORCID | ResearchID | SciProfiles | Etc"
              className={inputClass('orcid')}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-green-700">About</h2>
            <label className="block text-sm font-medium text-gray-600">Bio<span className="italic font-normal">(optional)</span></label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              maxLength={600}
              placeholder="Summarize your research focus, key projects, and what you're looking to collaborate on."
              className={`${inputClass('bio')} min-h-[110px] resize-y leading-relaxed`}
            />
            <span className="block text-right text-xs text-gray-500 font-mono">
              {formData.bio.length}/600
            </span>
          </div>

          <p className="text-sm text-gray-500">
            Fields marked optional can be left blank. Everything else is required for your listing.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-bold text-lg rounded-xl transition-all bg-gradient-to-r from-green-500 to-emerald-600 text-white disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Submit'}
          </button>
        </div>
      </form>
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  className: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
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