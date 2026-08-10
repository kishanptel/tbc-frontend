import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Lock, Sparkles } from 'lucide-react';

export default function Cart({ cartItems = [], updateCartQty, handleCheckout }) {
  const navigate = useNavigate();
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = subtotal > 0 ? 0 : 0; // Free shipping
  const grandTotal = subtotal + shippingFee;

  const removeItem = (id, currentQty) => {
    updateCartQty(id, -currentQty);
  };

  return (
    <main className="page-route-animate" style={{ overflowX: 'hidden', width: '100%' }}>
      <section className="page-header">
        <div className="container" data-aos="fade-up">
          <span className="section-label">Your Basket</span>
          <h1>Shopping Cart</h1>
          <p>Review your selected handcrafted arrangements before proceeding to secure checkout.</p>
        </div>
      </section>

      <section className="section-pad" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="empty-cart-card" data-aos="zoom-in">
            <div className="empty-cart-icon-wrap">
              <ShoppingBag size={48} color="var(--primary)" />
            </div>
            <h3>Your cart is currently empty</h3>
            <p>You haven't added any sweet flower creations to your basket yet.</p>
            <button className="btn btn-primary btn-large" onClick={() => navigate('/products')}>
              Explore Sweet Goodies <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          /* Rich Cart Layout Grid */
          <div className="cart-grid-container">
            {/* Left Column: Cart Items List */}
            <div className="cart-items-list" data-aos="fade-right">
              <div className="cart-items-header">
                <span>Items ({cartItems.reduce((acc, i) => acc + i.qty, 0)})</span>
                <span className="cart-clear-note">Everlasting Handcrafted Flowers</span>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-img-box">
                    <img src={item.img} alt={item.name} className="cart-item-thumb" />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button 
                        className="cart-remove-btn" 
                        title="Remove item"
                        onClick={() => removeItem(item.id, item.qty)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.customDetails && (
                      <div style={{
                        background: 'var(--accent-rose)',
                        border: '1px solid var(--border-mid)',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        fontSize: '0.8rem',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        margin: '6px 0 8px',
                        lineHeight: 1.4
                      }}>
                        📌 <strong>Custom Arrangement Details:</strong>
                        <div style={{ color: 'var(--dark)', marginTop: '2px', fontWeight: 500 }}>
                          {item.customDetails}
                        </div>
                      </div>
                    )}

                    <div className="cart-item-unit-price">₹{item.price.toLocaleString('en-IN')} each</div>

                    <div className="cart-item-bottom">
                      {/* Quantity Stepper */}
                      <div className="qty-stepper">
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, -1)}>-</button>
                        <span className="qty-value">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, 1)}>+</button>
                      </div>

                      {/* Item Total Price */}
                      <div className="cart-item-total-price">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="cart-summary-col" data-aos="fade-left">
              <div className="order-summary-card">
                <div className="summary-title">
                  <Sparkles size={18} color="var(--primary)" />
                  <span>Order Summary</span>
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="summary-val">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="summary-row">
                  <span>Handcrafted Packaging</span>
                  <span className="summary-free">FREE</span>
                </div>

                <div className="summary-row">
                  <span>Standard Delivery</span>
                  <span className="summary-free">FREE</span>
                </div>

                <div className="summary-divider" />

                <div className="summary-row summary-grand-total">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>

                <button className="btn btn-primary btn-block btn-large checkout-btn" onClick={handleCheckout}>
                  <Lock size={16} /> Checkout (₹{grandTotal.toLocaleString('en-IN')})
                </button>

                <div className="cart-trust-badges">
                  <div className="trust-item">
                    <ShieldCheck size={16} color="var(--primary)" />
                    <span>100% Quality & Satisfaction Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </section>
    </main>
  );
}

