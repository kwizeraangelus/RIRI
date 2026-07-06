'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';
import { Mail, MailOpen, Trash2, Reply, X, ChevronLeft, RefreshCw } from 'lucide-react';

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/messages'), { headers: authHeaders });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    setShowReply(false);
    setReplyText('');
    if (!msg.is_read) {
      await fetch(getApiUrl(`/api/admin/messages/${msg.id}/read`), {
        method: 'PATCH',
        headers: authHeaders,
      });
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch(getApiUrl(`/api/admin/messages/${id}`), {
      method: 'DELETE',
      headers: authHeaders,
    });
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selected) return;
    setSending(true);
    try {
      await fetch(getApiUrl(`/api/admin/messages/${selected.id}/reply`), {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ reply: replyText }),
      });
      setShowReply(false);
      setReplyText('');
      alert('Reply sent successfully!');
    } catch {
      alert('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Mail className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition text-sm"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6 h-[calc(100vh-140px)]">

          {/* Left — Message List */}
          <div className={`${selected ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 flex-shrink-0`}>
            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
              {(['all', 'unread', 'read'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                    filter === f
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f} {f === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center py-20 text-slate-400 animate-pulse">Loading messages...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <Mail size={48} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400">No messages yet</p>
                </div>
              ) : (
                filtered.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`cursor-pointer rounded-xl p-4 border transition ${
                      selected?.id === msg.id
                        ? 'bg-blue-50 border-blue-300 shadow'
                        : msg.is_read
                        ? 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm'
                        : 'bg-white border-blue-200 shadow-sm hover:shadow'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        {!msg.is_read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                        )}
                        <span className={`text-sm ${msg.is_read ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                          {msg.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                        {formatDate(msg.created_at).split(',')[0]}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${msg.is_read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-1">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right — Message Detail */}
          <div className={`${selected ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
            {!selected ? (
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <MailOpen size={56} className="mb-4 text-slate-300" />
                <p className="text-lg">Select a message to read</p>
              </div>
            ) : (
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-lg flex flex-col overflow-hidden">
                {/* Detail Header */}
                <div className="p-6 border-b border-slate-200">
                  <div className="flex justify-between items-start">
                    <button
                      onClick={() => setSelected(null)}
                      className="md:hidden flex items-center gap-1 text-blue-600 text-sm mb-3"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{selected.subject}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                          {selected.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{selected.name}</p>
                          <a href={`mailto:${selected.email}`} className="text-xs text-blue-600 hover:underline">
                            {selected.email}
                          </a>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{formatDate(selected.created_at)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowReply(!showReply)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                      >
                        <Reply size={15} /> Reply
                      </button>
                      <button
                        onClick={() => deleteMessage(selected.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="bg-slate-50 rounded-xl p-5 text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                    {selected.message}
                  </div>
                </div>

                {/* Reply Box */}
                {showReply && (
                  <div className="p-6 border-t border-slate-200 bg-slate-50">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-semibold text-slate-700">
                        Reply to {selected.name} ({selected.email})
                      </p>
                      <button onClick={() => setShowReply(false)}>
                        <X size={16} className="text-slate-400 hover:text-slate-600" />
                      </button>
                    </div>
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-none bg-white"
                      placeholder="Type your reply..."
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={sendReply}
                        disabled={sending || !replyText.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
                      >
                        <Reply size={15} />
                        {sending ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}