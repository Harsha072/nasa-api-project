import React, { useEffect, useState, useRef } from 'react';
import NavBar from '../components/NavBar';

// Use public/static paths for images
const staticPhotos = [
  {
    img_src: process.env.PUBLIC_URL + '/static/land.webp',
    
  },
  {
    img_src: process.env.PUBLIC_URL + '/static/opportunity.webp', // fixed typo
    
  },
  {
    img_src: process.env.PUBLIC_URL + '/static/dust.webp',
  
  }
];

export default function HomePage() {
  const [photos] = useState(staticPhotos);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const intervalRef = useRef(null);

  // Auto-slide logic with fade effect
  useEffect(() => {
    if (photos.length > 0) {
      intervalRef.current = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrent(prev => (prev + 1) % photos.length);
          setFade(true);
        }, 400); // fade out duration
      }, 3500);
      return () => clearInterval(intervalRef.current);
    }
  }, [photos, current]);

  // Manual navigation with fade
  const goToPrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent(prev => (prev - 1 + photos.length) % photos.length);
      setFade(true);
    }, 400);
  };
  const goToNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent(prev => (prev + 1) % photos.length);
      setFade(true);
    }, 400);
  };

  const currentPhoto = photos[current];

  return (
    <div style={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
          color: 'white',
          fontFamily: '"Space Mono", monospace, Arial, sans-serif',
          padding: '2rem 0'
        }}>
        <NavBar />
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              marginBottom: '2rem',
              textAlign: 'center',
              letterSpacing: '2px',
              color: '#f7c873'
            }}>
              EXPLORE MARS
            </h1>
            <p style={{
              textAlign: 'center',
              fontSize: '1.35rem',
              marginBottom: '2.5rem',
              color: '#ffe0b2',
              textShadow: '0 2px 8px #000'
            }}>
              Journey through the Red Planet with NASA's Mars Rover Gallery
            </p>
            {/* Auto-sliding Image Carousel */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto 2rem auto',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              background: 'rgba(30,30,40,0.7)',
              minHeight: '520px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {currentPhoto && (
                <>
                  <img
                    src={currentPhoto.img_src}
                    alt="Mars surface"
                    style={{
                      width: '100%',
                      height: '520px',
                      objectFit: 'cover',
                      opacity: fade ? 1 : 0,
                      transition: 'opacity 0.4s'
                    }}
                    loading="lazy"
                  />
                  {/* Navigation arrows */}
                  <button
                    aria-label="Previous image"
                    onClick={goToPrev}
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(30,30,40,0.6)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '2rem',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      zIndex: 2,
                      outline: 'none'
                    }}
                    tabIndex={0}
                  >&#8592;</button>
                  <button
                    aria-label="Next image"
                    onClick={goToNext}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(30,30,40,0.6)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '2rem',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      zIndex: 2,
                      outline: 'none'
                    }}
                    tabIndex={0}
                  >&#8594;</button>
                  {/* Dots indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.4rem'
                  }}>
                    {photos.map((_, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          width: idx === current ? '18px' : '10px',
                          height: '10px',
                          borderRadius: '5px',
                          background: idx === current ? '#f7c873' : 'rgba(255,255,255,0.3)',
                          transition: 'all 0.3s'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
      {/* Global styles */}
      <style jsx="true" global="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}