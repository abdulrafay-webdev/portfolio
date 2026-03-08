'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Contact } from '@/types';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, unread: 0 });
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [contactsData, statsData] = await Promise.all([
        adminApi.getContacts(),
        adminApi.getContactStats(),
      ]);
      setContacts(contactsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleViewContact(id: string) {
    try {
      const contact = await adminApi.getContact(id);
      setSelectedContact(contact);
      setModalOpen(true);
      // Update local state to reflect read status
      setContacts(contacts.map(c => 
        c.id === id ? { ...c, is_read: true, status: c.status === 'new' ? 'read' : c.status } : c
      ));
    } catch (error) {
      console.error('Failed to load contact:', error);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      await adminApi.updateContact(id, { status: newStatus });
      setContacts(contacts.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this message? This cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      await adminApi.deleteContact(id);
      setContacts(contacts.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete contact:', error);
    } finally {
      setDeleting(null);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'new': return 'bg-[#00E5FF]/10 text-[#00E5FF]';
      case 'read': return 'bg-gray-100 text-gray-600';
      case 'replied': return 'bg-green-100 text-green-600';
      case 'archived': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  const filteredContacts = filter === 'all' 
    ? contacts 
    : contacts.filter(c => c.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Contact Messages</h2>
        <p className="text-gray-600 mt-1">Manage inquiries from your visitors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">New</p>
          <p className="text-3xl font-bold text-[#00E5FF]">{stats.new}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Read</p>
          <p className="text-3xl font-bold text-gray-600">{stats.read}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Unread</p>
          <p className="text-3xl font-bold text-red-500">{stats.unread}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'new', 'read', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#7B00FF] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className={`hover:bg-gray-50 transition-colors ${!contact.is_read ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 truncate max-w-xs">{contact.subject}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewContact(contact.id)}
                        className="px-3 py-1.5 bg-[#00E5FF]/10 text-[#00E5FF] text-sm font-medium rounded-lg hover:bg-[#00E5FF]/20 transition-colors"
                      >
                        View
                      </button>
                      <select
                        value={contact.status}
                        onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00E5FF] outline-none"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        disabled={deleting === contact.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleting === contact.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600">No contact messages yet</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Message Details</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">From</p>
                <p className="font-semibold text-gray-900">{selectedContact.name}</p>
                <p className="text-sm text-gray-600">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Subject</p>
                <p className="font-semibold text-gray-900">{selectedContact.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="text-gray-900">{new Date(selectedContact.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedContact.status)}`}>
                  {selectedContact.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  handleStatusChange(selectedContact.id, 'replied');
                  setModalOpen(false);
                }}
                className="flex-1 px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
              >
                Mark as Replied
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
