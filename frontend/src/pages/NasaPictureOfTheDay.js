import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import config from '../config/config';

export default function NasaPictureOfTheDay() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${config.apiUrl}/api/picture-of-the-day`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load NASA Picture of the Day.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      color: 'white',
      fontFamily: '"Space Mono", monospace, Arial, sans-serif',
      padding: '2rem 0'
    }}>
      <NavBar />
      <div style={{
        maxWidth: '700px',
        margin: '80px auto 0 auto',
        background: 'rgba(30,30,40,0.85)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        padding: '2.5rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 2.5rem)',
          marginBottom: '1.2rem',
          letterSpacing: '2px',
          color: '#f7c873'
        }}>
          NASA Picture of the Day
        </h1>
        {/* Loading/Error/Data */}
        {loading && (
          <div style={{ margin: '2rem 0', color: '#ffe0b2' }}>Loading...</div>
        )}
        {error && (
          <div style={{ margin: '2rem 0', color: '#ffb2b2' }}>{error}</div>
        )}
        {data && !loading && !error && (
          <div>
            <h2 style={{ color: '#f7c873', fontSize: '1.5rem', marginBottom: '1rem' }}>{data.title}</h2>
            {data.media_type === 'image' ? (
              <img
                src={data.url}
                alt={data.title}
                style={{
                  maxWidth: '100%',
                  borderRadius: '12px',
                  marginBottom: '1.2rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.25)'
                }}
              />
            ) : (
              <div style={{ marginBottom: '1.2rem' }}>
                <a href={data.url} target="_blank" rel="noopener noreferrer" style={{ color: '#f7c873' }}>
                  View media
                </a>
              </div>
            )}
            <textarea
              value={data.explanation}
              readOnly
              style={{
                width: '100%',
                minHeight: '120px',
                resize: 'vertical',
                fontSize: '1.08rem',
                color: '#fff',
                background: 'rgba(30,30,40,0.95)',
                border: '1px solid #f7c873',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.2rem',
                fontFamily: '"Space Mono", monospace, Arial, sans-serif'
              }}
            />
            <div style={{ color: '#ffe0b2', fontSize: '0.98rem' }}>
              <span>{data.date}</span>
              {data.copyright && (
                <span style={{ marginLeft: '1rem' }}>© {data.copyright}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
