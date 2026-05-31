'use client';
import { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';

export default function PendingPublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(getApiUrl('/api/admin/publications/pending'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setPublications(await res.json());
    } catch (err) { alert('Failed to load'); }
    setLoading(false);
  };

  const handleAction = async (id, action, data = {}) => {
    const token = localStorage.getItem('token');
    const url = getApiUrl(`/api/admin/publications/${id}/${action}`);
    const method = action === 'delete' ? 'DELETE' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: action === 'delete' ? null : JSON.stringify(data)
      });
      if (res.ok) {
        setPublications(prev => prev.filter(p => p.id !== id));
        setRejectingId(null);
        setFeedback('');
      }
    } catch (err) { alert('Error processing action'); }
  };

  if (loading) return <div className="text-center py-20 text-2xl font-bold">Loading Publications...</div>;

  return (
    <div className="min-h-screen bg-[#E0F2FE] p-8">
      <h1 className="text-3xl font-bold mb-8">Review Publications</h1>
      <div className="grid grid-cols-1 gap-6">
        {publications.map(pub => (
          <div key={pub.id} className="bg-white p-6 rounded-2xl shadow-md border-2 border-black">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                  {pub.publication_type}
                </span>
                <h2 className="text-2xl font-bold mt-2">{pub.title}</h2>
                <p className="text-gray-600 font-medium">Authors: {pub.authors?.join(', ')}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Source: {pub.journal_name || pub.book_title || pub.publisher || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                 <p className="text-xs text-gray-400">Submitted by: {pub.user?.username}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button onClick={() => handleAction(pub.id, 'approve')} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg">Approve</button>
              <button onClick={() => setRejectingId(pub.id)} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg">Reject</button>
              <button onClick={() => handleAction(pub.id, '', 'delete')} className="px-6 py-2 bg-gray-200 font-bold rounded-lg">Delete</button>
            </div>

            {rejectingId === pub.id && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <textarea 
                  className="w-full p-2 border border-red-300 rounded" 
                  placeholder="Reason..." 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button 
                  onClick={() => handleAction(pub.id, 'reject', { feedback })}
                  className="mt-2 bg-red-700 text-white px-4 py-1 rounded"
                >
                  Confirm Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
