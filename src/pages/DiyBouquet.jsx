import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower2, ShoppingCart } from 'lucide-react';
import { initialDiyItems, wrappingOptions, ribbonOptions } from '../data/diyData';

export default function DiyBouquet({ addToCart, showToast, currentUser }) {
  const navigate = useNavigate();
  const [diyItems, setDiyItems] = useState(initialDiyItems);
  const [diyWrap, setDiyWrap] = useState('Craft Brown Paper');
  const [diyRibbon, setDiyRibbon] = useState('Rose Gold Satin');

  const updateItemQty = (id, delta) => {
    setDiyItems(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item));
  };

  const totalSelectedItems = diyItems.reduce((sum, item) => sum + item.qty, 0);
  const diyItemCost = diyItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const diyTotalCost = totalSelectedItems > 0 ? diyItemCost + 250 : 0;

  const handleAddDiyToCart = () => {
    if (!currentUser) {
      if (showToast) showToast('Please register or log in to add custom bouquets to your cart!');
      navigate('/register');
      return;
    }
    const chosenStems = diyItems.filter(item => item.qty > 0).map(item => ({
      name: item.name,
      qty: item.qty,
      price: item.price
    }));

    if (chosenStems.length === 0) {
      showToast('Please add at least 1 flower item to your bouquet!');
      return;
    }

    const itemsSummary = chosenStems.map(s => `${s.qty}× ${s.name}`).join(', ');
    const customDetailsString = `Stems: ${itemsSummary} | Paper: ${diyWrap} | Ribbon: ${diyRibbon}`;

    const diyProduct = {
      id: Date.now(),
      name: `Custom DIY Bouquet (${totalSelectedItems} items)`,
      price: diyTotalCost,
      qty: 1,
      img: '/logo.png',
      isCustomDiy: true,
      wrapping: diyWrap,
      ribbon: diyRibbon,
      selectedItems: chosenStems,
      customDetails: customDetailsString
    };

    addToCart(diyProduct);
    showToast('Custom DIY Bouquet added to cart!');
    navigate('/cart');
  };

  return (
    <main className="page-route-animate" style={{ overflowX: 'hidden', width: '100%' }}>
      <section className="page-header">
        <div className="container" data-aos="fade-up">
          <span className="section-label">Interactive Studio</span>
          <h1>DIY Flower Bouquet Builder</h1>
          <p>Select your favorite flower items, wrapping style, and ribbon to create a custom arrangement.</p>
        </div>
      </section>

      <section className="section-pad" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="diy-layout">
          <div className="diy-options-card" data-aos="fade-right">
            <div className="diy-step-title">
              <span className="diy-step-num">1</span> Choose Items & Quantity
            </div>
            <div className="stems-grid">
              {diyItems.map(item => (
                <div key={item.id} className={`stem-option ${item.qty > 0 ? 'selected' : ''}`}>
                  <img src={item.img} alt={item.name} className="diy-item-img" />
                  <div className="stem-info" style={{ flex: 1 }}>
                    <span className="stem-name">{item.name}</span>
                    <span className="stem-price">₹{item.price}/item</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '2px 8px', borderRadius: '50%' }}
                      onClick={() => updateItemQty(item.id, -1)}
                    >-</button>
                    <span style={{ fontWeight: '800', minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                    <button 
                      className="btn btn-primary btn-sm" 
                      style={{ padding: '2px 8px', borderRadius: '50%' }}
                      onClick={() => updateItemQty(item.id, 1)}
                    >+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="diy-step-title">
              <span className="diy-step-num">2</span> Select Paper Wrapping
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {wrappingOptions.map(wrap => (
                <button
                  key={wrap}
                  className={`btn ${diyWrap === wrap ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setDiyWrap(wrap)}
                >
                  {wrap}
                </button>
              ))}
            </div>

            <div className="diy-step-title">
              <span className="diy-step-num">3</span> Select Ribbon Accent
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {ribbonOptions.map(ribbon => (
                <button
                  key={ribbon}
                  className={`btn ${diyRibbon === ribbon ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setDiyRibbon(ribbon)}
                >
                  {ribbon}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Card */}
          <div className="diy-preview-card" data-aos="fade-left">
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px' }}>Bouquet Summary</h3>
            
            <div className="diy-visual-box">
              <Flower2 size={48} color="var(--primary)" style={{ marginBottom: '8px' }} />
              <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--dark)' }}>
                {diyItems.reduce((acc, i) => acc + i.qty, 0)} Items Selected
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', marginTop: '4px' }}>
                Wrapped in {diyWrap} with {diyRibbon}
              </span>
            </div>

            <div className="diy-summary-row">
              <span>Flower Items Cost:</span>
              <span style={{ fontWeight: '700' }}>₹{diyItemCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="diy-summary-row">
              <span>Arrangement & Wrapping:</span>
              <span style={{ fontWeight: '700' }}>₹250</span>
            </div>
            
            <div className="diy-total-row">
              <span>Total Price:</span>
              <span>₹{diyTotalCost.toLocaleString('en-IN')}</span>
            </div>

            <button className="btn btn-primary btn-block" style={{ marginTop: '24px' }} onClick={handleAddDiyToCart}>
              <ShoppingCart size={18} /> Add Custom Bouquet to Cart
            </button>
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}
