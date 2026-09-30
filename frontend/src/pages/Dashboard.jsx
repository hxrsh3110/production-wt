import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { athleteApi } from '../api/athleteApi';
import { equipmentApi } from '../api/equipmentApi';
import { workoutApi } from '../api/workoutApi';
import { systemApi } from '../api/systemApi';

export function Dashboard() {
  const [stats, setStats] = useState({
    athletesCount: 0,
    activeAthletes: 0,
    equipmentCount: 0,
    operationalEquipment: 0,
    workoutSetsLogged: 0,
    totalVolumeKg: 0
  });
  const [recentAthletes, setRecentAthletes] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [athRes, eqRes, workRes, sysRes] = await Promise.allSettled([
          athleteApi.getAll(),
          equipmentApi.getAll(),
          workoutApi.getLogs(),
          systemApi.getHealth()
        ]);

        const athletes = athRes.status === 'fulfilled' ? athRes.value.data.data || [] : [];
        const equipment = eqRes.status === 'fulfilled' ? eqRes.value.data.data || [] : [];
        const workouts = workRes.status === 'fulfilled' ? workRes.value.data.data || [] : [];
        const health = sysRes.status === 'fulfilled' ? sysRes.value.data : null;

        const totalVol = workouts.reduce((acc, curr) => acc + (curr.volume || 0), 0);

        setStats({
          athletesCount: athletes.length,
          activeAthletes: athletes.filter(a => a.isActive).length,
          equipmentCount: equipment.length,
          operationalEquipment: equipment.filter(e => e.isAvailable).length,
          workoutSetsLogged: workouts.length,
          totalVolumeKg: totalVol
        });

        setRecentAthletes(athletes.slice(0, 5));
        setTelemetry(health);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container py-4" style={{ padding: '2rem 1.25rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.4rem' }}>Unified Control Deck</span>
          <h1 className="page-title">ApexFit Studio OS • Executive Dashboard</h1>
          <p className="page-subtitle">
            Consolidated production control deck orchestrating athlete intake, live training telemetry, and studio equipment.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/session" className="btn btn-primary">
            ⚡ Launch Live Session
          </Link>
          <Link to="/athletes" className="btn btn-outline">
            + New Intake
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <div className="card-glass metric-box">
          <div className="metric-label">Enrolled Athletes</div>
          <div className="metric-number" style={{ color: 'var(--accent-cyan)' }}>
            {stats.athletesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {stats.activeAthletes} currently active on floor
          </div>
        </div>

        <div className="card-glass metric-box">
          <div className="metric-label">Logged Volume (All-Time)</div>
          <div className="metric-number" style={{ color: 'var(--accent-emerald)' }}>
            {stats.totalVolumeKg.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Across {stats.workoutSetsLogged} completed training sets
          </div>
        </div>

        <div className="card-glass metric-box">
          <div className="metric-label">Studio Equipment Status</div>
          <div className="metric-number" style={{ color: 'var(--accent-amber)' }}>
            {stats.operationalEquipment} / {stats.equipmentCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Operational & calibrated units
          </div>
        </div>

        <div className="card-glass metric-box">
          <div className="metric-label">Core API Telemetry</div>
          <div className="metric-number" style={{ color: '#fff', fontSize: '1.4rem' }}>
            {telemetry ? `${telemetry.telemetry?.heapUsedMB} MB` : 'Operational'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Node {telemetry?.telemetry?.nodeVersion || 'v22'} • Uptime {telemetry?.uptimeSeconds || 0}s
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <Link to="/athletes" className="card-glass" style={{ padding: '1.25rem', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏃</span>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Athlete Intake & Roster</h3>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Intake registration with live BMI calculator, training tracks, and directory CRUD. (Exp 1, 6, 9)
          </p>
        </Link>

        <Link to="/session" className="card-glass" style={{ padding: '1.25rem', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⏱️</span>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Active Training Floor</h3>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Real-time workout stopwatch, interactive weight-stepper cards, and volume tracking. (Exp 3, 4)
          </p>
        </Link>

        <Link to="/engine" className="card-glass" style={{ padding: '1.25rem', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📐</span>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>ES6 Algorithms & Pricing</h3>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Superset factorials, progressive multiplication matrix, macrocycle sum, and packages engine. (Exp 2)
          </p>
        </Link>
      </div>

      {/* Recent Athletes Table */}
      <div className="card-glass" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Recent Athlete Enrollments</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Latest active intakes synchronized from backend persistence.
            </p>
          </div>
          <Link to="/athletes" className="btn btn-outline btn-sm">
            View All Athletes →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            Loading dashboard telemetry...
          </div>
        ) : recentAthletes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            No athletes enrolled yet.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Athlete Name</th>
                  <th>Training Track</th>
                  <th>Biometrics (Ht / Wt)</th>
                  <th>Baseline BMI</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAthletes.map((a) => (
                  <tr key={a._id || a.id}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{a.fullName}</td>
                    <td><span className="badge badge-secondary">{a.tier}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {a.biometrics?.heightCm} cm / {a.biometrics?.weightKg} kg
                    </td>
                    <td>
                      <span className="badge badge-cyan" style={{ fontFamily: 'var(--font-mono)' }}>
                        BMI {a.biometrics?.bmi}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${a.isActive ? 'badge-emerald' : 'badge-rose'}`}>
                        {a.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
