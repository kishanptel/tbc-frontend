import React from 'react';
import { Sparkles, UserCheck } from 'lucide-react';

export default function AboutUs() {
  return (
    <main className="page-route-animate" style={{ overflowX: 'hidden', width: '100%' }}>
      <section className="page-header">
        <div className="container" data-aos="fade-up">
          <span className="section-label">Meet The Artisans</span>
          <h1>The Makers Behind theblissco</h1>
          <p>Handcrafted pipe cleaner flower creations by Shruti and Diya.</p>
        </div>
      </section>

      <section className="section-pad" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">

        {/* Single Story Section with ONLY ONE PHOTO (aboutus_pic.jpg) */}
        <div className="about-story">
          <div className="about-img-wrap" data-aos="fade-right">
            <img src="/aboutus_pic.jpg" alt="Shruti Patel & Diya Patel - Pipe Cleaner Flower Makers of theblissco" className="about-img" />
          </div>
          <div className="about-text" data-aos="fade-left">
            <span className="section-label" style={{ marginBottom: '8px' }}>Our Floral Story</span>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 2.1rem)', lineHeight: '1.3' }}>
              Created &amp; Styled by
              <span style={{ display: 'block', fontSize: 'clamp(1.6rem, 4vw, 2.7rem)', color: 'var(--primary)', fontWeight: '900', letterSpacing: '-0.02em' }}>Shruti and Diya</span>
            </h2>
            <p>
              Welcome to <strong>theblissco</strong>! We are <strong>Shruti</strong> and <strong>Diya</strong>, the passionate artisans behind every handcrafted pipe cleaner flower bouquet, arrangement, and custom design in our shop.
            </p>
            <p>
              Our story began with a shared love for handmade craft artistry and everlasting floral beauty. We meticulously shape soft, premium pipe cleaners into vibrant roses, lilies, tulips, and custom blossoms that never wither. From our signature arrangements to interactive DIY bouquet building, we pour our heart into creating unique pipe cleaner flower art that brings everlasting joy to your special moments.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
              <div style={{ background: 'var(--surface)', padding: '18px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                <h4 style={{ color: 'var(--dark)', margin: '0 0 4px', fontSize: '0.98rem' }}>Floral Makers</h4>
                <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-dim)' }}>Shruti Patel and Diya Patel</p>
              </div>

              <div style={{ background: 'var(--surface)', padding: '18px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                <h4 style={{ color: 'var(--dark)', margin: '0 0 4px', fontSize: '0.98rem' }}>100% Handmade</h4>
                <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-dim)' }}>Everlasting Pipe Cleaner Flowers</p>
              </div>
            </div>
          </div>
        </div>

        </div>
      </section>
    </main>
  );
}
