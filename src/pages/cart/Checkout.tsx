import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAddresses, createAddress } from '../../services/address';
import { placeOrder } from '../../services/order';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { AddressResponse } from '../../types';

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ fullName: '', mobile: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'USA', postalCode: '' });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    getAddresses().then(addrs => { setAddresses(addrs); setLoading(false); });
  }, [isAuthenticated, navigate]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const addr = await createAddress(newAddr);
    setAddresses([...addresses, addr]);
    setSelectedAddress(addr.id);
    setShowForm(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    setSubmitting(true);
    try {
      const order = await placeOrder({ addressId: selectedAddress, couponCode: couponCode || undefined });
      navigate(`/payment/${order.id}`);
    } catch {
      alert('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="font-semibold mb-4">Shipping Address</h2>
        {addresses.map(a => (
          <label key={a.id} className={`block p-3 border rounded-lg mb-2 cursor-pointer ${selectedAddress === a.id ? 'border-indigo-500 bg-indigo-50' : ''}`}>
            <input type="radio" name="address" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} className="mr-2" />
            {a.fullName}, {a.addressLine1}, {a.city}, {a.state} {a.postalCode}
          </label>
        ))}
        {showForm ? (
          <form onSubmit={handleAddAddress} className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Full Name" value={newAddr.fullName} onChange={e => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="border rounded-lg px-3 py-2" />
              <input required placeholder="Mobile" value={newAddr.mobile} onChange={e => setNewAddr({ ...newAddr, mobile: e.target.value })}
                className="border rounded-lg px-3 py-2" />
            </div>
            <input required placeholder="Address Line 1" value={newAddr.addressLine1} onChange={e => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
            <input placeholder="Address Line 2" value={newAddr.addressLine2} onChange={e => setNewAddr({ ...newAddr, addressLine2: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
            <div className="grid grid-cols-4 gap-3">
              <input required placeholder="City" value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                className="border rounded-lg px-3 py-2" />
              <input required placeholder="State" value={newAddr.state} onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                className="border rounded-lg px-3 py-2" />
              <input required placeholder="Country" value={newAddr.country} onChange={e => setNewAddr({ ...newAddr, country: e.target.value })}
                className="border rounded-lg px-3 py-2" />
              <input required placeholder="Postal Code" value={newAddr.postalCode} onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                className="border rounded-lg px-3 py-2" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="text-indigo-600 text-sm mt-2 hover:underline">+ Add New Address</button>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="font-semibold mb-4">Coupon (optional)</h2>
        <input placeholder="Enter coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)}
          className="w-full border rounded-lg px-3 py-2" />
      </div>
      <button onClick={handlePlaceOrder} disabled={!selectedAddress || submitting}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
        {submitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}
