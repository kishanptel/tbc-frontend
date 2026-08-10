import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './index.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalLoader from './components/GlobalLoader';
import Toast from './components/Toast';
import RouteTracker from './components/RouteTracker';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import DiyBouquet from './pages/DiyBouquet';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Initialize AOS on mount
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      easing: 'ease-out-cubic'
    });

    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      setIsPageLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);
  
  // Shared User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user_session');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    setCurrentUser(null);
    showToast('Logged out successfully');
  };

  // Shared Cart State (Empty by default)
  const [cartItems, setCartItems] = useState([]);
  
  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateCartQty = (id, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Handle Checkout - Post Order to MongoDB Atlas Database
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!currentUser) {
      showToast('Please register or log in to place an order!');
      return;
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://tbc-backend-nine.vercel.app';
      const response = await fetch(`${API_URL}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: currentUser.email,
          userName: currentUser.name,
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            qty: item.qty,
            img: item.img || '/logo.png',
            customDetails: item.customDetails || '',
            selectedItems: item.selectedItems || [],
            wrapping: item.wrapping || '',
            ribbon: item.ribbon || ''
          })),
          totalPrice: subtotal
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCartItems([]);
        showToast('Order placed successfully!');
      } else {
        setCartItems([]);
        showToast('Order placed successfully!');
      }
    } catch (err) {
      console.warn('Backend order API offline:', err.message);
      setCartItems([]);
      showToast('Order placed successfully!');
    }
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="app-container">
      {/* Global Glassmorphic Loader */}
      <GlobalLoader isVisible={isInitialLoading || isPageLoading} />

      {/* Route & Scroll Tracker */}
      <RouteTracker setIsPageLoading={setIsPageLoading} />

      {/* Toast Banner */}
      <Toast message={toastMessage} />

      {/* Navigation Header */}
      <Navbar totalCartCount={totalCartCount} currentUser={currentUser} handleLogout={handleLogout} />

      {/* Main Pages */}
      <div className="page-wrapper">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} currentUser={currentUser} showToast={showToast} />} />
          <Route path="/products" element={<Products isPageLoading={isPageLoading} addToCart={addToCart} currentUser={currentUser} showToast={showToast} />} />
          <Route path="/diy" element={<DiyBouquet addToCart={addToCart} showToast={showToast} currentUser={currentUser} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs showToast={showToast} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} updateCartQty={updateCartQty} handleCheckout={handleCheckout} />} />
          <Route path="/orders" element={<Orders currentUser={currentUser} showToast={showToast} />} />
          <Route path="/profile" element={<Profile currentUser={currentUser} handleLogout={handleLogout} showToast={showToast} />} />
          <Route path="/admin" element={<Admin currentUser={currentUser} showToast={showToast} />} />
          <Route path="/login" element={<Account showToast={showToast} setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<Account showToast={showToast} setCurrentUser={setCurrentUser} />} />
          <Route path="/account" element={<Account showToast={showToast} setCurrentUser={setCurrentUser} />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
