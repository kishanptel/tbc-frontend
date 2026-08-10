import React from 'react';

export default function ProductSkeletonGrid() {
  return (
    <div className="flower-grid">
      {[1, 2, 3, 4, 5, 6].map(n => (
        <div key={n} className="skeleton-card">
          <div className="skeleton-img-box skeleton" />
          <div className="skeleton-body">
            <div className="skeleton-title skeleton" />
            <div className="skeleton-text skeleton" />
            <div className="skeleton-text-short skeleton" />
            <div className="skeleton-footer">
              <div className="skeleton-price skeleton" />
              <div className="skeleton-btn skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
