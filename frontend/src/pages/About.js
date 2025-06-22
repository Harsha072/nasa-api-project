import React from 'react';
import NavBar from '../components/NavBar';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function About() {
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
        maxWidth: '800px',
        margin: '80px auto 0 auto',
        background: 'rgba(30,30,40,0.85)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        padding: '2.5rem 2rem'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 2.7rem)',
          marginBottom: '1.2rem',
          letterSpacing: '2px',
          color: '#f7c873',
          textAlign: 'center'
        }}>
          About This Project
        </h1>
        <p style={{ fontSize: '1.18rem', color: '#ffe0b2', marginBottom: '1.5rem', textAlign: 'center' }}>
          Welcome to your gateway to Mars! This web app lets you explore the Red Planet through the eyes of NASA’s legendary rovers. Every photo, weather report, and mission detail you see here comes directly from NASA’s official public APIs—so you’re always viewing real, authentic data straight from Mars.
        </p>
        <p style={{ fontSize: '1.08rem', color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>
          Whether you’re a space enthusiast, a student, or just curious about our neighboring planet, you’ll find something to spark your imagination. Browse stunning rover images, dive into daily Martian weather, and ask questions powered by advanced AI—making Mars exploration interactive and fun for everyone.
        </p>
        <h2 style={{ color: '#f7c873', fontSize: '1.3rem', marginTop: '2rem' }}>Key Features</h2>
        <ul style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          <li>Browse Mars Rover photos by date, rover, and camera</li>
          <li>View mission summaries and rover details</li>
          <li>See daily Mars weather data, updated from NASA’s InSight lander</li>
          <li>Ask questions about Mars photos and get instant, AI-powered answers</li>
          <li>Enjoy AI-generated, easy-to-read summaries of complex Mars weather data</li>
        </ul>
        <h2 style={{ color: '#f7c873', fontSize: '1.3rem', marginTop: '2rem' }}>How It Works</h2>
        <p style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1.5rem' }}>
          All data—photos, weather, and mission info—is fetched live from NASA’s open APIs. The app never uses fake or simulated data: what you see is what NASA’s rovers and landers have actually recorded on Mars. Our backend securely connects to NASA and OpenAI, ensuring your experience is both safe and up-to-date.
        </p>
        <h2 style={{ color: '#f7c873', fontSize: '1.3rem', marginTop: '2rem' }}>Technologies Used</h2>
        <ul style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          <li>NASA APIs (Mars Rover Photos, InSight Weather)</li>
          <li>OpenAI for Q&amp;A and weather summaries</li>
          <li>Node.js / Express backend for secure API access</li>
          <li>React frontend for a fast, interactive experience</li>
        </ul>
        <h2 style={{ color: '#f7c873', fontSize: '1.3rem', marginTop: '2rem' }}>Why You'll Love It</h2>
        <ul style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          <li>All content is real and sourced from NASA—no guesswork, just science!</li>
          <li>Ask anything about Mars photos and get answers in seconds</li>
          <li>Perfect for learning, teaching, or just exploring the wonders of Mars</li>
          <li>Beautiful, immersive design that brings space exploration to your screen</li>
        </ul>
        <h2 style={{ color: '#f7c873', fontSize: '1.3rem', marginTop: '2rem' }}>Purpose</h2>
        <p style={{ fontSize: '1.08rem', color: '#fff', marginBottom: 0 }}>
          To make Mars exploration data accessible, engaging, and inspiring for everyone. Dive in, explore, and let your curiosity take flight!
        </p>
        {/* Contacts Section */}
        <h2 style={{ color: '#f7c873', fontSize: '1.3rem', marginTop: '2.5rem' }}>Contacts</h2>
        <ul style={{ fontSize: '1.05rem', color: '#fff', marginBottom: 0, lineHeight: 1.7, listStyle: 'none', paddingLeft: 0 }}>
          <li>
            Email: <a href="mailto:harshaswamy789@gmail.com" style={{ color: '#f7c873' }}>harshaswamy789@gmail.com</a>
          </li>
          <li style={{ marginTop: '0.7rem', display: 'flex', alignItems: 'center' }}>
            <FaGithub style={{ marginRight: '0.5rem', color: '#f7c873', fontSize: '1.3rem' }} />
            <a href="https://github.com/Harsha072" target="_blank" rel="noopener noreferrer" style={{ color: '#f7c873', textDecoration: 'none' }}>
              GitHub
            </a>
          </li>
          <li style={{ marginTop: '0.7rem', display: 'flex', alignItems: 'center' }}>
            <FaLinkedin style={{ marginRight: '0.5rem', color: '#f7c873', fontSize: '1.3rem' }} />
            <a href="https://www.linkedin.com/in/harsha-puttaswamy/" target="_blank" rel="noopener noreferrer" style={{ color: '#f7c873', textDecoration: 'none' }}>
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
