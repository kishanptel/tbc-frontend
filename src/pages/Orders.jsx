import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Calendar, Clock, CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Orders({ currentUser, showToast }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      if (showToast) showToast('Please register or log in to view your orders!');
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/orders/user?email=${encodeURIComponent(currentUser.email)}`);
        const data = await response.json();
        if (response.ok && data.success) {
          setOrders(data.orders || []);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.warn('Could not fetch user orders from backend:', err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate, showToast]);

  if (!currentUser) return null;

  return (
    <div className="page-route-animate section-pad">
      <div className="container">
        <div className="section-header centered" data-aos="fade-up">
          <span className="section-label">Order History</span>
          <h2 className="section-title">My Orders</h2>
          <p className="section-sub">Track and view all your saved handcrafted flower bouquet & keychain purchases.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 16px', width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Loading your order history from database...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-cart-card" data-aos="zoom-in">
            <div className="empty-cart-icon-wrap">
              <Package size={56} color="var(--primary)" />
            </div>
            <h3>No orders found in database</h3>
            <p>You haven't placed any orders yet. Explore our handcrafted sweet goodies collection today!</p>
            <button className="btn btn-primary btn-large" onClick={() => navigate('/products')}>
              Explore Sweet Goodies <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px', maxWidth: '850px', margin: '0 auto' }}>
            {orders.map((order) => (
              <div key={order._id || order.id} className="order-history-card" data-aos="fade-up" style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      Order #{order._id ? order._id.slice(-8).toUpperCase() : 'REC-' + Date.now().toString().slice(-6)}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Calendar size={14} color="var(--primary)" />
                      <span>{new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '4px 14px',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: order.status === 'Delivered' ? 'rgba(19, 115, 51, 0.1)' : 'rgba(139, 68, 83, 0.1)',
                      color: order.status === 'Delivered' ? '#137333' : 'var(--primary)',
                      border: '1px solid currentColor'
                    }}>
                      {order.status || 'Processing'}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '10px 14px', background: '#ffffff', borderRadius: '10px', border: '1px solid rgba(139, 68, 83, 0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={item.img || '/logo.png'} alt={item.name} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</h4>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Qty: {item.qty} × ₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        ₹{(Number(item.price || 0) * Number(item.qty || 1)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
