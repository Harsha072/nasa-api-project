import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// import GalleryPage from './pages/GalleryPage';
import GalleryPage from './pages/Gallery';
import Chat from './pages/Chat';
import Weatherforcast from './pages/Weatherforecast';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/weather" element={<Weatherforcast />} />
        <Route path="/about" element={<About />} />
        {/* ...existing routes... */}
      </Routes>
    </Router>
  );
}

export default App;
