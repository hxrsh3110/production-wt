import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import AthletesPage from './pages/AthletesPage';
import ActiveSession from './pages/ActiveSession';
import Analytics from './pages/Analytics';
import EquipmentPage from './pages/EquipmentPage';
import EngineAlgorithms from './pages/EngineAlgorithms';
import { workoutApi } from './api/workoutApi';

export function App() {
  // Global workout logs state synced with localStorage (Exp 4)
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_production_workout_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toasts state
  const [toasts, setToasts] = useState([]);

  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync logs state with localStorage on change (Exp 4)
  useEffect(() => {
    try {
      localStorage.setItem('apex_production_workout_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [logs]);

  // Load existing workout logs from backend on mount
  useEffect(() => {
    const fetchExistingLogs = async () => {
      try {
        const res = await workoutApi.getLogs();
        if (res.data?.data && res.data.data.length > 0) {
          setLogs((prev) => {
            const existingIds = new Set(prev.map(l => l.id));
            const fresh = res.data.data.filter(l => !existingIds.has(l.id));
            return [...prev, ...fresh];
          });
        }
      } catch (err) {
        // Fall back to local logs seamlessly
      }
    };
    fetchExistingLogs();
  }, []);

  const handleAddLog = async (newEntry) => {
    setLogs((prev) => [newEntry, ...prev]);

    // Send to backend API asynchronously (Exp 7 fs append & Exp 9 integration)
    try {
      await workoutApi.logSet({
        athlete: newEntry.athlete,
        exercise: newEntry.exercise,
        weight: newEntry.weight,
        reps: newEntry.reps
      });
    } catch (err) {
      console.warn('Backend log set failed, stored in client cache:', err.message);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Clear all stored training session logs?')) return;
    setLogs([]);
    localStorage.removeItem('apex_production_workout_logs');

    try {
      await workoutApi.clearLogs();
    } catch (err) {
      // Ignored
    }

    showToast('Logs Cleared', 'Workout logs reset successfully.', 'info');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/athletes" element={<AthletesPage onShowToast={showToast} />} />
          <Route path="/session" element={<ActiveSession onAddLog={handleAddLog} onShowToast={showToast} />} />
          <Route path="/analytics" element={<Analytics logs={logs} onClearLogs={handleClearLogs} onShowToast={showToast} />} />
          <Route path="/equipment" element={<EquipmentPage onShowToast={showToast} />} />
          <Route path="/engine" element={<EngineAlgorithms onShowToast={showToast} />} />
        </Routes>
      </main>

      {/* Global Notification Toast Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Global Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.5rem 0', marginTop: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        <div className="container">
          <div>ApexFit Studio OS • Production Consolidated Architecture</div>
          <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Integrating Web Tech Experiments 1 through 9 (React 19 + Express MVC + MongoDB & Native Streams)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
