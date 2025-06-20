import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// import GalleryPage from './pages/GalleryPage';
import GalleryPage from './pages/Gallery';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/chat" element={<Chat />} />
        {/* ...existing routes... */}
      </Routes>
    </Router>
  );
}

export default App;
