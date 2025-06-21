import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import config from '../config/config';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Title } from 'chart.js';
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Title);

export default function Weatherforcast() {
  const [allData, setAllData] = useState(null);
  const [solKeys, setSolKeys] = useState([]);
  const [sol, setSol] = useState('');
  const [weather, setWeather] = useState(null);
  const [summary, setSummary] = useState('');
  const [displayedSummary, setDisplayedSummary] = useState('');

  useEffect(() => {
    // Fetch the entire data object from backend (assume /api/mars-weather returns the full object)
    fetch(`${config.apiUrl}/api/mars-weather`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setAllData(data);
        if (data.sol_keys && data.sol_keys.length > 0) {
          setSolKeys(data.sol_keys);
          setSol(data.sol_keys[data.sol_keys.length - 1]);
        }
      });
  }, []);


  useEffect(() => {
    if (!allData || !sol) return;
    setWeather(allData[sol]);
  }, [allData, sol]);

  // Fetch summary from backend when weather changes
  useEffect(() => {
    if (!weather) return;
    // Fetch summary from backend
    setSummary(''); // Clear previous summary while loading
    fetch(`${config.apiUrl}/api/mars-weather-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weather)
    })
      .then(res => res.json())
      .then(data => {
        if (data.summary) setSummary(data.summary);
        else setSummary('No summary available.');
      })
      .catch(() => setSummary('Failed to fetch summary.'));
  }, [weather]);

  // Typewriter effect for summary
  useEffect(() => {
    if (!summary) {
      setDisplayedSummary('');
      return;
    }
    setDisplayedSummary('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedSummary(prev => summary.slice(0, i + 1));
      i++;
      if (i >= summary.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [summary]);

  // Prepare wind data for chart
  let chartData = null;
  let chartOptions = null;
  let windData = [];
  console.log("weather according to sol", JSON.stringify(weather))
  if (weather && weather.WD) {
    windData = Object.entries(weather.WD)
      .filter(([key, wd]) => key !== 'most_common' && typeof wd === 'object' && wd.ct)
      .map(([key, wd]) => ({
        direction: wd.compass_point,
        degrees: wd.compass_degrees,
        count: wd.ct
      }));
    if (windData.length > 0) {
      chartData = {
        labels: windData.map(wd => wd.direction),
        datasets: [{
          label: 'Wind Direction Frequency',
          data: windData.map(wd => wd.count),
          backgroundColor: [
            'rgba(255, 168, 0, 0.6)',
            'rgba(247, 200, 115, 0.6)',
            'rgba(255, 224, 178, 0.6)',
            'rgba(255, 111, 97, 0.6)',
            'rgba(26, 39, 53, 0.6)',
            'rgba(10, 10, 20, 0.6)',
            'rgba(255, 255, 255, 0.6)',
          ],
          borderColor: '#f7c873',
          borderWidth: 1
        }]
      };
      chartOptions = {
        plugins: { title: { display: true, text: `Wind Rose for Sol ${sol}` } },
        scales: { r: { beginAtZero: true } },
      };
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      color: 'white',
      fontFamily: '"Space Mono", monospace, Arial, sans-serif',
      padding: '2rem 0',
      boxSizing: 'border-box',
    }}>
      <NavBar />
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 1rem' }}>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3rem)',
          marginBottom: '1.2rem',
          textAlign: 'center',
          letterSpacing: '2px',
          color: '#f7c873'
        }}>
          Mars Wind Rose Chart
        </h1>
        <p style={{
          maxWidth: 1200,
          margin: '0 auto 2.2rem auto',
          textAlign: 'center',
          color: '#ffe0b2',
          fontSize: '1.18rem',
          background: 'rgba(30,30,50,0.7)',
          borderRadius: 10,
          padding: '1rem 1.5rem',
          boxShadow: '0 2px 12px #0005',
        }}>
          <b>What is a Sol?</b> A <b>Sol</b> is a Martian day, which is about 24 hours and 39 minutes long—slightly longer than an Earth day. Use the dropdown below to select a Sol and explore the wind patterns and weather data for that specific Martian day. The chart and weather details will update based on your selection.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: 600,
          gap: 48,
          marginBottom: 80,
        }}>
          {/* Chart and Weather Info */}
          {weather && (
            <div style={{ width: '90%', maxWidth: 950, background: '#CCCCFF', color: '#FFFFFF', padding: '24px 24px 24px 48px', borderRadius: 18, boxShadow: '0 2px 16px #0007', boxSizing: 'border-box', margin: 0 }}>
              {/* Sol Dropdown inside chart div */}
              <form onSubmit={e => { e.preventDefault(); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <label htmlFor="sol" style={{ fontWeight: 'bold', marginRight: 8, fontSize: 18, color: '#f7c873' }}>Select Sol:</label>
                <select
                  id="sol"
                  value={sol}
                  onChange={e => setSol(e.target.value)}
                  style={{
                    width: 120,
                    padding: '0.5rem 1rem',
                    borderRadius: 6,
                    border: '1px solid #f7c873',
                    background: '#181828',
                    color: '#f7c873',
                    fontSize: '1.2rem',
                    outline: 'none',
                  }}
                >
                  {solKeys.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </form>
              <h2 style={{ color: '#f7c873', marginBottom: 18, textAlign: 'center' }}>Wind Rose for Sol {sol}</h2>
              <div style={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
                {chartData ? <PolarArea data={chartData} options={chartOptions} /> : <div>No wind data</div>}
              </div>
              <div style={{ marginTop: 28, fontSize: 19, textAlign: 'center' }}>
                <span role="img" aria-label="thermometer">🌡️</span> Temp: <b>{weather.AT?.av ? weather.AT.av.toFixed(1) : 'N/A'}°C</b> &nbsp; | &nbsp;
                <span role="img" aria-label="barometer">⏲️</span> Pressure: <b>{weather.PRE?.av ? weather.PRE.av.toFixed(1) : 'N/A'} Pa</b>
              </div>
            </div>
          )}
          {/* Textarea on the right, top-aligned */}
          <div style={{ minWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', height: 'auto', marginTop: 0 }}>
            {/* Textarea below Sol dropdown */}
            <textarea
              style={{
                marginTop: 32,
                width: 700,
                maxWidth: '90%',
                minHeight: 400,
                resize: 'vertical',
                borderRadius: 10,
                border: '1px solid #f7c873',
                background: '#181828',
                color: '#ffe0b2',
                fontSize: '1.1rem',
                padding: '1rem',
                boxShadow: '0 2px 12px #0005',
                fontFamily: 'inherit',
              }}
              placeholder="Mars weather summary will appear here..."
              value={displayedSummary}
              readOnly
            />
          </div>
        </div>
      </div>
      <style jsx="true" global="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        @media (max-width: 1000px) {
          .chart-card { max-width: 98vw !important; padding: 1rem !important; }
        }
        @media (max-width: 700px) {
          .chart-card, .chart-inner { max-width: 100vw !important; padding: 0.5rem !important; }
        }
      `}</style>
    </div>
  );
}