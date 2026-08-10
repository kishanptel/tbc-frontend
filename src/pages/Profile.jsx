import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, KeyRound, Trash2, Calendar, Phone, Mail, LogOut, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(6, 'New password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your new password')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

export default function Profile({ currentUser, handleLogout, showToast }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'password' | 'danger'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      if (showToast) showToast('Please log in to access your profile!');
      navigate('/login');
      return;
    }

    const fetchUserOrders = async () => {
      setOrdersLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/orders/user?email=${encodeURIComponent(currentUser.email)}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOrders(data.orders || []);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.warn('Error fetching orders:', err.message);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchUserOrders();
  }, [currentUser, navigate, showToast]);

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsChangingPassword(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/users/change-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email,
            id: currentUser.id,
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showToast('Password changed successfully!');
          resetForm();
        } else {
          showToast(data.message || 'Failed to change password. Invalid current password.');
        }
      } catch (err) {
        showToast('Server error while changing password.');
      } finally {
        setIsChangingPassword(false);
      }
    },
  });

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const targetIdentifier = currentUser.id || currentUser._id || currentUser.email;
      const response = await fetch(`${API_URL}/users/delete/${encodeURIComponent(targetIdentifier)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Your account has been deleted successfully.');
        handleLogout();
        navigate('/');
      } else {
        showToast(data.message || 'Failed to delete account.');
      }
    } catch (err) {
      showToast('Error connecting to server to delete account.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!currentUser) return null;

  return (
    <main className="page-route-animate" style={{ overflowX: 'hidden', width: '100%' }}>
      <section className="page-header">
        <div className="container" data-aos="fade-up">
          <span className="section-label">Account Hub</span>
          <h1>My Profile &amp; Account Settings</h1>
          <p>Manage your account settings, order history, and security preferences.</p>
        </div>
      </section>

      <section className="section-pad" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '950px' }}>
        
        {/* User Profile Header Card */}
        <div className="profile-header-card" data-aos="fade-up" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={currentUser.profile || '/logo.png'}
              alt={currentUser.name}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2.5px solid var(--primary)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '1.45rem', color: 'var(--text-main)', fontWeight: 800 }}>
                {currentUser.name}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={14} color="var(--primary)" /> {currentUser.email}
                </span>
                {currentUser.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={14} color="var(--primary)" /> {currentUser.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="profile-tabs-nav" style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--border)',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}>
          <button
            onClick={() => setActiveTab('orders')}
            className={`profile-option-btn ${activeTab === 'orders' ? 'active-tab' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 16px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-dim)',
              borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'var(--ease)'
            }}
          >
            <Package size={18} /> Order History ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`profile-option-btn ${activeTab === 'password' ? 'active-tab' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 16px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              color: activeTab === 'password' ? 'var(--primary)' : 'var(--text-dim)',
              borderBottom: activeTab === 'password' ? '3px solid var(--primary)' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'var(--ease)'
            }}
          >
            <KeyRound size={18} /> Change Password
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`profile-option-btn ${activeTab === 'danger' ? 'active-tab' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 16px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              color: activeTab === 'danger' ? '#d93025' : 'var(--text-dim)',
              borderBottom: activeTab === 'danger' ? '3px solid #d93025' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'var(--ease)'
            }}
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>

        {/* Tab 1: Order History - Displayed One by One */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="spinner" style={{ margin: '0 auto 12px', width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Loading order history...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-cart-card" data-aos="zoom-in">
                <div className="empty-cart-icon-wrap">
                  <Package size={56} color="var(--primary)" />
                </div>
                <h3>No orders in your purchase history</h3>
                <p>You haven't placed any flower bouquet or keychain orders yet.</p>
                <button className="btn btn-primary btn-large" onClick={() => navigate('/products')}>
                  Explore Products <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {orders.map((order, orderIndex) => (
                  <div key={order._id || order.id} className="order-history-card" data-aos="fade-up" style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          background: 'var(--primary)',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          padding: '2px 8px',
                          borderRadius: '50px'
                        }}>
                          #{orderIndex + 1}
                        </span>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                            Order #{order._id ? order._id.slice(-8).toUpperCase() : 'REC-' + (orderIndex + 1)}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <Calendar size={14} color="var(--primary)" />
                            <span>{new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '50px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: order.status === 'Delivered' ? 'rgba(19, 115, 51, 0.1)' : 'rgba(139, 68, 83, 0.1)',
                          color: order.status === 'Delivered' ? '#137333' : 'var(--primary)',
                          border: '1px solid currentColor'
                        }}>
                          {order.status || 'Pending'}
                        </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                          ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items List - Displayed One by One */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(order.items || []).map((item, itemIdx) => {
                        const hasCustomDetails = Boolean(
                          (item.customDetails && String(item.customDetails).trim().length > 0) ||
                          (Array.isArray(item.selectedItems) && item.selectedItems.length > 0) ||
                          (item.wrapping && String(item.wrapping).trim().length > 0)
                        );

                        return (
                          <div key={itemIdx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 14px', background: '#ffffff', borderRadius: '10px', border: '1px solid rgba(139, 68, 83, 0.08)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img src={item.img || '/logo.png'} alt={item.name} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name || item.title}</h4>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Qty: {item.qty || item.quantity} × ₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                              <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                                ₹{(Number(item.price || 0) * Number(item.qty || item.quantity || 1)).toLocaleString('en-IN')}
                              </div>
                            </div>

                            {/* Custom DIY Bouquet Breakdown Details */}
                            {hasCustomDetails && (
                              <div style={{
                                background: 'var(--accent-rose)',
                                border: '1px solid var(--border-mid)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                fontSize: '0.82rem',
                                color: 'var(--primary)',
                                fontWeight: 600,
                                lineHeight: 1.45
                              }}>
                                <div>💐 <strong>Custom Bouquet Specifications:</strong></div>
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
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Change Password */}
        {activeTab === 'password' && (
          <div className="auth-card" style={{ maxWidth: '520px', margin: '0 auto' }} data-aos="zoom-in">
            <div className="auth-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>Change Password</h3>
              <p>Update your account security password</p>
            </div>

            <form onSubmit={passwordFormik.handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="••••••••"
                  className={`form-input ${passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword ? 'input-error' : ''}`}
                  value={passwordFormik.values.currentPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                />
                {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && (
                  <span className="form-error">{passwordFormik.errors.currentPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">New Password *</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="At least 6 characters"
                  className={`form-input ${passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? 'input-error' : ''}`}
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                />
                {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                  <span className="form-error">{passwordFormik.errors.newPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-type new password"
                  className={`form-input ${passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword ? 'input-error' : ''}`}
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                />
                {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                  <span className="form-error">{passwordFormik.errors.confirmPassword}</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={isChangingPassword} style={{ marginTop: '12px' }}>
                {isChangingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Delete Account (Danger Zone) */}
        {activeTab === 'danger' && (
          <div style={{
            background: 'rgba(217, 48, 37, 0.04)',
            border: '1px solid rgba(217, 48, 37, 0.2)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '560px',
            margin: '0 auto',
            textAlign: 'center'
          }} data-aos="zoom-in">
            <ShieldAlert size={48} color="#d93025" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.4rem', color: '#d93025', margin: '0 0 10px' }}>Delete Account</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Once you delete your account, your profile and personal details will be permanently removed. This action cannot be undone.
            </p>

            <button onClick={() => setShowDeleteModal(true)} className="btn" style={{ background: '#d93025', color: '#fff', padding: '12px 28px', borderRadius: '50px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
              Delete My Account
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
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
              <ShieldAlert size={44} color="#d93025" style={{ marginBottom: '12px' }} />
              <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', color: 'var(--text-main)' }}>Are you absolutely sure?</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', margin: '0 0 24px' }}>
                This will permanently delete your account for <strong>{currentUser.email}</strong>.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="btn"
                  style={{ flex: 1, background: '#d93025', color: '#fff', border: 'none', fontWeight: 700 }}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
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
