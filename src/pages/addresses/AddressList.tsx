import { useState, useEffect } from 'react';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../../services/address';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { AddressResponse } from '../../types';

export default function AddressListPage() {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AddressResponse | null>(null);
  const [form, setForm] = useState({ fullName: '', mobile: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'USA', postalCode: '' });

  const load = () => getAddresses().then(setAddresses).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateAddress(editing.id, form);
    } else {
      await createAddress(form);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ fullName: '', mobile: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'USA', postalCode: '' });
    load();
  };

  const handleEdit = (a: AddressResponse) => {
    setForm(a);
    setEditing(a);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this address?')) return;
    await deleteAddress(id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ fullName: '', mobile: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'USA', postalCode: '' }); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
          Add Address
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
              className="border rounded-lg px-3 py-2" />
            <input required placeholder="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })}
              className="border rounded-lg px-3 py-2" />
          </div>
          <input required placeholder="Address Line 1" value={form.addressLine1} onChange={e => setForm({ ...form, addressLine1: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
          <input placeholder="Address Line 2" value={form.addressLine2} onChange={e => setForm({ ...form, addressLine2: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
          <div className="grid grid-cols-4 gap-3">
            <input required placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
              className="border rounded-lg px-3 py-2" />
            <input required placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
              className="border rounded-lg px-3 py-2" />
            <input required placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
              className="border rounded-lg px-3 py-2" />
            <input required placeholder="Postal Code" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })}
              className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
              {editing ? 'Update' : 'Save'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
              className="border px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}
      {addresses.length === 0 ? <p className="text-gray-500 text-center py-10">No addresses saved.</p> : (
        <div className="space-y-4">
          {addresses.map(a => (
            <div key={a.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="font-medium">{a.fullName} - {a.mobile}</p>
              <p className="text-sm text-gray-600">{a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ''}</p>
              <p className="text-sm text-gray-600">{a.city}, {a.state} {a.postalCode}, {a.country}</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => handleEdit(a)} className="text-indigo-600 text-sm hover:underline">Edit</button>
                <button onClick={() => handleDelete(a.id)} className="text-red-500 text-sm hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
