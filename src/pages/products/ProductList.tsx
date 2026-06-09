import { useState, useEffect } from 'react';
import { searchProducts } from '../../services/product';
import { getCategories } from '../../services/category';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { ProductResponse, CategoryResponse } from '../../types';

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', category: '', brand: '', minPrice: '', maxPrice: '', sortBy: '' });

  useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number | undefined> = { page, size: 12 };
    if (filters.name) params.name = filters.name;
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    searchProducts(params)
      .then(data => { setProducts(data.content); setTotalPages(data.totalPages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, filters]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input placeholder="Search by name..." value={filters.name}
          onChange={e => { setFilters({ ...filters, name: e.target.value }); setPage(0); }}
          className="border rounded-lg px-3 py-2" />
        <select value={filters.category}
          onChange={e => { setFilters({ ...filters, category: e.target.value }); setPage(0); }}
          className="border rounded-lg px-3 py-2">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Min price" type="number" value={filters.minPrice}
          onChange={e => { setFilters({ ...filters, minPrice: e.target.value }); setPage(0); }}
          className="border rounded-lg px-3 py-2" />
        <input placeholder="Max price" type="number" value={filters.maxPrice}
          onChange={e => { setFilters({ ...filters, maxPrice: e.target.value }); setPage(0); }}
          className="border rounded-lg px-3 py-2" />
      </div>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {products.length === 0 && <p className="text-center text-gray-500 mt-10">No products found.</p>}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
