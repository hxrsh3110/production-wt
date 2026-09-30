import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { systemApi } from '../api/systemApi';

export function Navbar() {
  const [serverOnline, setServerOnline] = useState(false);
  const [dbMode, setDbMode] = useState('Checking...');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await systemApi.getHealth();
        setServerOnline(true);
        setDbMode(res.data?.database?.connected ? 'MongoDB Live' : 'In-Memory Cache');
      } catch (err) {
        setServerOnline(false);
        setDbMode('Backend Offline');
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo & Brand */}
          <NavLink to="/" className="brand-container">
            <div className="brand-logo-icon">⚡</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                ApexFit <span style={{ color: 'var(--accent-cyan)' }}>Studio OS</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Production Architecture
              </div>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
              Dashboard
            </NavLink>
            <NavLink to="/athletes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Athletes Hub
            </NavLink>
            <NavLink to="/session" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Live Session
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Analytics
            </NavLink>
            <NavLink to="/equipment" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Equipment
            </NavLink>
            <NavLink to="/engine" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              ES6 Engine
            </NavLink>
          </nav>

          {/* Live Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              className={`badge ${serverOnline ? 'badge-emerald' : 'badge-rose'}`}
              title="System Connectivity Status"
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: serverOnline ? '#10b981' : '#f43f5e',
                  display: 'inline-block'
                }}
              />
              {serverOnline ? `API :5000 • ${dbMode}` : 'API Disconnected'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
