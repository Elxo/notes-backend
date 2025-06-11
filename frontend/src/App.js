import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';
import API from './services/api';

import HomePage  from './pages/HomePage';
import Login     from './components/login';
import Register  from './components/register';
import Notes     from './components/Notes';

import heroBg    from './images/hero-bg.png';
import './App.css';

// Simple protected route wrapper
function ProtectedRoute({ isAuth, children }) {
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}

// Landing (home) view with hero + features + footer
function Landing({ scrolled }) {
  return (
    <>
      <header
        className="hero fade-opacity"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Personal Journal</h1>
          <p>For your ease of logging</p>
          <div className={`nav-buttons-static${scrolled ? ' hidden' : ''}`}>
            <Link to="/login"    className="btn btn-outline-light">Log In</Link>
            <Link to="/register" className="btn btn-light ms-2">Sign Up</Link>
          </div>
        </div>
      </header>
      <HomePage />
      {scrolled && (
        <div className="nav-buttons-fixed visible">
          <Link to="/login"    className="btn btn-outline-light">Log In</Link>
          <Link to="/register" className="btn btn-light ms-2">Sign Up</Link>
        </div>
      )}
    </>
  );
}

// Dashboard for authenticated users
function AuthenticatedApp({ onLogout }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/user/me')
      .then(res => setUser(res.data))
      .catch(() => {
        onLogout();
        navigate('/');
      });
  }, [onLogout, navigate]);

  if (!user) {
    return <p className="loading">Loading profile…</p>;
  }

  return (
    <div className="auth-main">
      <button
        className="logout-button"
        onClick={() => {
          onLogout();
          navigate('/');
        }}
      >
        Log Out
      </button>
      <div className="welcome-card">
        <h2>Welcome, {user.email}!</h2>
        <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
      <Notes />
    </div>
  );
}

export default function App() {
  const [isAuth, setIsAuth]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Check for valid token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/user/me')
        .then(() => setIsAuth(true))
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuth(false);
        });
    }
  }, []);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAuth   = () => setIsAuth(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing scrolled={scrolled} />} />
          <Route path="/login"    element={<Login    onAuth={handleAuth} />} />
          <Route path="/register" element={<Register onAuth={handleAuth} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <AuthenticatedApp onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <button
          className="dark-toggle"
          onClick={() => setDarkMode(dm => !dm)}
          aria-label="Toggle dark/light mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </BrowserRouter>
  );
}
