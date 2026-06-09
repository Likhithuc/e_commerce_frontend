import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/auth';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ otp: '', email: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(form);
      navigate('/login');
    } catch {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">OTP</label>
          <input required value={form.otp} onChange={e => update('otp', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input type="password" required value={form.newPassword} onChange={e => update('newPassword', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input type="password" required value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        <p className="text-sm text-center"><Link to="/login" className="text-indigo-600 hover:underline">Back to Login</Link></p>
      </form>
    </div>
  );
}
