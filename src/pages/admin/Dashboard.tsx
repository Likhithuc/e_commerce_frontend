import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/product';
import { getLowStockItems } from '../../services/inventory';
import { getCustomersReport, getInventoryReport } from '../../services/report';
import { getUserOrders } from '../../services/order';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { OrderResponse, InventoryResponse } from '../../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, customers: 0, orders: 0, lowStock: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<OrderResponse[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ page: 0, size: 1 }).catch(() => ({ totalElements: 0 } as unknown as Awaited<ReturnType<typeof getProducts>>)),
      getInventoryReport().catch(() => ({ data: {} as Record<string, number> })),
      getCustomersReport().catch(() => ({ data: {} as Record<string, number> })),
      getUserOrders({ page: 0, size: 5 }).catch(() => ({ content: [], totalElements: 0 } as unknown as Awaited<ReturnType<typeof getUserOrders>>)),
      getLowStockItems(10).catch(() => []),
    ]).then(([products, invReport, custReport, orders, lowStock]) => {
      setStats({
        products: products.totalElements || 0,
        categories: (invReport.data as Record<string, number>)?.totalCategories || 0,
        customers: (custReport.data as Record<string, number>)?.totalCustomers || 0,
        orders: orders.totalElements || 0,
        lowStock: lowStock.length,
        revenue: (custReport.data as Record<string, number>)?.totalOrders || 0,
      });
      setRecentOrders(orders.content || []);
      setLowStockItems(lowStock);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Total Products', value: stats.products, color: 'bg-blue-500', path: '/admin/products' },
    { label: 'Categories', value: stats.categories, color: 'bg-green-500', path: '/admin/categories' },
    { label: 'Total Orders', value: stats.orders, color: 'bg-purple-500', path: '/admin/reports' },
    { label: 'Customers', value: stats.customers, color: 'bg-indigo-500', path: '/admin/reports' },
    { label: 'Low Stock Items', value: stats.lowStock, color: 'bg-orange-500', path: '/admin/inventory' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(card => (
          <Link key={card.label} to={card.path}
            className={`${card.color} rounded-lg p-4 text-white hover:opacity-90 transition`}>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm mt-1 opacity-90">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/products" className="border rounded-lg p-3 text-center hover:bg-gray-50 text-sm">Manage Products</Link>
            <Link to="/admin/categories" className="border rounded-lg p-3 text-center hover:bg-gray-50 text-sm">Manage Categories</Link>
            <Link to="/admin/coupons" className="border rounded-lg p-3 text-center hover:bg-gray-50 text-sm">Manage Coupons</Link>
            <Link to="/admin/inventory" className="border rounded-lg p-3 text-center hover:bg-gray-50 text-sm">View Inventory</Link>
          </div>
        </div>

        {lowStockItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="font-semibold mb-3 text-orange-600">Low Stock Alerts</h2>
            <div className="space-y-2">
              {lowStockItems.slice(0, 5).map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.productName}</span>
                  <span className="text-red-500 font-medium">{item.availableQuantity} left</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link to="/orders" className="text-sm text-indigo-600 hover:underline">View All</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No orders yet.</p>
        ) : (
          <div className="divide-y text-sm">
            {recentOrders.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} className="flex justify-between items-center py-3 hover:bg-gray-50 px-2 -mx-2 rounded">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    order.status === 'DELIVERED' ? 'text-green-600 bg-green-50' :
                    order.status === 'CANCELLED' ? 'text-red-600 bg-red-50' :
                    order.status === 'SHIPPED' ? 'text-purple-600 bg-purple-50' :
                    'text-yellow-600 bg-yellow-50'
                  }`}>{order.status}</span>
                  <p className="font-semibold mt-1">${order.totalAmount.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
