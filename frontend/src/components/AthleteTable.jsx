import React, { useState } from 'react';

export function AthleteTable({ athletes, loading, onDeleteAthlete, onToggleStatus }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');

  const filteredAthletes = athletes.filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'All' || a.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const tiers = [
    'All',
    'Foundation Strength',
    'Hypertrophy Elite',
    'Metabolic Conditioning',
    'Powerlifting Peaking'
  ];

  return (
    <div className="card-glass" style={{ padding: '1.5rem' }}>
      {/* Table Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Enrolled Athlete Directory</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Showing {filteredAthletes.length} of {athletes.length} athlete records from backend database.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ minWidth: '260px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search athlete name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tier Filter Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {tiers.map((t) => (
          <button
            key={t}
            type="button"
            className={`btn btn-sm ${selectedTier === t ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedTier(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
          <div>Connecting to REST API & database roster...</div>
        </div>
      ) : filteredAthletes.length === 0 ? (
        <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No athlete records matched your criteria.
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Athlete Name</th>
                <th>Contact & Age</th>
                <th>Training Track</th>
                <th>Biometrics</th>
                <th>Server BMI</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAthletes.map((athlete) => {
                const id = athlete._id || athlete.id;
                return (
                  <tr key={id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{athlete.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {id.toString().slice(-6)}</div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-secondary)' }}>{athlete.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {athlete.phone} • {athlete.age} yrs
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-secondary">{athlete.tier}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {athlete.biometrics?.heightCm} cm / {athlete.biometrics?.weightKg} kg
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-cyan" style={{ fontFamily: 'var(--font-mono)' }}>
                        BMI {athlete.biometrics?.bmi}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${athlete.isActive ? 'badge-emerald' : 'badge-rose'}`}
                        style={{ cursor: 'pointer' }}
                        title="Click to toggle status"
                        onClick={() => onToggleStatus && onToggleStatus(id, !athlete.isActive)}
                      >
                        {athlete.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => onDeleteAthlete(id, athlete.fullName)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AthleteTable;
