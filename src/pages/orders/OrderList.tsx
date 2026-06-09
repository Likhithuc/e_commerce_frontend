import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../../services/order';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { OrderResponse } from '../../types';

export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserOrders({ page, size: 10 })
      .then(data => { setOrders(data.content); setTotalPages(data.totalPages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <LoadingSpinner />;

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-600 bg-yellow-50', CONFIRMED: 'text-blue-600 bg-blue-50',
    SHIPPED: 'text-purple-600 bg-purple-50', DELIVERED: 'text-green-600 bg-green-50',
    CANCELLED: 'text-red-600 bg-red-50',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? <p className="text-gray-500 text-center py-10">No orders yet.</p> : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`} className="block bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || 'text-gray-600 bg-gray-50'}`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-indigo-600 mt-1">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
