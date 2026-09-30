import React, { useState, useEffect } from 'react';
import ExerciseCard from '../components/ExerciseCard';
import VolumeMetrics from '../components/VolumeMetrics';
import { athleteApi } from '../api/athleteApi';

export function ActiveSession({ onAddLog, onShowToast }) {
  const [seconds, setSeconds] = useState(0);
  const [sessionVolume, setSessionVolume] = useState(0);
  const [completedSetsCount, setCompletedSetsCount] = useState(0);
  const [selectedAthlete, setSelectedAthlete] = useState('Harsh Bankar');
  const [athletesList, setAthletesList] = useState([]);

  // Exp 4 Lifecycle Demonstration: Stopwatch Timer Mounting & Cleanup on Unmount
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerInterval); // Prevents memory leaks on unmount
    };
  }, []);

  // Fetch athletes to populate active floor selector
  useEffect(() => {
    const loadAthletes = async () => {
      try {
        const res = await athleteApi.getAll({ active: 'true' });
        const list = res.data.data || [];
        setAthletesList(list);
        if (list.length > 0) {
          setSelectedAthlete(list[0].fullName);
        }
      } catch (err) {
        // Fallback default list
        setAthletesList([{ fullName: 'Harsh Bankar' }, { fullName: 'Rohan Annam' }, { fullName: 'Vedant Garje' }]);
      }
    };
    loadAthletes();
  }, []);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return hrs > 0 ? `${hrs}:${mins}:${secs}` : `${mins}:${secs}`;
  };

  const handleLogSet = (exerciseName, weight, reps) => {
    const volume = weight * reps;
    setSessionVolume(v => v + volume);
    setCompletedSetsCount(s => s + 1);

    const logEntry = {
      id: Date.now(),
      athlete: selectedAthlete,
      exercise: exerciseName,
      weight,
      reps,
      volume,
      time: new Date().toLocaleTimeString()
    };

    onAddLog(logEntry);

    if (onShowToast) {
      onShowToast(
        'Set Recorded',
        `${exerciseName}: ${weight}kg × ${reps} reps (${volume.toLocaleString()}kg volume)`,
        'success'
      );
    }
  };

  const defaultMovements = [
    { id: 1, name: 'Competition Squat', muscle: 'Quads & Glutes', defaultWeight: 140, defaultReps: 3 },
    { id: 2, name: 'Pause Bench Press', muscle: 'Chest & Triceps', defaultWeight: 90, defaultReps: 5 },
    { id: 3, name: 'Conventional Deadlift', muscle: 'Posterior Chain', defaultWeight: 160, defaultReps: 3 },
    { id: 4, name: 'Overhead Military Press', muscle: 'Deltoids & Core', defaultWeight: 60, defaultReps: 5 },
    { id: 5, name: 'Barbell Pendlay Row', muscle: 'Upper Back & Lats', defaultWeight: 80, defaultReps: 6 },
    { id: 6, name: 'Romanian Deadlift (RDL)', muscle: 'Hamstrings', defaultWeight: 100, defaultReps: 8 }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      {/* Session Top Deck */}
      <div className="page-header">
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>Live Training Floor (Exp 3 & 4)</span>
          <h1 className="page-title">Active Training Floor • Real-Time Telemetry</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Active Athlete:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.3rem 0.75rem', fontSize: '0.85rem' }}
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
            >
              {athletesList.map((a, i) => (
                <option key={i} value={a.fullName}>{a.fullName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stopwatch Timer Display */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Session Elapsed
          </div>
          <div className="live-timer-badge">
            <span>⏱️</span>
            <span>{formatTimer(seconds)}</span>
          </div>
        </div>
      </div>

      {/* Live Volume Telemetry Banner (Exp 3) */}
      <VolumeMetrics
        totalVolume={sessionVolume}
        totalSetsCompleted={completedSetsCount}
        activeExercisesCount={defaultMovements.length}
      />

      {/* Exercise Cards Grid (Exp 3 & 4) */}
      <div className="grid-3" style={{ alignItems: 'stretch' }}>
        {defaultMovements.map((move) => (
          <ExerciseCard
            key={move.id}
            name={move.name}
            muscle={move.muscle}
            defaultWeight={move.defaultWeight}
            defaultReps={move.defaultReps}
            onLogSet={handleLogSet}
          />
        ))}
      </div>
    </div>
  );
}

export default ActiveSession;
