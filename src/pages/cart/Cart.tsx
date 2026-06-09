import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../services/cart';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { CartResponse } from '../../types';

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCart = () => getCart().then(setCart).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { loadCart(); }, []);

  const handleUpdate = async (itemId: number, productId: number, quantity: number) => {
    await updateCartItem(itemId, { productId, quantity });
    loadCart();
  };

  const handleRemove = async (itemId: number) => {
    await removeCartItem(itemId);
    loadCart();
  };

  const handleClear = async () => {
    await clearCart();
    loadCart();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        {cart && cart.items.length > 0 && (
          <button onClick={handleClear} className="text-red-500 text-sm hover:underline">Clear Cart</button>
        )}
      </div>
      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link to="/products" className="text-indigo-600 hover:underline mt-2 block">Continue Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.items.map(item => {
            const price = item.salePrice || item.price;
            return (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4">
                <img src={item.productImage || 'https://placehold.co/80x80'} alt={item.productName}
                  className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <Link to={`/products/${item.productId}`} className="font-medium hover:text-indigo-600">{item.productName}</Link>
                  <p className="text-sm text-gray-500">${price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => handleUpdate(item.id, item.productId, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100">-</button>
                  <span className="px-4 py-1 border-x">{item.quantity}</span>
                  <button onClick={() => handleUpdate(item.id, item.productId, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100">+</button>
                </div>
                <p className="font-semibold w-24 text-right">${item.subTotal.toFixed(2)}</p>
                <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}
          <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-bold text-indigo-600">${cart.totalAmount.toFixed(2)}</span>
          </div>
          <Link to="/checkout"
            className="block w-full bg-indigo-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-indigo-700">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
