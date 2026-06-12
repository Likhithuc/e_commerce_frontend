import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../services/order';
import { processPayment, getPaymentByOrderId } from '../../services/payment';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { OrderResponse, PaymentResponse } from '../../types';

const METHODS = [
  { value: 'UPI', label: 'UPI', icon: '📱' },
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
  { value: 'DEBIT_CARD', label: 'Debit Card', icon: '💳' },
  { value: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
  { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
];

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOrderById(Number(id)).then(o => {
      setOrder(o);
      if (o.paymentStatus === 'COMPLETED') {
        getPaymentByOrderId(Number(id)).then(setPayment).catch(() => {});
        setDone(true);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const handlePay = async () => {
    if (!id) return;
    setPaying(true);
    try {
      const result = await processPayment({ orderId: Number(id), paymentMethod: method });
      setPayment(result);
      setDone(true);
    } catch {
      alert('Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <p className="text-center py-20">Order not found</p>;

  if (done && payment) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-2">Transaction ID: {payment.transactionId}</p>
        <p className="text-gray-500 mb-6">Amount paid: ${payment.amount.toFixed(2)} via {payment.paymentMethod}</p>
        <button onClick={() => navigate(`/orders/${order.id}`)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          View Order
        </button>
      </div>
    );
  }

  if (done && order.paymentStatus === 'COMPLETED' && !payment) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Payment Already Completed</h1>
        <button onClick={() => navigate(`/orders/${order.id}`)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          View Order
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <p className="text-gray-500 text-sm">Order</p>
        <p className="font-semibold">{order.orderNumber}</p>
        <p className="text-3xl font-bold text-indigo-600 mt-2">${order.totalAmount.toFixed(2)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="font-semibold mb-4">Select Payment Method</h2>
        <div className="space-y-3">
          {METHODS.map(m => (
            <label key={m.value} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${method === m.value ? 'border-indigo-500 bg-indigo-50' : ''}`}>
              <input type="radio" name="method" value={m.value} checked={method === m.value} onChange={() => setMethod(m.value)} className="accent-indigo-600" />
              <span className="text-xl">{m.icon}</span>
              <span className="font-medium">{m.label}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={handlePay} disabled={paying}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
        {paying ? 'Processing...' : `Pay $${order.totalAmount.toFixed(2)}`}
      </button>
    </div>
  );
}
