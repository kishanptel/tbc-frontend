import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.png" alt="theblissco logo" style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid var(--border-mid)' }} />
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--dark)' }}>theblissco</span>
            </div>
            <p>Handcrafted pipe cleaner floral arrangements, bespoke DIY bouquets, and everlasting blooms.</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/products">Sweet Goodies</Link>
              <Link to="/diy">DIY flower bouquet</Link>
              <Link to="/about">About us</Link>
              <Link to="/contact">Contact us</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Account & Orders</h4>
            <div className="footer-links">
              <Link to="/cart">Cart</Link>
              <Link to="/login">Account / Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          theblissco <span>|</span> designed by kishan
        </div>
      </div>
    </footer>
  );
}
