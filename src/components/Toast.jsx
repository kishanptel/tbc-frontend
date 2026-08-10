import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: '90px',
      right: '24px',
      background: 'var(--primary)',
      color: '#ffffff',
      padding: '12px 22px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(139, 68, 83, 0.3)',
      zIndex: 2000,
      fontWeight: '700',
      fontSize: '0.9rem',
      animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {message}
    </div>
  );
}
