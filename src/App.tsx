import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import ProductListPage from './pages/products/ProductList';
import ProductDetailPage from './pages/products/ProductDetail';
import CartPage from './pages/cart/Cart';
import CheckoutPage from './pages/cart/Checkout';
import OrderListPage from './pages/orders/OrderList';
import OrderDetailPage from './pages/orders/OrderDetail';
import WishlistPage from './pages/wishlist/Wishlist';
import AddressListPage from './pages/addresses/AddressList';
import NotificationsPage from './pages/notifications/Notifications';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCategoriesPage from './pages/admin/Categories';
import AdminProductsPage from './pages/admin/Products';
import AdminCouponsPage from './pages/admin/Coupons';
import AdminInventoryPage from './pages/admin/Inventory';
import AdminReportsPage from './pages/admin/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/addresses" element={<ProtectedRoute><AddressListPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AddressListPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
            <Route path="/admin/coupons" element={<AdminRoute><AdminCouponsPage /></AdminRoute>} />
            <Route path="/admin/inventory" element={<AdminRoute><AdminInventoryPage /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><AdminReportsPage /></AdminRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
