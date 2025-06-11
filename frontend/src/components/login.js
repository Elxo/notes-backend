import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login }     from '../services/api';
import houseIcon     from '../images/house.svg';
import './auth.css';

export default function Login({ onAuth }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      onAuth();
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="home-button">
          <Link to="/"><img src={houseIcon} alt="Home" className="home-icon"/></Link>
        </div>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary w-100"
          >
            Sign In
          </button>
        </form>
        <p className="switch-link">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
