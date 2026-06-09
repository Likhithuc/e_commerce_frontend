import { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notification';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { NotificationResponse } from '../../types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getNotifications({ page, size: 20 })
      .then(data => { setNotifications(data.content); setTotalPages(data.totalPages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleMarkRead = async (id: number) => {
    await markAsRead(id);
    load();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button onClick={handleMarkAllRead} className="text-indigo-600 text-sm hover:underline">Mark all as read</button>
        )}
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No notifications.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className={`bg-white p-4 rounded-lg shadow-sm border ${!n.isRead ? 'border-indigo-300 bg-indigo-50' : ''}`}>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && (
                  <button onClick={() => handleMarkRead(n.id)} className="text-xs text-indigo-600 hover:underline">Mark read</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
