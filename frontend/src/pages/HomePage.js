import React, { useEffect, useState, useRef } from 'react';
import NavBar from '../components/NavBar';

// Use public/static paths for images, now with captions and alt text
const staticPhotos = [
  {
    img_src: process.env.PUBLIC_URL + '/static/land.webp',
    caption: "Martian Landscape",
    alt: "A panoramic view of the Martian surface with rocky terrain"
  },
  {
    img_src: process.env.PUBLIC_URL + '/static/opportunity.webp',
    caption: "Opportunity Rover Selfie",
    alt: "NASA's Opportunity rover taking a selfie on Mars"
  },
  {
    img_src: process.env.PUBLIC_URL + '/static/dust.webp',
    caption: "Dust Storm on Mars",
    alt: "A swirling dust storm captured on the Martian surface"
  }
];

export default function HomePage() {
  const [photos] = useState(staticPhotos);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const intervalRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line
  }, [photos, current]);

  // Auto-slide logic with fade effect
  useEffect(() => {
    if (photos.length > 0) {
      intervalRef.current = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrent(prev => (prev + 1) % photos.length);
          setFade(true);
        }, 400);
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

  const goToIdx = (idx) => {
    if (idx === current) return;
    setFade(false);
    setTimeout(() => {
      setCurrent(idx);
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
        {/* Welcome/Intro Card */}
        <div style={{
          maxWidth: '700px',
          margin: '0 auto 2rem auto',
          background: 'rgba(30,30,40,0.85)',
          borderRadius: '18px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          padding: '2rem 1.5rem',
          textAlign: 'center'
        }}>
          <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              marginBottom: '1rem',
              letterSpacing: '2px',
              color: '#f7c873'
            }}>
              EXPLORE MARS
            </h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '0.7rem',
              color: '#ffe0b2',
              textShadow: '0 2px 8px #000'
            }}>
              Journey through the Red Planet with NASA's Mars Rover Gallery.
            </p>
            <p style={{
              fontSize: '1.05rem',
              color: '#e0e0e0',
              marginBottom: 0
            }}>
              Browse Mars rover photos, view weather data, and ask questions about Mars exploration!
            </p>
        </div>
        {/* Carousel */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
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
                    alt={currentPhoto.alt}
                    style={{
                      width: '100%',
                      height: '520px',
                      objectFit: 'cover',
                      opacity: fade ? 1 : 0,
                      transition: 'opacity 0.4s'
                    }}
                    loading="lazy"
                  />
                  {/* Overlay gradient for caption readability */}
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0, bottom: 0,
                    height: '90px',
                    background: 'linear-gradient(0deg, rgba(30,30,40,0.85) 70%, rgba(30,30,40,0.1) 100%)',
                    zIndex: 1
                  }} />
                  {/* Caption */}
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0, bottom: 18,
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textShadow: '0 2px 8px #000',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}>
                    {currentPhoto.caption}
                  </div>
                  {/* Navigation arrows */}
                  <button
                    aria-label="Previous image"
                    onClick={goToPrev}
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(30,30,40,0.7)',
                      border: '2px solid #f7c873',
                      color: '#fff',
                      fontSize: '2.3rem',
                      borderRadius: '50%',
                      width: '54px',
                      height: '54px',
                      cursor: 'pointer',
                      zIndex: 4,
                      outline: 'none',
                      boxShadow: '0 2px 8px #000',
                      transition: 'background 0.2s, border 0.2s'
                    }}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToPrev(); }}
                    onMouseOver={e => e.currentTarget.style.background = '#f7c873'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(30,30,40,0.7)'}
                  >&#8592;</button>
                  <button
                    aria-label="Next image"
                    onClick={goToNext}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(30,30,40,0.7)',
                      border: '2px solid #f7c873',
                      color: '#fff',
                      fontSize: '2.3rem',
                      borderRadius: '50%',
                      width: '54px',
                      height: '54px',
                      cursor: 'pointer',
                      zIndex: 4,
                      outline: 'none',
                      boxShadow: '0 2px 8px #000',
                      transition: 'background 0.2s, border 0.2s'
                    }}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToNext(); }}
                    onMouseOver={e => e.currentTarget.style.background = '#f7c873'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(30,30,40,0.7)'}
                  >&#8594;</button>
                  {/* Dots indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.4rem',
                    zIndex: 5
                  }}>
                    {photos.map((_, idx) => (
                      <button
                        key={idx}
                        aria-label={`Go to image ${idx + 1}`}
                        onClick={() => goToIdx(idx)}
                        style={{
                          display: 'inline-block',
                          width: idx === current ? '18px' : '10px',
                          height: '10px',
                          borderRadius: '5px',
                          background: idx === current ? '#f7c873' : 'rgba(255,255,255,0.3)',
                          border: 'none',
                          margin: 0,
                          padding: 0,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          outline: 'none'
                        }}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToIdx(idx); }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Feature Cards/Quick Links */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.5rem',
              margin: '2.5rem 0 1.5rem 0'
            }}>
              {/* Gallery Card */}
              <a href="/gallery" style={{
                flex: '1 1 220px',
                maxWidth: '260px',
                background: 'rgba(30,30,40,0.92)',
                borderRadius: '14px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                padding: '1.3rem 1rem',
                textDecoration: 'none',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.18s, box-shadow 0.18s, background 0.18s',
                border: '2px solid transparent'
              }}
                tabIndex={0}
                aria-label="Go to Mars Gallery"
                onMouseOver={e => { e.currentTarget.style.background = '#2d2d44'; e.currentTarget.style.border = '2px solid #f7c873'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(30,30,40,0.92)'; e.currentTarget.style.border = '2px solid transparent'; }}
              >
                <span style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }} role="img" aria-label="Gallery">&#128247;</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>Gallery</span>
                <span style={{ fontSize: '0.98rem', color: '#ffe0b2', textAlign: 'center' }}>Browse Mars rover photos</span>
              </a>
              {/* Weather Card */}
              <a href="/weather" style={{
                flex: '1 1 220px',
                maxWidth: '260px',
                background: 'rgba(30,30,40,0.92)',
                borderRadius: '14px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                padding: '1.3rem 1rem',
                textDecoration: 'none',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.18s, box-shadow 0.18s, background 0.18s',
                border: '2px solid transparent'
              }}
                tabIndex={0}
                aria-label="Go to Mars Weather"
                onMouseOver={e => { e.currentTarget.style.background = '#2d2d44'; e.currentTarget.style.border = '2px solid #f7c873'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(30,30,40,0.92)'; e.currentTarget.style.border = '2px solid transparent'; }}
              >
                <span style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }} role="img" aria-label="Weather">&#9925;</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>Weather</span>
                <span style={{ fontSize: '0.98rem', color: '#ffe0b2', textAlign: 'center' }}>See latest Mars weather data</span>
              </a>
              {/* Chat/Ask Card */}
              <a href="/gallery" style={{
                flex: '1 1 220px',
                maxWidth: '260px',
                background: 'rgba(30,30,40,0.92)',
                borderRadius: '14px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                padding: '1.3rem 1rem',
                textDecoration: 'none',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.18s, box-shadow 0.18s, background 0.18s',
                border: '2px solid transparent'
              }}
                tabIndex={0}
                aria-label="Ask a Question"
                onMouseOver={e => { e.currentTarget.style.background = '#2d2d44'; e.currentTarget.style.border = '2px solid #f7c873'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(30,30,40,0.92)'; e.currentTarget.style.border = '2px solid transparent'; }}
              >
                <span style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }} role="img" aria-label="Chat">&#128172;</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>Ask a Question</span>
                <span style={{ fontSize: '0.98rem', color: '#ffe0b2', textAlign: 'center' }}> Browse the Gallery and ask about any photo</span>
              </a>
            </div>
            {/* Call to Action */}
            <div style={{ textAlign: 'center', margin: '2.5rem 0 0 0' }}>
              <a href="/gallery"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(90deg, #f7c873 60%, #ffb347 100%)',
                  color: '#1b2735',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  padding: '0.85rem 2.2rem',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
                  letterSpacing: '1px',
                  transition: 'background 0.18s, color 0.18s'
                }}
                tabIndex={0}
                aria-label="Explore the Mars Gallery"
                onMouseOver={e => { e.currentTarget.style.background = '#ffe0b2'; e.currentTarget.style.color = '#1b2735'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #f7c873 60%, #ffb347 100%)'; e.currentTarget.style.color = '#1b2735'; }}
              >
                Explore Gallery
              </a>
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
        @media (max-width: 900px) {
          div[style*="minHeight: '520px'"] img { height: 340px !important; }
        }
        @media (max-width: 600px) {
          div[style*="maxWidth: '1000px'"] {
            min-height: 220px !important;
          }
          div[style*="minHeight: '520px'"] img {
            height: 180px !important;
          }
          div[style*="padding: '2rem 1.5rem'"] {
            padding: 1.2rem 0.5rem !important;
          }
          div[style*="display: 'flex'"][style*="flexWrap: 'wrap'"] {
            flex-direction: column !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}