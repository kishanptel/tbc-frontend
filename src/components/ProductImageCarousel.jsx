import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductImageCarousel({ images = [], alt = 'Product Image', tag = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If only 1 image provided, make a multi-view preview fallback with slight scale/filter or gallery images
  const imageList = Array.isArray(images) && images.length > 0 ? images : ['/logo.png'];

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="product-carousel-wrap" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-md)', width: '100%', aspectRatio: '4/3', background: 'var(--surface-alt)' }}>
      {tag && <span className="flower-badge" style={{ zIndex: 3 }}>{tag}</span>}

      {/* Smooth Image Slider Track */}
      <div
        className="product-carousel-track"
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {imageList.map((imgSrc, idx) => (
          <img
            key={idx}
            src={imgSrc}
            alt={`${alt} - View ${idx + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows if more than 1 image */}
      {imageList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Image"
            style={{
              position: 'absolute',
              top: '50%',
              left: '8px',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.88)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 2
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Image"
            style={{
              position: 'absolute',
              top: '50%',
              right: '8px',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.88)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 2
            }}
          >
            <ChevronRight size={16} />
          </button>

          {/* Dot Indicators */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '5px',
              zIndex: 2
            }}
          >
            {imageList.map((_, idx) => (
              <span
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                style={{
                  width: currentIndex === idx ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '10px',
                  background: currentIndex === idx ? 'var(--primary)' : 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
