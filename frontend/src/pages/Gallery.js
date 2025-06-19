import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../components/NavBar';
import config from '../config/config';
// Rover and camera configuration
const ROVERS = ['curiosity', 'opportunity', 'spirit'];
const CAMERAS = {
  curiosity: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
  opportunity: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
  spirit: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES']
};

const CAMERA_NAMES = {
  FHAZ: 'Front Hazard Avoidance Camera',
  RHAZ: 'Rear Hazard Avoidance Camera',
  MAST: 'Mast Camera',
  CHEMCAM: 'Chemistry and Camera Complex',
  MAHLI: 'Mars Hand Lens Imager',
  MARDI: 'Mars Descent Imager',
  NAVCAM: 'Navigation Camera',
  PANCAM: 'Panoramic Camera',
  MINITES: 'Miniature Thermal Emission Spectrometer'
};

const FALLBACK_IMAGE = '/static/mars-images/fallback-mars.webp';

// Image component with error handling
const MarsImage = ({ photo }) => {
  const [imgSrc, setImgSrc] = useState(null); // changed from ''
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!photo.img_src) {
      setError(true);
      setLoading(false);
      setImgSrc(null); // ensure imgSrc is null if not available
      return;
    }

    // Normalize image URL
    let normalizedUrl = photo.img_src;
    if (normalizedUrl.startsWith('http://')) {
      normalizedUrl = normalizedUrl.replace('http://', 'https://');
    }
    if (normalizedUrl.includes('mars.jpl.nasa.gov')) {
      normalizedUrl = normalizedUrl.replace('mars.jpl.nasa.gov', 'mars.nasa.gov');
    }

    // Test if image is available
    const img = new window.Image();
    img.onload = () => {
      setImgSrc(normalizedUrl);
      setLoading(false);
      setError(false);
    };
    img.onerror = () => {
      setError(true);
      setLoading(false);
      setImgSrc(null); // ensure imgSrc is null if error
    };
    img.src = normalizedUrl;
  }, [photo.img_src]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(30, 30, 40, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: '#f7c873',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}

      {error ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(30, 30, 40, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f7c873',
          padding: '1rem',
          textAlign: 'center',
          height: '100%'
        }}>
          <span style={{ fontSize: '2rem' }}>🛰️</span>
          <p>No image available</p>
        </div>
      ) : (
        imgSrc && (
          <img
            src={imgSrc}
            alt={`Mars surface captured by ${photo.rover.name}'s ${photo.camera.full_name}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: !loading ? 'block' : 'none'
            }}
            loading="lazy"
          />
        )
      )}
    </div>
  );
};

// Main Gallery Component
export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    rover: 'curiosity',
    camera: '',
    sol: 1000,
    earth_date: '',
    page: 1
  });
  const [manifest, setManifest] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch manifest data when rover changes
  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/mars-manifest/${filters.rover}`);
        const data = await response.json();
        setManifest(data.photo_manifest);
      } catch (err) {
        console.error("Error fetching manifest:", err);
      }
    };
    fetchManifest();
  }, [filters.rover]);

  // Fetch photos when filters change
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        params.append('rover', filters.rover);
        if (filters.camera) params.append('camera', filters.camera);
        if (filters.sol) params.append('sol', filters.sol);
        if (filters.earth_date) params.append('earth_date', filters.earth_date);
        if (filters.page) params.append('page', filters.page);
        
        const response = await fetch(`${config.apiUrl}/api/mars-photos?${params.toString()}`);
        const data = await response.json();
        
        // Normalize the photo data structure
        const normalizedPhotos = data.photos.map(photo => ({
          id: photo.id,
          img_src: photo.img_src,
          rover: {
            name: photo.rover?.name || photo.rover_name || 'Unknown'
          },
          camera: {
            name: photo.camera?.name || photo.camera_name || 'Unknown',
            full_name: photo.camera?.full_name || CAMERA_NAMES[photo.camera?.name] || 'Unknown'
          },
          earth_date: photo.earth_date || 'Unknown',
          sol: photo.sol || 'Unknown'
        }));
        
        setPhotos(normalizedPhotos);
        setTotalPages(Math.ceil((data.total_photos || 1) / 25));
      } catch (err) {
        setError("Failed to load photos. Please try again.");
        console.error("Error fetching photos:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name !== 'page' && { page: 1 })
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const maxSol = manifest?.max_sol || 1000;
  const maxDate = manifest?.max_date || '2015-06-03';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      color: 'white',
      fontFamily: '"Space Mono", monospace, Arial, sans-serif',
      padding: '2rem 0'
    }}>
      <NavBar />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          marginBottom: '2rem',
          textAlign: 'center',
          letterSpacing: '2px',
          color: '#f7c873'
        }}>
          MARS ROVER PHOTO GALLERY
        </h1>

        {/* Filter Controls */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: 'rgba(30, 30, 40, 0.7)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            whileHover={{ background: 'rgba(50, 50, 70, 0.7)' }}
            whileTap={{ scale: 0.98 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <span style={{ fontSize: '1.2rem' }}>
              {showFilters ? '↑' : '↓'}
            </span>
          </motion.button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(20, 20, 30, 0.8)',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* Rover Selector */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f7c873' }}>
                    Rover
                  </label>
                  <select
                    name="rover"
                    value={filters.rover}
                    onChange={handleFilterChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'rgba(30, 30, 40, 0.7)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px'
                    }}
                  >
                    {ROVERS.map(rover => (
                      <option key={rover} value={rover}>
                        {rover.charAt(0).toUpperCase() + rover.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Camera Selector */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f7c873' }}>
                    Camera
                  </label>
                  <select
                    name="camera"
                    value={filters.camera}
                    onChange={handleFilterChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'rgba(30, 30, 40, 0.7)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">All Cameras</option>
                    {CAMERAS[filters.rover]?.map(cam => (
                      <option key={cam} value={cam}>
                        {cam} - {CAMERA_NAMES[cam]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sol Selector */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f7c873' }}>
                    Sol (Martian Day)
                  </label>
                  <input
                    type="number"
                    name="sol"
                    min="0"
                    max={maxSol}
                    value={filters.sol}
                    onChange={handleFilterChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'rgba(30, 30, 40, 0.7)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ fontSize: '0.8rem', marginTop: '0.3rem', opacity: 0.7 }}>
                    Max sol: {maxSol}
                  </div>
                </div>

                {/* Earth Date Selector */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f7c873' }}>
                    Earth Date
                  </label>
                  <input
                    type="date"
                    name="earth_date"
                    max={maxDate}
                    value={filters.earth_date}
                    onChange={handleFilterChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'rgba(30, 30, 40, 0.7)',
                      color: filters.earth_date ? 'white' : '#aaa',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ fontSize: '0.8rem', marginTop: '0.3rem', opacity: 0.7 }}>
                    Max date: {maxDate}
                  </div>
                </div>
              </div>

              {/* Manifest Info */}
              {manifest && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  <div><strong>Mission:</strong> {manifest.name}</div>
                  <div><strong>Status:</strong> {manifest.status}</div>
                  <div><strong>Launch Date:</strong> {manifest.launch_date}</div>
                  <div><strong>Landing Date:</strong> {manifest.landing_date}</div>
                  <div><strong>Total Photos:</strong> {manifest.total_photos.toLocaleString()}</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        {!loading && (
          <div style={{
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              Showing {photos.length} photos
              {filters.camera && ` from ${CAMERA_NAMES[filters.camera]}`}
              {filters.sol && ` on sol ${filters.sol}`}
              {filters.earth_date && ` on Earth date ${filters.earth_date}`}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span>Page:</span>
                <select
                  value={filters.page}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  style={{
                    padding: '0.3rem 0.5rem',
                    background: 'rgba(30, 30, 40, 0.7)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px'
                  }}
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ))}
                </select>
                <span>of {totalPages}</span>
              </div>
            )}
          </div>
        )}

        {/* Loading/Error States */}
        {loading && (
          <div style={{
            textAlign: 'center',
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
            <p>Loading photos from Mars...</p>
          </div>
        )}

        {error && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'rgba(150, 30, 30, 0.3)',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#ff6b6b' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Photo Grid */}
        {!loading && !error && (
          <>
            {photos.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'rgba(30, 30, 40, 0.5)',
                borderRadius: '8px'
              }}>
                <p>No photos found for the selected filters.</p>
                <p>Try adjusting your search criteria.</p>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  {photos.map(photo => (
                    <motion.div
                      key={photo.id}
                      style={{
                        background: 'rgba(30, 30, 40, 0.7)',
                        borderRadius: '8px',
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
                      <div style={{ height: '220px', position: 'relative' }}>
                        <MarsImage photo={photo} />
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          padding: '1rem',
                          color: 'white'
                        }}>
                          <div style={{ fontWeight: 'bold' }}>
                            {photo.camera.name} - Sol {photo.sol}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        padding: '1rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ color: '#f7c873' }}>ROVER:</span> {photo.rover.name}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ color: '#f7c873' }}>CAMERA:</span> {photo.camera.full_name}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ color: '#f7c873' }}>EARTH DATE:</span> {photo.earth_date}
                        </div>
                        <div>
                          <span style={{ color: '#f7c873' }}>SOL:</span> {photo.sol}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '2rem',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                      disabled={filters.page === 1}
                      style={{
                        padding: '0.5rem 1rem',
                        background: filters.page === 1 ? 'rgba(50, 50, 70, 0.5)' : 'rgba(30, 30, 40, 0.7)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        cursor: filters.page === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (filters.page <= 3) {
                        pageNum = i + 1;
                      } else if (filters.page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = filters.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: filters.page === pageNum ? '#f7c873' : 'rgba(30, 30, 40, 0.7)',
                            color: filters.page === pageNum ? '#111' : 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            minWidth: '40px'
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
                      disabled={filters.page === totalPages}
                      style={{
                        padding: '0.5rem 1rem',
                        background: filters.page === totalPages ? 'rgba(50, 50, 70, 0.5)' : 'rgba(30, 30, 40, 0.7)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        cursor: filters.page === totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Global styles */}
      <style jsx global>{`
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