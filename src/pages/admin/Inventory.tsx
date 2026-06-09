import { useState, useEffect } from 'react';
import { getLowStockItems, updateInventory } from '../../services/inventory';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { InventoryResponse } from '../../types';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(0);

  const load = () => getLowStockItems(100).then(setItems).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleUpdate = async (productId: number) => {
    await updateInventory(productId, { availableQuantity: quantity });
    setEditing(null);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">SKU</th>
              <th className="text-left px-4 py-3">Available</th>
              <th className="text-left px-4 py-3">Reserved</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map(item => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium">{item.productName}</td>
                <td className="px-4 py-3 text-gray-500">{item.productSku}</td>
                <td className="px-4 py-3">
                  {editing === item.productId ? (
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                      className="border rounded px-2 py-1 w-20" autoFocus />
                  ) : (
                    <span className={item.availableQuantity < 10 ? 'text-red-600 font-medium' : ''}>
                      {item.availableQuantity}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{item.reservedQuantity}</td>
                <td className="px-4 py-3">
                  {editing === item.productId ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleUpdate(item.productId)} className="text-green-600 text-xs hover:underline">Save</button>
                      <button onClick={() => setEditing(null)} className="text-gray-500 text-xs hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditing(item.productId); setQuantity(item.availableQuantity); }}
                      className="text-indigo-600 text-xs hover:underline">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
