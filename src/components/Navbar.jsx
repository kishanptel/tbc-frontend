import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, ShieldCheck } from 'lucide-react';

export default function Navbar({ totalCartCount = 0, currentUser, handleLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <img 
            src="/logo.png" 
            alt="theblissco logo" 
            className="nav-logo-img" 
            onError={(e) => { e.target.onerror = null; e.target.src = "https://res.cloudinary.com/llzw1dmz/image/upload/v1786053620/theblissco_assets/theblissco_official_logo.jpg"; }}
          />
          <div className="nav-logo-text">
            <span className="nav-logo-brand">theblissco</span>
            <span className="nav-logo-sub">FLOWER SHOP</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Sweet Goodies</NavLink>
          <NavLink to="/diy" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>DIY flower bouquet</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About us</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact us</NavLink>

          {currentUser?.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--primary)', fontWeight: 800 }}>
              <ShieldCheck size={18} />
              <span>Admin Panel</span>
            </NavLink>
          )}
          
          {/* Cart with Notification Badge */}
          <NavLink to="/cart" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={18} />
              {totalCartCount > 0 && (
                <span className="cart-notification-badge">{totalCartCount}</span>
              )}
            </div>
            <span>Cart</span>
          </NavLink>

          {/* User Account Option with Profile Avatar linking to /profile */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 68, 83, 0.08)', padding: '4px 12px 4px 6px', borderRadius: '50px', border: '1px solid rgba(139, 68, 83, 0.2)' }}>
                <img
                  src={currentUser.profile || '/logo.png'}
                  alt={currentUser.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--primary)' }}
                />
                <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary)' }}>
                  {currentUser.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <LogOut size={16} color="var(--primary)" />
              </button>
            </div>
          ) : (
            <NavLink to="/account" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <User size={18} />
              <span>Account</span>
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)} end>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Sweet Goodies</NavLink>
          <NavLink to="/diy" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>DIY flower bouquet</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>About us</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Contact us</NavLink>
          
          {currentUser?.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 800 }}>
              <ShieldCheck size={18} />
              <span>Admin Panel</span>
            </NavLink>
          )}
          
          {/* Mobile Cart */}
          <NavLink to="/cart" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={18} />
              {totalCartCount > 0 && (
                <span className="cart-notification-badge">{totalCartCount}</span>
              )}
            </div>
            <span>Cart</span>
          </NavLink>
          
          {/* Mobile Account Profile */}
          {currentUser ? (
            <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(197, 85, 114, 0.06)', borderRadius: '10px', marginTop: '6px' }}>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={currentUser.profile || '/logo.png'}
                  alt={currentUser.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{currentUser.name}</span>
              </Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px' }}>
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <User size={18} />
              <span>Account (Login / Register)</span>
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

