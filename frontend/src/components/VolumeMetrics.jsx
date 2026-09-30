import React from 'react';

export function VolumeMetrics({ totalVolume, totalSetsCompleted, activeExercisesCount }) {
  return (
    <div className="card-glass" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div className="grid-3" style={{ textAlign: 'center' }}>
        <div style={{ padding: '0.5rem' }}>
          <div className="metric-label">Cumulative Session Volume</div>
          <div className="metric-number" style={{ color: 'var(--accent-cyan)' }}>
            {totalVolume.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>kg</span>
          </div>
        </div>

        <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
          <div className="metric-label">Completed Sets Today</div>
          <div className="metric-number" style={{ color: 'var(--accent-emerald)' }}>
            {totalSetsCompleted}
          </div>
        </div>

        <div style={{ padding: '0.5rem' }}>
          <div className="metric-label">Active Movements</div>
          <div className="metric-number" style={{ color: 'var(--accent-amber)' }}>
            {activeExercisesCount}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolumeMetrics;
