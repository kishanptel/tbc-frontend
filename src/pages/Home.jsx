import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower2, Sparkles, Truck, ArrowRight } from 'lucide-react';
import HomeHeroCarousel from '../components/HomeHeroCarousel';

export default function Home() {
  const navigate = useNavigate();

  // 4 Best Product Images for Home Page Smooth Carousel
  const bestProductImages = [
    {
      src: '/images/Flower Bouquet/Blue lily bouquet.jpg',
      title: 'Handcrafted Blue Lily Bouquet'
    },
    {
      src: '/images/Ribbon Flower Bouquet/Rich Burgundy Satin Ribbon Rose Bouquet.jpg',
      title: 'Rich Burgundy Satin Ribbon Rose Bouquet'
    },
    {
      src: '/images/Ribbon Flower Bouquet/Pink Satin Ribbon Rose Bouquet.jpg',
      title: 'Pink Satin Ribbon Rose Bouquet'
    },
    {
      src: '/images/Keychain/Cherry Keychian.jpg',
      title: 'Cherry Bag Charm Keychain'
    }
  ];

  return (
    <div className="page-route-animate">
      {/* Hero Section */}
      <section className="hero">
        <div className="container" data-aos="fade-up">
          <img src="/logo.png" alt="theblissco" className="hero-logo-banner" />
          <span className="section-label">Bespoke Floral Design</span>
          <h1>Crafting Timeless <em>Floral Memories</em></h1>
          <p className="hero-sub">
            Handcrafted pipe cleaner flower arrangements, custom DIY bouquets, and elegant everlasting blooms created with love for every occasion.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-large" onClick={() => navigate('/diy')}>
              <Flower2 size={18} /> Build DIY Bouquet
            </button>
            <button className="btn btn-secondary btn-large" onClick={() => navigate('/products')}>
              Explore Collection
            </button>
          </div>

          <div className="hero-img-wrap" data-aos="zoom-in" data-aos-delay="200">
            <img src="/images/Flower Bouquet/Lily bouquets.jpg" alt="theblissco flowers showcase" className="hero-img" />
          </div>
        </div>
      </section>

      {/* Smooth 3-4 Best Product Images Carousel Section */}
      <section className="section-pad" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header centered" data-aos="fade-up">
            <span className="section-label">Top Bestsellers</span>
            <h2 className="section-title">Our Best Creations Showcase</h2>
            <p className="section-sub">Experience our finest handcrafted flower arrangements & keychains in a smooth image slider.</p>
          </div>

          {/* Smooth Single Hero Carousel for 4 Best Images */}
          <div data-aos="zoom-in" data-aos-delay="100">
            <HomeHeroCarousel images={bestProductImages} autoPlayMs={3500} />
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button className="btn btn-primary btn-large" onClick={() => navigate('/products')}>
              Explore Full Sweet Goodies Collection <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-pad" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header centered" data-aos="fade-up">
            <span className="section-label">Our Guarantee</span>
            <h2 className="section-title">The Bliss Standard</h2>
            <p className="section-sub">Every blossom is meticulously hand-shaped using soft velvet pipe cleaners for everlasting beauty.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <h3>Handmade Pipe Cleaner Art</h3>
              <p>Intricately hand-shaped from soft velvet pipe cleaners that stay vibrant forever without wilting.</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <h3>Artisanal Styling</h3>
              <p>Each arrangement is hand-tied by master floral artists in signature blush paper.</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <h3>Express Delivery</h3>
              <p>Carefully transported in temperature-controlled packaging so every blossom arrives flawless.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Block */}
      <section className="section-pad">
        <div className="container" data-aos="zoom-in">
          <div style={{
            background: 'var(--primary)',
            borderRadius: 'var(--r-lg)',
            padding: '48px 24px',
            color: '#ffffff',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--primary-dark)',
            borderBottomWidth: '6px'
          }}>
            <span className="section-label" style={{ color: 'var(--accent-rose)' }}>Custom Creation</span>
            <h2 style={{ color: '#ffffff', fontSize: '2.2rem', marginBottom: '16px' }}>Want Something Truly Unique?</h2>
            <p style={{ maxWidth: '520px', margin: '0 auto 24px', opacity: 0.9 }}>
              Use our interactive DIY Bouquet Builder to choose individual flower items, wrapping, and ribbon styles!
            </p>
            <button className="btn btn-secondary btn-large" onClick={() => navigate('/diy')}>
              Create DIY Bouquet Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
