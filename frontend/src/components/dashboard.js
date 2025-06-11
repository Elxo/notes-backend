import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './dashboard.css'; // create this for any extra dashboard styles

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    API.get('/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(console.error);
  }, []);

  if (!user) {
    return (
      <div className="dashboard-skeleton">
        <div className="skeleton-title" />
        <div className="skeleton-line" />
      </div>
    );
  }

  return (
    <div className="card p-4 text-center fade-in">
      <h2>Welcome, {user.email}!</h2>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      <button onClick={onLogout} className="btn btn-outline-danger mt-3">
        Logout
      </button>
    </div>
  );
}
