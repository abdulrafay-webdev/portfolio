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
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Contact Messages</h2>
        <p className="text-gray-600 mt-1">Messages from visitors</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                    <button onClick={() => handleViewContact(contact.id)} className="px-3 py-1.5 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg hover:bg-[#00E5FF]/20">View</button>
                    <button onClick={() => handleDelete(contact.id)} disabled={deleting === contact.id} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No messages yet</p>
          </div>
        )}
      </div>

      {modalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Message Details</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div><p className="text-sm text-gray-500">From</p><p className="font-semibold">{selectedContact.name}</p><p className="text-sm text-gray-600">{selectedContact.email}</p></div>
              <div><p className="text-sm text-gray-500">Subject</p><p className="font-semibold">{selectedContact.subject}</p></div>
              <div><p className="text-sm text-gray-500">Date</p><p className="text-gray-900">{new Date(selectedContact.created_at).toLocaleString()}</p></div>
              <div><p className="text-sm text-gray-500">Message</p><div className="p-4 bg-gray-50 rounded-xl"><p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p></div></div>
            </div>
            <div className="p-6 border-t">
              <button onClick={() => setModalOpen(false)} className="w-full px-6 py-3 bg-[#00E5FF] text-black font-semibold rounded-lg hover:bg-[#00E5FF]/90">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
