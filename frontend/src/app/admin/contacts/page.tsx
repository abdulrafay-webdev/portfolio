'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Contact } from '@/types';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await adminApi.getContacts();
      setContacts(data);
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
    } catch (error) {
      console.error('Failed to load contact:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this message?')) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Messages from visitors</p>
        </div>
      </div>

      {/* Contacts List - Mobile Responsive */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </td>
                  <td className="px-6 py-4">{contact.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleViewContact(contact.id)} className="px-3 py-1.5 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg hover:bg-[#00E5FF]/20 text-sm font-medium">View</button>
                      <button onClick={() => handleDelete(contact.id)} disabled={deleting === contact.id} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        {deleting === contact.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {contacts.map((contact) => (
            <div key={contact.id} className="p-4 space-y-3">
              <div>
                <p className="font-semibold text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{contact.subject}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(contact.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => handleViewContact(contact.id)} className="flex-1 px-3 py-2 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg hover:bg-[#00E5FF]/20 text-sm font-medium">View</button>
                <button onClick={() => handleDelete(contact.id)} disabled={deleting === contact.id} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg">
                  {deleting === contact.id ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600">No messages yet</p>
          </div>
        )}
      </div>

      {/* Modal - Mobile Responsive */}
      {modalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg sm:text-xl font-bold">Message Details</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div><p className="text-xs sm:text-sm text-gray-500">From</p><p className="font-semibold">{selectedContact.name}</p><p className="text-sm text-gray-600">{selectedContact.email}</p></div>
              <div><p className="text-xs sm:text-sm text-gray-500">Subject</p><p className="font-semibold">{selectedContact.subject}</p></div>
              <div><p className="text-xs sm:text-sm text-gray-500">Date</p><p className="text-sm text-gray-900">{new Date(selectedContact.created_at).toLocaleString()}</p></div>
              <div><p className="text-xs sm:text-sm text-gray-500">Message</p><div className="p-3 sm:p-4 bg-gray-50 rounded-xl"><p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p></div></div>
            </div>
            <div className="p-4 sm:p-6 border-t sticky bottom-0 bg-white">
              <button onClick={() => setModalOpen(false)} className="w-full px-6 py-3 bg-[#00E5FF] text-black font-semibold rounded-lg hover:bg-[#00E5FF]/90">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
