import React, { useState } from 'react';

export function ExerciseCard({ name, muscle, defaultWeight = 100, defaultReps = 5, onLogSet }) {
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(defaultWeight);
  const [currentReps, setCurrentReps] = useState(defaultReps);

  const handleAddSet = () => {
    const nextSet = setsCompleted + 1;
    setSetsCompleted(nextSet);
    onLogSet(name, currentWeight, currentReps);
  };

  const handleResetSets = () => {
    setSetsCompleted(0);
  };

  return (
    <div className="card-glass" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{name}</h4>
          <span className="badge badge-secondary">{muscle}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          {/* Weight Stepper */}
          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Working Load (kg)</label>
            <div className="weight-stepper">
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setCurrentWeight(prev => Math.max(0, parseFloat((prev - 2.5).toFixed(1))))}
              >
                -2.5
              </button>
              <input
                type="number"
                className="stepper-input"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
              />
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setCurrentWeight(prev => parseFloat((prev + 2.5).toFixed(1)))}
              >
                +2.5
              </button>
            </div>
          </div>

          {/* Reps selector */}
          <div style={{ width: '85px' }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Reps</label>
            <input
              type="number"
              className="form-input"
              style={{ textAlign: 'center', fontWeight: 700, color: '#38bdf8' }}
              value={currentReps}
              min="1"
              max="50"
              onChange={(e) => setCurrentReps(parseInt(e.target.value, 10) || 1)}
            />
          </div>
        </div>

        {/* Set Counter Box */}
        <div style={{ background: 'var(--bg-input)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sets Completed
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
            {setsCompleted}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={handleAddSet}
        >
          ⚡ Log Set ({currentWeight}kg × {currentReps})
        </button>

        {setsCompleted > 0 && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ width: '100%', borderColor: 'rgba(244, 63, 94, 0.3)', color: '#fca5a5' }}
            onClick={handleResetSets}
          >
            Reset Set Counter
          </button>
        )}
      </div>
    </div>
  );
}

export default ExerciseCard;
