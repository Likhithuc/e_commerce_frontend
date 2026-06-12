import { useState } from 'react';
import { getSalesReport, getOrdersReport, getCustomersReport, getInventoryReport } from '../../services/report';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { ReportResponse } from '../../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  SHIPPED: '#8b5cf6',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
};

const INVENTORY_COLORS = ['#6366f1', '#22c55e', '#f97316'];
const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

function getColor(name: string, i: number): string {
  return STATUS_COLORS[name.toUpperCase()] || CHART_COLORS[i % CHART_COLORS.length];
}

export default function AdminReportsPage() {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');

  const fetchReport = async (reportType: string) => {
    setLoading(true);
    setType(reportType);
    try {
      const end = new Date().toISOString().split('T')[0];
      const start = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
      let data: ReportResponse;
      switch (reportType) {
        case 'sales': data = await getSalesReport(start, end); break;
        case 'orders': data = await getOrdersReport(start, end); break;
        case 'customers': data = await getCustomersReport(); break;
        case 'inventory': data = await getInventoryReport(); break;
        default: return;
      }
      setReport(data);
    } catch {
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const d = report?.data as Record<string, number | string | Record<string, number>> | undefined;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { key: 'sales', label: 'Sales Report', icon: '📊' },
          { key: 'orders', label: 'Orders Report', icon: '📦' },
          { key: 'customers', label: 'Customers Report', icon: '👥' },
          { key: 'inventory', label: 'Inventory Report', icon: '📋' },
        ].map(b => (
          <button key={b.key} onClick={() => fetchReport(b.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              type === b.key ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50'
            }`}>
            <span>{b.icon}</span> {b.label}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner />}

      {report && !loading && type === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-indigo-600">{(d?.totalOrders as number) || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${(d?.totalRevenue as number)?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500 text-sm">Avg Order Value</p>
              <p className="text-3xl font-bold text-purple-600">${(d?.averageOrderValue as number)?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-4">Orders by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries((d?.ordersByStatus as Record<string, number>) || {}).map(([k, v]) => ({ name: k, count: v }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 12 }}>
                  {Object.entries((d?.ordersByStatus as Record<string, number>) || {}).map(([k], i) => (
                    <Cell key={k} fill={getColor(k, i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-4">Orders Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={Object.entries((d?.ordersByStatus as Record<string, number>) || {}).map(([k, v]) => ({ name: k, value: v }))}
                  cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                  {Object.entries((d?.ordersByStatus as Record<string, number>) || {}).map(([k], i) => (
                    <Cell key={k} fill={getColor(k, i)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {report && !loading && type === 'orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Total', key: 'totalOrders', color: 'text-indigo-600' },
              { label: 'Pending', key: 'pendingOrders', color: 'text-yellow-600' },
              { label: 'Confirmed', key: 'confirmedOrders', color: 'text-blue-600' },
              { label: 'Shipped', key: 'shippedOrders', color: 'text-purple-600' },
              { label: 'Delivered', key: 'deliveredOrders', color: 'text-green-600' },
              { label: 'Cancelled', key: 'cancelledOrders', color: 'text-red-600' },
            ].map(s => (
              <div key={s.key} className="bg-white p-3 rounded-lg shadow-sm border text-center">
                <p className="text-gray-500 text-xs">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{(d?.[s.key] as number) || 0}</p>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-4">Orders Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Pending', count: (d?.pendingOrders as number) || 0 },
                { name: 'Confirmed', count: (d?.confirmedOrders as number) || 0 },
                { name: 'Shipped', count: (d?.shippedOrders as number) || 0 },
                { name: 'Delivered', count: (d?.deliveredOrders as number) || 0 },
                { name: 'Cancelled', count: (d?.cancelledOrders as number) || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 12 }}>
                  {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((name, i) => (
                    <Cell key={name} fill={getColor(name, i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {report && !loading && type === 'customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-3xl font-bold text-indigo-600">{(d?.totalCustomers as number) || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-green-600">{(d?.totalOrders as number) || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500 text-sm">Avg Orders/Customer</p>
              <p className="text-3xl font-bold text-purple-600">{(d?.averageOrdersPerCustomer as number)?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-4">Customer Growth Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { name: 'Customers', value: (d?.totalCustomers as number) || 0 },
                { name: 'Orders', value: (d?.totalOrders as number) || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 6 }}
                  label={{ position: 'top', fontSize: 12 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {report && !loading && type === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-indigo-600">{(d?.totalProducts as number) || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500 text-sm">Categories</p>
              <p className="text-3xl font-bold text-green-600">{(d?.totalCategories as number) || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-gray-500 text-sm">Low Stock Items</p>
              <p className={`text-3xl font-bold ${(d?.lowStockItems as number) > 0 ? 'text-orange-500' : 'text-green-600'}`}>
                {(d?.lowStockItems as number) || 0}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-4">Inventory Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={[
                  { name: 'Products', value: (d?.totalProducts as number) || 0 },
                  { name: 'Categories', value: (d?.totalCategories as number) || 0 },
                  { name: 'Low Stock', value: (d?.lowStockItems as number) || 0 },
                ]} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                  {[0, 1, 2].map(i => <Cell key={i} fill={INVENTORY_COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {report && !loading && (
        <div className="bg-gray-50 p-4 rounded-lg border mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Raw Data</span>
            <span className="text-xs text-gray-400">Generated: {report.generatedAt}</span>
          </div>
          <pre className="text-xs overflow-auto max-h-60">{JSON.stringify(report.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
