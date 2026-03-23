import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AIChatbot from './components/AIChatbot';
import Home from './pages/Home';
import About from './pages/About';
import Materials from './pages/Materials';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import Login from './pages/Login';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Navigation />
        
        <main style={{ flex: 1, padding: '32px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
          </Routes>
        </main>

        <AIChatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;