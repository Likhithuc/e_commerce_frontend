import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/order';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { OrderResponse } from '../../types';

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = async (p: number) => {
    setLoading(true);
    try {
      const data = await getAllOrders({ page: p, size: 10 });
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const handleStatus = async (id: number, status: string) => {
    await updateOrderStatus(id, status);
    load(page);
  };

  const badgeClass = (s: string) => {
    const map: Record<string, string> = {
      PENDING: 'text-yellow-600 bg-yellow-50',
      CONFIRMED: 'text-blue-600 bg-blue-50',
      SHIPPED: 'text-purple-600 bg-purple-50',
      DELIVERED: 'text-green-600 bg-green-50',
      CANCELLED: 'text-red-600 bg-red-50',
    };
    return map[s] || 'text-gray-600 bg-gray-50';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-3 font-medium">Order</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <Link to={`/orders/${order.id}`} className="text-indigo-600 hover:underline font-medium">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${badgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {order.status === 'CANCELLED' || order.status === 'DELIVERED' ? (
                      <span className="text-xs text-gray-400">No actions</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {STATUSES.filter(s => {
                          const idx = STATUSES.indexOf(order.status);
                          return STATUSES.indexOf(s) > idx;
                        }).concat('CANCELLED').map(s => (
                          <button key={s} onClick={() => handleStatus(order.id, s)}
                            className={`text-xs px-2 py-1 rounded border hover:opacity-80 ${
                              s === 'CANCELLED' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-30">Prev</button>
          <span className="px-3 py-1 text-sm">Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
