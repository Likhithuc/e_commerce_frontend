import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../services/product';
import { addToWishlist } from '../../services/wishlist';
import { addItemToCart } from '../../services/cart';
import { getProductReviews, addReview } from '../../services/review';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { imageUrl } from '../../utils/imageUrl';
import type { ProductResponse, ReviewResponse } from '../../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getProductById(Number(id)).then(p => { setProduct(p); setLoading(false); });
    getProductReviews(Number(id)).then(setReviews).catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    await addItemToCart({ productId: Number(id), quantity });
    navigate('/cart');
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    await addToWishlist(Number(id));
    alert('Added to wishlist!');
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    const review = await addReview({ productId: Number(id), rating, comment });
    setReviews([review, ...reviews]);
    setComment('');
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <p className="text-center py-20">Product not found</p>;

  const image = imageUrl(product.images?.[0]) || 'https://placehold.co/600x600?text=No+Image';
  const price = product.salePrice || product.price;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={image} alt={product.name} className="w-full rounded-lg shadow-sm" />
        <div>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
          <div className="mt-4">
            <span className="text-3xl font-bold text-indigo-600">${price.toFixed(2)}</span>
            {product.salePrice && <span className="ml-2 text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>}
          </div>
          <p className="text-gray-600 mt-4">{product.description}</p>
          <p className="text-sm mt-2">
            Category: <span className="font-medium">{product.categoryName}</span>
          </p>
          <p className="text-sm mt-1">
            Stock: {product.stockQuantity > 0
              ? <span className="text-green-600">{product.stockQuantity} available</span>
              : <span className="text-red-600">Out of stock</span>}
          </p>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100">-</button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100">+</button>
            </div>
            <button onClick={handleAddToCart} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Add to Cart
            </button>
            <button onClick={handleAddToWishlist} className="border px-4 py-2 rounded-lg hover:bg-gray-50">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        {isAuthenticated && (
          <form onSubmit={handleReview} className="bg-white p-4 rounded-lg shadow-sm border mb-6 space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Rating:</label>
              <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border rounded px-2 py-1">
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <textarea placeholder="Write a review..." value={comment} onChange={e => setComment(e.target.value)}
              className="w-full border rounded-lg px-3 py-2" rows={3} />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
              Submit Review
            </button>
          </form>
        )}
        {reviews.length === 0 ? <p className="text-gray-500">No reviews yet.</p> : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between">
                  <span className="font-medium">{r.userName}</span>
                  <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p className="text-gray-600 mt-1">{r.comment}</p>}
                <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
