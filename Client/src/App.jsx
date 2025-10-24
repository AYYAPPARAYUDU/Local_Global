import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/Spinner';

// --- Layouts ---
import Layout from './components/Layout';
import DashboardLayout from './pages/dashboard/DashboardLayout';

// --- Page Components ---
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CheckoutPage from './pages/CheckoutPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import Map from './components/Map';

// --- Dashboard Page Components ---
import Dashboard from './pages/dashboard/Dashboard';
import ManageProducts from './pages/dashboard/ManageProducts';
import AddProduct from './pages/dashboard/AddProduct';
import ShopSettings from './pages/dashboard/ShopSettings';
import Analytics from './pages/dashboard/Analytics';
import Orders from './pages/dashboard/Orders';


const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return <Spinner />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (role && user.role !== role) {
        return user.role === 'shopkeeper' 
            ? <Navigate to="/dashboard" replace /> 
            : <Navigate to="/" replace />;
    }
    return children;
};

const NotFound = () => (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <p className="lead fw-bold">Page Not Found</p>
        <p className="text-muted">Sorry, the page you’re looking for doesn’t exist.</p>
        <Link to="/" className="btn btn-primary mt-3">Go to Homepage</Link>
    </div>
);

function App() {
  return (
    <Routes>
      {/* --- Customer-Facing Pages --- */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="profile" element={<ProtectedRoute role="customer"><Profile /></ProtectedRoute>} />
        <Route path="my-orders" element={<ProtectedRoute role="customer"><MyOrders /></ProtectedRoute>} />
        <Route path="map" element={<Map />} />
      </Route>

      {/* --- Shopkeeper Dashboard Pages --- */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute role="shopkeeper">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="orders" element={<Orders />} />
        <Route path="settings" element={<ShopSettings />} />
      </Route>

      {/* --- Standalone Pages --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

      {/* --- 404 Route --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;