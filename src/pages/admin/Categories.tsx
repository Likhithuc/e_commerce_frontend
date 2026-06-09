import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/category';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { CategoryResponse } from '../../types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CategoryResponse | null>(null);
  const [form, setForm] = useState({ name: '', description: '', status: true });

  const load = () => getCategories().then(setCategories).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateCategory(editing.id, form);
    } else {
      await createCategory(form);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', description: '', status: true });
    load();
  };

  const handleEdit = (c: CategoryResponse) => {
    setForm({ name: c.name, description: c.description, status: c.status });
    setEditing(c);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await deleteCategory(id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', status: true }); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">Add Category</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6 space-y-3 max-w-lg">
          <input required placeholder="Category name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" rows={2} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.status} onChange={e => setForm({ ...form, status: e.target.checked })} />
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
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map(c => (
              <tr key={c.id}>
                <td className="px-4 py-3">{c.id}</td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.description || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${c.status ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>
                    {c.status ? 'Active' : 'Inactive'}
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
