import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const NAV_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Rovers', href: '#' },
  { label: 'API Info', href: '#' },
  { label: 'Contact', href: '#' },
];

const MARS_PHOTOS = [
  { id: 1, img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG' },
  { id: 2, img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FRB_486265257EDR_F0481570FHAZ00323M_.JPG' },
  { id: 3, img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/rcam/RLB_486265291EDR_F0481570RHAZ00323M_.JPG' },
  { id: 4, img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG' },
  // Add more placeholder images as needed
];

export default function HomePage() {
  const [photos, setPhotos] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

  // For demo purposes, using placeholder images
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhotos(MARS_PHOTOS);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Real API fetch would look like this:
  /*
  useEffect(() => {
    fetch('/api/mars-photos?rover=curiosity&sol=1000')
      .then(res => res.json())
      .then(data => {
        setPhotos(data.photos || []);
        setLoading(false);
      })
      .catch(() => {
        setPhotos(MARS_PHOTOS); // Fallback to placeholder images
        setLoading(false);
      });
  }, []);
  */

  useEffect(() => {
    if (photos.length > 1) {
      intervalRef.current = setInterval(() => {
        if (!isHovering) {
          setBgIndex(prev => (prev + 1) % photos.length);
        }
      }, 3000);
      return () => clearInterval(intervalRef.current);
    }
  }, [photos.length, isHovering]);

  const bgPhoto = photos[bgIndex]?.img_src;

  return (
    
   <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
        color: 'white',
        fontFamily: '"Space Mono", monospace, Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '80px' // Add padding to account for fixed NavBar
      }}
    >
      {/* NavBar should be fixed at the top with highest z-index */}
      <NavBar />
        
      <div style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Animated Background Images */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: bgPhoto 
                ? `url(${bgPhoto}) center center / cover no-repeat fixed`
                : 'none',
              zIndex: 1
            }}
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.9) 0%, rgba(70, 20, 30, 0.6) 100%)',
          zIndex: 2
        }} />

        {/* Starfield effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          zIndex: 3,
          overflow: 'hidden'
        }}>
          {Array.from({ length: 100 }).map((_, i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                background: 'white',
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 4 }}>
          {/* Navigation */}
          

          {/* Title */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', padding: '0 1rem' }}
          >
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '0.2rem',
              margin: '1.5rem 0 0.5rem 0',
              textShadow: '0 2px 16px #000',
              fontWeight: 700
            }}>
              MARS ROVER GALLERY
            </h1>
            <motion.p 
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                marginBottom: '2rem',
                color: '#f7c873',
                textShadow: '0 2px 8px #000',
                maxWidth: '800px',
                margin: '0 auto 2rem',
                lineHeight: 1.6
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              "Journey across the Martian landscape through the lenses of NASA's Curiosity, Perseverance, and Opportunity rovers."
            </motion.p>
          </motion.div>

          {/* Gallery Preview */}
          <motion.section 
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '2rem 1rem',
              background: 'rgba(10, 10, 20, 0.7)',
              borderRadius: '1rem',
              boxShadow: '0 0 40px 0 #000a',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '3rem'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '2rem', 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              letterSpacing: '2px',
              color: '#f7c873'
            }}>
              LATEST PHOTOS FROM SOL 1000
            </h2>
            
            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#b0c4de',
                padding: '3rem 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTopColor: '#f7c873',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p>Connecting to Mars satellites...</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                {photos.slice(0, 12).map(photo => (
                  <motion.div 
                    key={photo.id} 
                    style={{
                      background: 'rgba(30, 30, 40, 0.7)',
                      borderRadius: '0.7rem',
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'transform 0.3s ease'
                    }}
                    whileHover={{ 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div style={{
                      height: '200px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img
                        src={photo.img_src}
                        alt={`Mars landscape`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        padding: '1rem',
                        color: 'white'
                      }}>
                        <div style={{ fontWeight: 'bold' }}>SOL 1000</div>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      fontSize: '0.95rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ marginBottom: '0.5rem' }}><span style={{ color: '#f7c873' }}>ROVER:</span> Curiosity</div>
                      <div style={{ marginBottom: '0.5rem' }}><span style={{ color: '#f7c873' }}>CAMERA:</span> Mast Camera</div>
                      <div><span style={{ color: '#f7c873' }}>DATE:</span> 2015-05-30</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* Footer */}
          <footer style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.9rem'
          }}>
            <p>NASA Mars Rover Imagery API | Not affiliated with NASA</p>
            <p style={{ marginTop: '0.5rem' }}>© {new Date().getFullYear()} Mars Exploration Project</p>
          </footer>
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes twinkle {
          from { opacity: 0.2; }
          to { opacity: 1; }
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