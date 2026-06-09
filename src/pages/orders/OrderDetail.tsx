import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../../services/order';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { OrderResponse } from '../../types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(Number(id)).then(o => { setOrder(o); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    await cancelOrder(Number(id));
    const updated = await getOrderById(Number(id));
    setOrder(updated);
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <p className="text-center py-20">Order not found</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order {order.orderNumber}</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Status:</span> <span className="font-medium">{order.status}</span></div>
          <div><span className="text-gray-500">Payment:</span> <span className="font-medium">{order.paymentStatus}</span></div>
          <div><span className="text-gray-500">Total:</span> <span className="font-bold text-indigo-600">${order.totalAmount.toFixed(2)}</span></div>
          <div><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="font-semibold mb-3">Shipping Address</h2>
        <p className="text-sm">{order.shippingAddress.fullName}</p>
        <p className="text-sm">{order.shippingAddress.addressLine1}</p>
        {order.shippingAddress.addressLine2 && <p className="text-sm">{order.shippingAddress.addressLine2}</p>}
        <p className="text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
        <p className="text-sm">{order.shippingAddress.country}</p>
      </div>
      <div className="space-y-4 mb-6">
        <h2 className="font-semibold">Items</h2>
        {order.items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4">
            <img src={item.productImage || 'https://placehold.co/60x60'} alt={item.productName}
              className="w-14 h-14 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.productName}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
            </div>
            <p className="font-semibold">${item.subTotal.toFixed(2)}</p>
          </div>
        ))}
      </div>
      {order.status === 'PENDING' && (
        <button onClick={handleCancel} className="w-full border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50">
          Cancel Order
        </button>
      )}
      <button onClick={() => navigate('/orders')} className="w-full mt-2 text-gray-500 text-sm hover:underline">
        Back to Orders
      </button>
    </div>
  );
}
