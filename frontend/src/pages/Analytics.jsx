import React, { useState, useEffect } from 'react';
import { workoutApi } from '../api/workoutApi';

export function Analytics({ logs, onClearLogs, onShowToast }) {
  const [diskLogContent, setDiskLogContent] = useState('');
  const [showDiskModal, setShowDiskModal] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamResult, setStreamResult] = useState(null);

  const totalVolume = logs.reduce((acc, curr) => acc + (curr.volume || 0), 0);

  // Group volume by exercise for visual breakdown
  const exerciseStats = logs.reduce((acc, curr) => {
    acc[curr.exercise] = (acc[curr.exercise] || 0) + (curr.volume || 0);
    return acc;
  }, {});

  const maxVolume = Math.max(...Object.values(exerciseStats), 1);

  // Exp 7: Trigger Node.js Stream Piping Demo
  const handlePipeStream = async () => {
    setStreaming(true);
    setStreamResult(null);
    try {
      const summaryPayload = logs.map(l => `${l.time} - ${l.exercise}: ${l.weight}kg x ${l.reps} (Vol: ${l.volume}kg)\n`).join('');
      const res = await workoutApi.pipeStream(summaryPayload);
      setStreamResult(res.data);
      if (onShowToast) {
        onShowToast('Stream Piping Complete', 'Readable stream piped directly to archive on server disk.', 'success');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast('Stream Error', 'Failed to pipe data stream on server.', 'error');
      }
    } finally {
      setStreaming(false);
    }
  };

  // Exp 7: Read training_session.log from server disk
  const handleReadDiskLog = async () => {
    try {
      const res = await workoutApi.getDiskLogs();
      setDiskLogContent(res.data.content);
      setShowDiskModal(true);
    } catch (err) {
      if (onShowToast) {
        onShowToast('Read Error', 'Could not retrieve server disk log file.', 'error');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.4rem' }}>Audit & Telemetry (Exp 4 & 7)</span>
          <h1 className="page-title">Session Audit, Analytics & Disk Archive</h1>
          <p className="page-subtitle">
            Persistent workout history, cumulative volume analytics, and native Node.js streaming & file system pipelines.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleReadDiskLog}
          >
            📄 View Server Disk Log (fs)
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePipeStream}
            disabled={streaming}
          >
            {streaming ? 'Piping Stream...' : '⚡ Pipe Stream to Archive (Node.js)'}
          </button>
          {logs.length > 0 && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={onClearLogs}
            >
              Clear Logs
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        <div className="card-glass metric-box">
          <div className="metric-label">Logged Set Entries</div>
          <div className="metric-number" style={{ color: '#fff' }}>
            {logs.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Synchronized with localStorage & backend API
          </div>
        </div>

        <div className="card-glass metric-box">
          <div className="metric-label">Cumulative Workload Tonnage</div>
          <div className="metric-number" style={{ color: 'var(--accent-cyan)' }}>
            {totalVolume.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Total weight moved across all movements
          </div>
        </div>

        <div className="card-glass metric-box">
          <div className="metric-label">Average Volume Per Set</div>
          <div className="metric-number" style={{ color: 'var(--accent-emerald)' }}>
            {logs.length > 0 ? Math.round(totalVolume / logs.length).toLocaleString() : 0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Mean intensity per training set
          </div>
        </div>
      </div>

      {/* Stream Piping Result Banner (Exp 7) */}
      {streamResult && (
        <div className="card-glass" style={{ padding: '1.25rem', marginBottom: '1.75rem', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ color: 'var(--accent-emerald)', fontSize: '1rem' }}>
              ✅ Node.js Buffer & Stream Piping Pipeline Executed
            </h4>
            <span className="badge badge-emerald">{streamResult.chunkCount} Buffer Chunks</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {streamResult.message}
          </p>
          <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '6px', marginTop: '0.5rem', fontSize: '0.75rem' }} className="mono">
            {streamResult.chunks?.slice(0, 4).map((c, i) => (
              <div key={i} style={{ color: '#38bdf8' }}>{c}</div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Volume Distribution Breakdown */}
      {Object.keys(exerciseStats).length > 0 && (
        <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Movement Volume Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(exerciseStats).map(([name, vol]) => {
              const pct = Math.round((vol / maxVolume) * 100);
              return (
                <div key={name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{name}</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{vol.toLocaleString()} kg</span>
                  </div>
                  <div style={{ background: 'var(--bg-input)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                        width: `${pct}%`,
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Log Registry Table (Exp 4) */}
      <div className="card-glass" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Workout Log Registry</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Detailed set-by-set telemetry logged during active training floor sessions.
            </p>
          </div>
        </div>

        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏋️</div>
            <div>No sets logged yet. Navigate to 'Live Session' to record floor movements.</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Athlete</th>
                  <th>Movement</th>
                  <th>Load (kg)</th>
                  <th>Reps</th>
                  <th>Set Volume</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{log.time}</td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{log.athlete || 'Harsh Bankar'}</td>
                    <td style={{ color: '#fff' }}>{log.exercise}</td>
                    <td style={{ color: 'var(--text-highlight)', fontWeight: 600 }}>{log.weight} kg</td>
                    <td style={{ color: '#fff' }}>{log.reps}</td>
                    <td>
                      <span className="badge badge-cyan" style={{ fontFamily: 'var(--font-mono)' }}>
                        {log.volume.toLocaleString()} kg
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Exp 7: Disk Log Modal */}
      {showDiskModal && (
        <div className="modal-overlay" onClick={() => setShowDiskModal(false)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <div>
                <span className="badge badge-emerald">Exp 7 fs.readFile</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>
                  Server Disk File: training_session.log
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowDiskModal(false)}
              >
                ✕
              </button>
            </div>

            <pre
              style={{
                background: 'var(--bg-input)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                maxHeight: '340px',
                overflowY: 'auto',
                fontSize: '0.78rem',
                color: '#a5f3fc',
                whiteSpace: 'pre-wrap'
              }}
            >
              {diskLogContent}
            </pre>

            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowDiskModal(false)}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
