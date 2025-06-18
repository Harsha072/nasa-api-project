import React from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Rovers', href: '#' },
  { label: 'API Info', href: '#' },
  { label: 'Contact', href: '#' },
];

export default function NavBar() {
  return (
    <nav style={{
      position: 'fixed', // Make it fixed
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      fontWeight: 'bold',
      letterSpacing: '1px',
      background: 'rgba(10, 10, 20, 0.8)', // Semi-transparent background
      backdropFilter: 'blur(8px)', // Frosted glass effect
      zIndex: 1000, // Very high z-index to ensure it's on top
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {NAV_LINKS.map(link =>
        link.href.startsWith('/') ? (
          <Link
            key={link.label}
            to={link.href}
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '1.1rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'background 0.2s ease',
              ':hover': {
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {link.label}
          </Link>
        ) : (
          <a
            key={link.label}
            href={link.href}
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '1.1rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              transition: 'background 0.2s ease',
              ':hover': {
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {link.label}
          </a>
        )
      )}
    </nav>
  );
}