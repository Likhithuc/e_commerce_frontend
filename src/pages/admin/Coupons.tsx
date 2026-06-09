import { useState, useEffect } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/coupon';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { CouponResponse } from '../../types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CouponResponse | null>(null);
  const [form, setForm] = useState({ code: '', discountPercentage: 0, startDate: '', endDate: '', active: true });

  const load = () => getCoupons().then(setCoupons).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, discountPercentage: Number(form.discountPercentage) };
    if (editing) {
      await updateCoupon(editing.id, data);
    } else {
      await createCoupon(data as unknown as Omit<CouponResponse, 'id'>);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ code: '', discountPercentage: 0, startDate: '', endDate: '', active: true });
    load();
  };

  const handleEdit = (c: CouponResponse) => {
    setForm({ code: c.code, discountPercentage: c.discountPercentage, startDate: c.startDate, endDate: c.endDate, active: c.active });
    setEditing(c);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this coupon?')) return;
    await deleteCoupon(id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ code: '', discountPercentage: 0, startDate: '', endDate: '', active: true }); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">Add Coupon</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6 space-y-3 max-w-lg">
          <input required placeholder="Coupon code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
          <input required type="number" step="0.01" placeholder="Discount percentage" value={form.discountPercentage}
            onChange={e => setForm({ ...form, discountPercentage: Number(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start Date</label>
              <input required type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">End Date</label>
              <input required type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
            <span className="text-sm">Active</span>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
              {editing ? 'Update' : 'Save'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
              className="border px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Discount</th>
              <th className="text-left px-4 py-3">Start</th>
              <th className="text-left px-4 py-3">End</th>
              <th className="text-left px-4 py-3">Active</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map(c => (
              <tr key={c.id}>
                <td className="px-4 py-3">{c.id}</td>
                <td className="px-4 py-3 font-mono">{c.code}</td>
                <td className="px-4 py-3">{c.discountPercentage}%</td>
                <td className="px-4 py-3">{c.startDate}</td>
                <td className="px-4 py-3">{c.endDate}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${c.active ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(c)} className="text-indigo-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
