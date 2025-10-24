import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { LocationProvider } from './context/LocationContext.jsx'; // 1. Import the new LocationProvider

// --- GLOBAL STYLES ---
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // 2. This is the correct path for your global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LocationProvider> {/* 3. Wrap your App in the LocationProvider */}
            <App />
          </LocationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);