import React, { useState, useEffect } from 'react';
import { athleteApi } from '../api/athleteApi';
import AthleteForm from '../components/AthleteForm';
import AthleteTable from '../components/AthleteTable';

export function AthletesPage({ onShowToast }) {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'register'

  const loadAthletes = async () => {
    try {
      setLoading(true);
      const res = await athleteApi.getAll();
      setAthletes(res.data.data || []);
    } catch (err) {
      if (onShowToast) {
        onShowToast('Connection Alert', 'Could not load athletes from backend.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAthletes();
  }, []);

  const handleAthleteAdded = async (formData) => {
    const res = await athleteApi.create(formData);
    const newAthlete = res.data.data;
    setAthletes((prev) => [newAthlete, ...prev]);
    setActiveTab('directory'); // Switch to directory to see new athlete
  };

  const handleDeleteAthlete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete athlete profile "${name}"?`)) {
      return;
    }

    try {
      await athleteApi.delete(id);
      setAthletes((prev) => prev.filter((a) => (a._id || a.id) !== id));
      if (onShowToast) {
        onShowToast('Record Deleted', `Athlete ${name} removed from database.`, 'info');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to delete athlete.';
      if (onShowToast) {
        onShowToast('Delete Failed', msg, 'error');
      }
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await athleteApi.update(id, { isActive: newStatus });
      setAthletes((prev) =>
        prev.map((a) => ((a._id || a.id) === id ? { ...a, isActive: newStatus } : a))
      );
      if (onShowToast) {
        onShowToast('Status Updated', `Athlete status updated to ${newStatus ? 'Active' : 'Inactive'}.`, 'success');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast('Update Failed', 'Failed to update athlete status.', 'error');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.4rem' }}>Athlete Management Module</span>
          <h1 className="page-title">Athlete Intake Hub & Directory</h1>
          <p className="page-subtitle">
            Combines Experiments 1 (Onboarding Form & Live BMI), 6 (Mongoose CRUD), and 9 (Axios Full-Stack Integration).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'directory' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('directory')}
          >
            📋 Directory ({athletes.length})
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('register')}
          >
            + New Intake Registration
          </button>
        </div>
      </div>

      {/* Conditional View */}
      {activeTab === 'register' ? (
        <AthleteForm onAthleteAdded={handleAthleteAdded} onShowToast={onShowToast} />
      ) : (
        <AthleteTable
          athletes={athletes}
          loading={loading}
          onDeleteAthlete={handleDeleteAthlete}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
}

export default AthletesPage;
