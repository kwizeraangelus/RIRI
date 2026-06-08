'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/utils/api';

export default function CreateResearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    authors: [''],
    journal_name: '',
    conference_info: '',
    doi: '',
    url: '',
    publisher: '',
    publication_type: 'journal',
    status: true,
    assignToExpert: false,        // New: Simple Yes/No
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, assignToExpert: e.target.value === 'yes' }));
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData(prev => ({ ...prev, authors: newAuthors }));
  };

  const addAuthor = () => {
    setFormData(prev => ({ ...prev, authors: [...prev.authors, ''] }));
  };

  const removeAuthor = (index: number) => {
    if (formData.authors.length > 1) {
      setFormData(prev => ({
        ...prev,
        authors: prev.authors.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...formData,
      authors: formData.authors.filter(a => a.trim() !== ''),
      assignedToExpertId: null,   // Not assigning specific expert for now
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl('/api/researches'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        alert('Research created successfully!');
        router.push('/admin/research-list');
      } else {
        const err = await res.json();
        alert('Error: ' + (err.message || 'Failed to create research'));
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Research</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-semibold mb-2">Research Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
              placeholder="Enter research title"
            />
          </div>

          {/* Authors Section */}
          <div>
            <label className="block text-sm font-semibold mb-2">Authors</label>
            {formData.authors.map((author, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => handleAuthorChange(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                  placeholder={`Author ${index + 1}`}
                />
                {index === formData.authors.length - 1 ? (
                  <button type="button" onClick={addAuthor} className="px-4 bg-green-600 text-white rounded-lg">+</button>
                ) : (
                  <button type="button" onClick={() => removeAuthor(index)} className="px-4 bg-red-600 text-white rounded-lg">×</button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Publication Type</label>
            <select
              name="publication_type"
              value={formData.publication_type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="journal">Journal</option>
              <option value="conference">Conference</option>
              <option value="book">Book</option>
              <option value="symposium">Symposium</option>
              <option value="patent">Patent</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Journal Name</label>
              <input type="text" name="journal_name" value={formData.journal_name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Conference Info</label>
              <input type="text" name="conference_info" value={formData.conference_info} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Publisher</label>
              <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">DOI</label>
              <input type="text" name="doi" value={formData.doi} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">URL / Link</label>
            <input type="url" name="url" value={formData.url} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>

          {/* Assign to Expert - Radio Button */}
          <div>
            <label className="block text-sm font-semibold mb-3">Assign this research to an Expert?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="assignToExpert"
                  value="yes"
                  checked={formData.assignToExpert === true}
                  onChange={handleRadioChange}
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="assignToExpert"
                  value="no"
                  checked={formData.assignToExpert === false}
                  onChange={handleRadioChange}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create Research'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}