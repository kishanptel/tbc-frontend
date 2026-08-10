import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomeHeroCarousel({ images = [], autoPlayMs = 3500 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, autoPlayMs);
    return () => clearInterval(interval);
  }, [images, autoPlayMs]);

  if (!images || images.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Image Slider Frame */}
      <div
        className="home-hero-carousel"
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          border: 'none',
          background: 'transparent',
          aspectRatio: '16/9',
          minHeight: '260px'
        }}
      >
        {/* Smooth Image Track */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {images.map((item, idx) => (
            <div key={idx} style={{ width: '100%', height: '100%', flexShrink: 0, position: 'relative' }}>
              <img
                src={item.src}
                alt={item.title || `Best Product ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {item.title && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    insetX: 0,
                    width: '100%',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(44,24,28,0.75) 100%)',
                    padding: '24px 20px 24px',
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, color: 'var(--accent-rose)', display: 'block', marginBottom: '2px' }}>
                      Featured Creation
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            top: '50%',
            left: '12px',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.92)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--primary)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            zIndex: 3,
            transition: 'transform 0.2s ease, background 0.2s ease'
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            top: '50%',
            right: '12px',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.92)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--primary)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            zIndex: 3,
            transition: 'transform 0.2s ease, background 0.2s ease'
          }}
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot Indicators - Inside Carousel (Lower Down) */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 4
          }}
        >
          {images.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: currentIndex === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '10px',
                background: currentIndex === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.35s ease',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
