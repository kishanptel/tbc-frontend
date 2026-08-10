import React from 'react';

export default function GlobalLoader({ isVisible }) {
  return (
    <div className={`global-loader-overlay ${!isVisible ? 'fade-out' : ''}`}>
      <div className="loader-spinner-box">
        <img src="/logo.png" alt="theblissco logo" className="loader-logo-inner" />
      </div>
      <div className="loader-text">theblissco</div>
      <div className="loader-subtext">FLOWER SHOP</div>
    </div>
  );
}
