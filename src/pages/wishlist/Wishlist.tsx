import { useState, useEffect } from 'react';
import { getWishlist, removeFromWishlist } from '../../services/wishlist';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { WishlistResponse } from '../../types';

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => getWishlist().then(setItems).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleRemove = async (id: number) => {
    await removeFromWishlist(id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Your wishlist is empty. <Link to="/products" className="text-indigo-600 hover:underline">Browse products</Link></p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <Link to={`/products/${item.productId}`}>
                <img src={item.productImage || 'https://placehold.co/300x300'} alt={item.productName}
                  className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4">
                <Link to={`/products/${item.productId}`} className="font-medium hover:text-indigo-600">{item.productName}</Link>
                <p className="font-bold text-indigo-600 mt-1">${(item.salePrice || item.price).toFixed(2)}</p>
                <button onClick={() => handleRemove(item.id)} className="text-red-500 text-sm mt-2 hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
