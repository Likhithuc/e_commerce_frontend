import { useState, useEffect } from 'react';
import { getProducts, createProduct, addProductImages, deleteProduct } from '../../services/product';
import { getCategories } from '../../services/category';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { ProductResponse, CategoryResponse } from '../../types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', sku: '', price: '', salePrice: '',
    stockQuantity: '', brand: '', status: true, categoryId: '',
  });
  const [images, setImages] = useState<File[]>([]);

  const load = () => {
    setLoading(true);
    getProducts({ page, size: 10 })
      .then(data => { setProducts(data.content); setTotalPages(data.totalPages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); getCategories().then(setCategories).catch(() => {}); }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const product = await createProduct({
        name: form.name,
        description: form.description || undefined,
        sku: form.sku,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stockQuantity: Number(form.stockQuantity),
        brand: form.brand || undefined,
        status: form.status,
        categoryId: Number(form.categoryId),
      });
      if (images.length > 0) {
        await addProductImages(product.id, images);
      }
      setShowForm(false);
      setForm({ name: '', description: '', sku: '', price: '', salePrice: '', stockQuantity: '', brand: '', status: true, categoryId: '' });
      setImages([]);
      load();
    } catch {
      alert('Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU *</label>
              <input required value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input required type="number" step="0.01" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sale Price</label>
              <input type="number" step="0.01" value={form.salePrice}
                onChange={e => setForm({ ...form, salePrice: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
              <input required type="number" value={form.stockQuantity}
                onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="w-full border rounded-lg px-3 py-2">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Images</label>
              <input type="file" multiple accept="image/*"
                onChange={e => setImages(Array.from(e.target.files || []))}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" rows={3} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.status} onChange={e => setForm({ ...form, status: e.target.checked })} />
            <span className="text-sm">Active</span>
          </label>
          <button type="submit" disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">SKU</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                <td className="px-4 py-3">${(p.salePrice || p.price).toFixed(2)}</td>
                <td className="px-4 py-3">{p.stockQuantity}</td>
                <td className="px-4 py-3 text-gray-500">{p.categoryName}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.status ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>
                    {p.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
