import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config/config';

// Reuse MarsImage from Gallery.js
const MarsImage = ({ photo }) => {
  const [imgSrc, setImgSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!photo.img_src) {
      setError(true);
      setLoading(false);
      setImgSrc(null);
      return;
    }
    let normalizedUrl = photo.img_src;
    if (normalizedUrl.startsWith('http://')) {
      normalizedUrl = normalizedUrl.replace('http://', 'https://');
    }
    if (normalizedUrl.includes('mars.jpl.nasa.gov')) {
      normalizedUrl = normalizedUrl.replace('mars.jpl.nasa.gov', 'mars.nasa.gov');
    }
    const img = new window.Image();
    img.onload = () => {
      setImgSrc(normalizedUrl);
      setLoading(false);
      setError(false);
    };
    img.onerror = () => {
      setError(true);
      setLoading(false);
      setImgSrc(null);
    };
    img.src = normalizedUrl;
  }, [photo.img_src]);

  return (
    <div style={{ position: 'relative', height: '260px', width: '100%', marginBottom: '1.5rem' }}>
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
              display: !loading ? 'block' : 'none',
              borderRadius: '8px'
            }}
            loading="lazy"
          />
        )
      )}
    </div>
  );
};

// New component for asking questions and displaying answers
function RoverQuestionBox({ photo }) {
  const [question, setQuestion] = useState('');
 
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [displayedText, setDisplayedText] = useState(''); // For typewriter effect



  // Typewriter effect for generatedText
  React.useEffect(() => {
    if (!generatedText) {
      setDisplayedText('');
      return;
    }
    console.log('generatedText while printing:', generatedText); // Print the generated text
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      // Fix: Only add character if it exists (avoid undefined)
      setDisplayedText(prev => prev + (generatedText[i] !== undefined ? generatedText[i] : ''));
      i++;
      if (i >= generatedText.length) clearInterval(interval);
    }, 18); // Adjust speed here (ms per character)
    return () => clearInterval(interval);
  }, [generatedText]);

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
   
    // setGeneratedText('');
    setDisplayedText('');
    try {
      // Build the payload as per the required format
      const formattedPayload = {
        question,
        photo: {
          id: photo?.id,
          img_src: photo?.img_src,
          rover: { name: photo?.rover?.name },
          camera: {
            name: photo?.camera?.name,
            full_name: photo?.camera?.full_name
          },
          earth_date: photo?.earth_date,
          sol: photo?.sol
        }
      };
      // Send to backend
      console.log("payload ", formattedPayload)
      const res = await fetch(`${config.apiUrl}/api/rover-qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedPayload)
      });
      const data = await res.json();
      console.log("got data ", data);
      // Fix: Prefer data.generatedText, fallback to data.answer, but never append undefined
      const text = data.generatedText !== undefined
        ? data.generatedText
        : (data.answer !== undefined ? data.answer : '');
     
      setGeneratedText(text);
    } catch (err) {
     
      setGeneratedText('');
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: 'rgba(30, 30, 40, 0.7)',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '2rem',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <form onSubmit={handleAsk} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ color: '#f7c873', fontWeight: 'bold' }}>
          Ask a question about this rover/photo:
        </label>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={3}
          style={{
            resize: 'vertical',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #444',
            fontFamily: 'inherit',
            fontSize: '1rem'
          }}
          placeholder="Type your question here..."
          required
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          style={{
            padding: '0.5rem 1.2rem',
            background: '#f7c873',
            color: '#222',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>
      {/* Display the answer/typewriter effect */}
      <div style={{ marginTop: '1.5rem' }}>
        <label style={{ color: '#f7c873', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
          Answer:
        </label>
        <textarea
          value={displayedText}
          readOnly
          rows={5}
          style={{
            width: '100%',
            resize: 'vertical',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #444',
            fontFamily: 'inherit',
            fontSize: '1rem',
            background: '#222',
            color: '#f7c873'
          }}
          placeholder="text will appear here..."
        />
      </div>
    </div>
  );
}

function RoverInfoCard({ photo, manifest }) {
  return (
    <div style={{
      background: 'rgba(30, 30, 40, 0.85)',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      marginBottom: '2rem',
      padding: '0 0 1rem 0'
    }}>
      <MarsImage photo={photo} />
      <div style={{
        padding: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem', color: '#f7c873' }}>
          {photo.rover.name} Rover
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: '#f7c873' }}>CAMERA:</span> {photo.camera.full_name}
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: '#f7c873' }}>EARTH DATE:</span> {photo.earth_date}
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: '#f7c873' }}>SOL:</span> {photo.sol}
        </div>
        {manifest && (
          <div style={{
            marginTop: '1rem',
            padding: '0.8rem',
            background: 'rgba(0,0,0,0.18)',
            borderRadius: '6px',
            fontSize: '0.98rem'
          }}>
            <div><span style={{ color: '#f7c873' }}>Mission Status:</span> {manifest.status}</div>
            <div><span style={{ color: '#f7c873' }}>Launch Date:</span> {manifest.launch_date}</div>
            <div><span style={{ color: '#f7c873' }}>Landing Date:</span> {manifest.landing_date}</div>
            <div><span style={{ color: '#f7c873' }}>Max Sol:</span> {manifest.max_sol}</div>
            <div><span style={{ color: '#f7c873' }}>Max Date:</span> {manifest.max_date}</div>
            <div><span style={{ color: '#f7c873' }}>Total Photos:</span> {manifest.total_photos?.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate(); // Add this line
  const photo = location.state?.photo;
  const [manifest, setManifest] = useState(null);

  // Fetch rover manifest for more info
  useEffect(() => {
    async function fetchManifest() {
      if (!photo?.rover?.name) return;
      try {
        const res = await fetch(`${config.apiUrl}/api/mars-manifest/${photo.rover.name.toLowerCase()}`);
        const data = await res.json();
        setManifest(data.photo_manifest);
      } catch (e) {
        setManifest(null);
      }
    }
    fetchManifest();
  }, [photo]);



  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      color: 'white',
      fontFamily: '"Space Mono", monospace, Arial, sans-serif',
      padding: '2rem 0'
    }}>
      {/* Pass navigate to NavBar if NavBar expects it, or ensure NavBar uses Link/Outlet from react-router-dom */}
      <NavBar navigate={navigate} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          letterSpacing: '2px',
          color: '#f7c873'
        }}>
          Chat Page
        </h2>
        {photo ? (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '2.5rem',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Rover details + manifest card */}
            <div style={{
              flex: '0 0 350px',
              minWidth: '300px',
              maxWidth: '420px'
            }}>
              <RoverInfoCard photo={photo} manifest={manifest} />
            </div>
            {/* Chat/question box beside details */}
            <div style={{
              flex: '1 1 500px',
              minWidth: '350px',
              maxWidth: '700px',
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              <RoverQuestionBox photo={photo} />
            </div>
          </div>
        ) : (
          <div>No photo details provided.</div>
        )}
      </div>
      <style jsx="true" global="true">{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
