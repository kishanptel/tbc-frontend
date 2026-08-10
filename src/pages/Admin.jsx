import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, DollarSign, Mail, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, Search, Filter } from 'lucide-react';

export default function Admin({ currentUser, showToast }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Delete User Confirmation Modal State
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      return;
    }
    fetchAdminData();
  }, [currentUser]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all users
      const resUsers = await fetch(`${API_URL}/users/all`);
      const dataUsers = await resUsers.json();
      if (dataUsers.users) setUsers(dataUsers.users);

      // 2. Fetch all orders
      const resOrders = await fetch(`${API_URL}/orders/all`);
      const dataOrders = await resOrders.json();
      if (dataOrders.orders) setOrders(dataOrders.orders);

      // 3. Fetch all contact inquiries
      const resContacts = await fetch(`${API_URL}/contacts/all`);
      const dataContacts = await resContacts.json();
      if (dataContacts.contacts) setContacts(dataContacts.contacts);
    } catch (err) {
      console.warn('Admin API data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove / Delete User Handler
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeletingUser(true);
    try {
      const response = await fetch(`${API_URL}/users/delete/${userToDelete._id || userToDelete.id || userToDelete.email}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (showToast) showToast(`User ${userToDelete.name} has been removed.`);
        setUsers(prev => prev.filter(u => (u._id || u.id) !== (userToDelete._id || userToDelete.id)));
      } else {
        if (showToast) showToast(data.message || 'Failed to remove user.');
      }
    } catch (err) {
      if (showToast) showToast('Error connecting to server to remove user.');
    } finally {
      setIsDeletingUser(false);
      setUserToDelete(null);
    }
  };

  // Update Order Status Handler
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (showToast) showToast(`Order status updated to ${newStatus}`);
        setOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status: newStatus } : o));
      } else {
        if (showToast) showToast(data.message || 'Failed to update order status');
      }
    } catch (err) {
      if (showToast) showToast('Server error updating order status');
    }
  };

  // Access Control Guard
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="page-route-animate section-pad" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '40px 24px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <AlertTriangle size={56} color="#d93025" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '10px' }}>Admin Access Required</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem', marginBottom: '24px' }}>
              You must be logged in as an authorized Administrator to view this dashboard.
            </p>
            <button className="btn btn-primary btn-large" onClick={() => navigate('/login')}>
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalUsersCount = users.length;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
  const totalInquiriesCount = contacts.length;

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredOrders = orders.filter(o => 
    (o.userName && o.userName.toLowerCase().includes(orderSearch.toLowerCase())) ||
    (o.userEmail && o.userEmail.toLowerCase().includes(orderSearch.toLowerCase())) ||
    ((o._id || '').toLowerCase().includes(orderSearch.toLowerCase()))
  );

  return (
    <main className="page-route-animate" style={{ overflowX: 'hidden', width: '100%' }}>
      <section className="page-header">
        <div className="container" data-aos="fade-up">
          <span className="section-label">Administrator Studio</span>
          <h1>Store Operations &amp; Analytics</h1>
          <p>Real-time oversight of customer accounts, orders, gross revenue, and inquiries.</p>
        </div>
      </section>

      <section className="section-pad" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
        
        {/* Admin Dashboard Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, #662f3c 0%, #8b4453 100%)',
          color: '#ffffff',
          padding: '24px 28px',
          borderRadius: '20px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)'
        }} data-aos="fade-up">
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800, color: 'var(--accent-rose)', display: 'block', marginBottom: '4px' }}>
              Administrator Management Studio
            </span>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff', fontWeight: 900 }}>
              Store Operations &amp; Analytics
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '50px', backdropFilter: 'blur(8px)' }}>
            <ShieldCheck size={18} color="#ffffff" />
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{currentUser.name} (Admin)</span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }} data-aos="fade-up">
          
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 700 }}>Total Registered Users</span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)' }}>{totalUsersCount}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Registered customer accounts</span>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 700 }}>Total Orders Placed</span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)' }}>{totalOrdersCount}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Customer flower purchases</span>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 700 }}>Total Gross Revenue</span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#137333' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Accumulated sales value</span>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 700 }}>Contact Inquiries</span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-main)' }}>{totalInquiriesCount}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Customer messages received</span>
          </div>

        </div>

        {/* Admin Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '2px solid var(--border)',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-dim)',
              borderBottom: activeTab === 'overview' ? '3px solid var(--primary)' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Users size={18} /> User Accounts ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-dim)',
              borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Package size={18} /> Customer Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              color: activeTab === 'contacts' ? 'var(--primary)' : 'var(--text-dim)',
              borderBottom: activeTab === 'contacts' ? '3px solid var(--primary)' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Mail size={18} /> Inquiries &amp; Messages ({contacts.length})
          </button>
        </div>

        {/* Tab 1: User Management */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Registered User Accounts
              </h3>

              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px', height: '40px', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Loading user accounts...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-dim)', fontWeight: 600 }}>No users found matching your search.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredUsers.map((user) => (
                  <div key={user._id || user.id} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img
                        src={user.profile || '/logo.png'}
                        alt={user.name}
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--primary)'
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            {user.name}
                          </h4>
                          {user.isAdmin && (
                            <span style={{ background: 'var(--primary)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '50px' }}>
                              Admin
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          <span>{user.email}</span>
                          {user.phone && <span style={{ marginLeft: '12px' }}>📞 {user.phone}</span>}
                        </div>
                      </div>
                    </div>

                    {!user.isAdmin ? (
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="btn"
                        style={{
                          background: 'rgba(217, 48, 37, 0.1)',
                          color: '#d93025',
                          border: '1px solid rgba(217, 48, 37, 0.2)',
                          padding: '8px 16px',
                          borderRadius: '50px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Trash2 size={16} /> Remove User
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>System Administrator</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders Tracking */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Customer Orders Tracker
              </h3>

              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search customer email or order ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px', height: '40px', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Loading customer orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-dim)', fontWeight: 600 }}>No orders found matching your search.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredOrders.map((order) => (
                  <div key={order._id || order.id} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          Customer: {order.userName} ({order.userEmail})
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Order ID: #{order._id ? order._id.toUpperCase() : 'REC-1001'} | Date: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)' }}>
                          ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                        </span>

                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => handleUpdateOrderStatus(order._id || order.id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '50px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            border: '1.5px solid var(--primary)',
                            background: '#ffffff',
                            color: 'var(--primary)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items Breakdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px', background: '#ffffff', borderRadius: '10px', border: '1px solid rgba(139, 68, 83, 0.08)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={item.img || '/logo.png'} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                              <div>
                                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name || item.title}</h4>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Qty: {item.qty || item.quantity} × ₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                              ₹{(Number(item.price || 0) * Number(item.qty || item.quantity || 1)).toLocaleString('en-IN')}
                            </div>
                          </div>

                          {/* Custom Bouquet Details */}
                          {(item.customDetails || (item.selectedItems && item.selectedItems.length > 0)) && (
                            <div style={{
                              background: 'var(--accent-rose)',
                              border: '1px solid var(--border-mid)',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '0.8rem',
                              color: 'var(--primary)',
                              fontWeight: 600,
                              lineHeight: 1.45
                            }}>
                              <div>💐 <strong>Custom Bouquet Items Selected by User:</strong></div>
                              <div style={{ color: 'var(--dark)', marginTop: '2px', fontWeight: 500 }}>
                                {item.customDetails || [
                                  Array.isArray(item.selectedItems) && item.selectedItems.length > 0
                                    ? item.selectedItems.map(s => `${s.qty || 1}× ${s.name || s.title}`).join(', ')
                                    : '',
                                  item.wrapping ? `Paper: ${item.wrapping}` : '',
                                  item.ribbon ? `Ribbon: ${item.ribbon}` : ''
                                ].filter(Boolean).join(' | ')}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Contact Inquiries */}
        {activeTab === 'contacts' && (
          <div>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Customer Messages &amp; Inquiries
            </h3>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Loading customer inquiries...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-dim)', fontWeight: 600 }}>No inquiries received yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contacts.map((c, idx) => (
                  <div key={c._id || idx} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{c.name}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{c.email}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                      Subject: {c.subject || 'General Inquiry'}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: '1.6', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      "{c.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delete User Confirmation Modal */}
          {userToDelete && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '28px',
                maxWidth: '440px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
              }}>
                <AlertTriangle size={48} color="#d93025" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', color: 'var(--text-main)' }}>Remove User Account?</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', margin: '0 0 24px' }}>
                  Are you sure you want to remove user account <strong>{userToDelete.name} ({userToDelete.email})</strong>?
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setUserToDelete(null)}
                    className="btn btn-secondary"
                    disabled={isDeletingUser}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="btn"
                    disabled={isDeletingUser}
                    style={{ background: '#d93025', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '50px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    {isDeletingUser ? 'Removing...' : 'Confirm Remove'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
