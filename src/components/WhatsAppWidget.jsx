import React from 'react';

export default function WhatsAppWidget({ phone = "919265962281", defaultMessage = "Hello theblissco! I have a question about your handcrafted flower bouquets." }) {
  const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="whatsapp-float-btn"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
        zIndex: 9990,
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
        textDecoration: 'none',
        border: '2px solid rgba(255, 255, 255, 0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.12) translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 211, 102, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.45)';
      }}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 2A13.94 13.94 0 0 0 3.94 22.95L2 29.81l7.04-1.84A13.94 13.94 0 1 0 16 2zm0 25.54h-.01a11.58 11.58 0 0 1-5.91-1.61l-.42-.25-4.39 1.15 1.17-4.28-.27-.44A11.59 11.59 0 1 1 16 27.54zm6.36-8.62c-.35-.17-2.07-1.02-2.39-1.14-.32-.12-.55-.17-.79.17-.23.35-.91 1.14-1.11 1.37-.2.23-.4.26-.75.09a9.42 9.42 0 0 1-2.77-1.71 10.37 10.37 0 0 1-1.92-2.39c-.2-.35-.02-.54.15-.71.16-.16.35-.4.52-.6.17-.2.23-.35.35-.58.12-.23.06-.44-.03-.61-.09-.17-.79-1.91-1.09-2.61-.29-.7-.58-.6-.79-.61h-.68c-.23 0-.61.09-.93.44s-1.22 1.19-1.22 2.91 1.25 3.37 1.42 3.6c.17.23 2.46 3.76 5.96 5.27.83.36 1.48.57 1.99.73.84.27 1.6.23 2.2.14.67-.1 2.07-.85 2.36-1.67.29-.82.29-1.53.2-1.67-.08-.14-.31-.22-.66-.39z"
          fill="#ffffff"
        />
      </svg>
    </a>
  );
}
