import React from 'react';
import { formatINR } from '../utils/formatters';
import { PlusCircle, TrendingUp, ShieldCheck, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export function HeroDial({ metrics, onOpenAddExpense }) {
  // SVG Ring calculations
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const percentSpent = metrics.dynamicTodayLimit > 0 
    ? Math.min(100, Math.max(0, (metrics.spentToday / metrics.dynamicTodayLimit) * 100))
    : 0;
  const strokeDashoffset = circumference - (percentSpent / 100) * circumference;

  let strokeColor = 'var(--emerald-500)';
  let glowColor = 'var(--shadow-emerald-glow)';
  let statusBadgeClass = 'badge-emerald';
  let statusText = 'Comfortable Pace';

  if (metrics.remainingToday < 0) {
    strokeColor = 'var(--rose-500)';
    glowColor = 'var(--shadow-rose-glow)';
    statusBadgeClass = 'badge-rose';
    statusText = 'Over Daily Limit';
  } else if (metrics.percentageSpentToday >= 75) {
    strokeColor = 'var(--amber-500)';
    glowColor = 'var(--amber-glow)';
    statusBadgeClass = 'badge-amber';
    statusText = 'Approaching Limit';
  }

  return (
    <section className="glass-panel hero-dial-card">
      <div className="hero-layout">
        {/* Left: The Visual Safe-to-Spend Dial */}
        <div className="dial-center-box">
          <div className="dial-meter-wrapper" style={{ filter: `drop-shadow(${glowColor})` }}>
            <svg className="dial-svg" viewBox="0 0 220 220">
              <circle
                className="dial-track"
                cx="110"
                cy="110"
                r={radius}
              />
              <circle
                className="dial-fill"
                cx="110"
                cy="110"
                r={radius}
                stroke={strokeColor}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            <div className="dial-inner-content">
              <span className="dial-label">Today's Remaining</span>
              <span
                className="currency-num dial-value"
                style={{
                  color: metrics.remainingToday < 0 ? 'var(--rose-500)' : 'var(--text-main)',
                }}
              >
                {formatINR(metrics.remainingToday, 2)}
              </span>
              <div className={`badge ${statusBadgeClass} dial-status-chip`}>
                {metrics.remainingToday < 0 ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
                <span>{statusText}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginTop: '18px',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Today's Daily Limit
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }} className="currency-num">
                {formatINR(metrics.dynamicTodayLimit, 2)}
              </div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Spent Today
              </div>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: metrics.spentToday > 0 ? 'var(--amber-500)' : 'var(--text-muted)',
                }}
                className="currency-num"
              >
                {formatINR(metrics.spentToday, 2)}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Co-Pilot Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-emerald">
                <Sparkles size={12} />
                Dynamic Floating Engine Active
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', lineHeight: '1.2' }}>
              Your Daily Financial Co-Pilot
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
              {metrics.message}
            </p>
          </div>

          {/* Tomorrow's Dynamic Recalculation Projection Card */}
          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Tomorrow's Recommended Limit (If you stop spending now)
              </span>
              <TrendingUp size={16} color="var(--emerald-400)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-400)' }} className="currency-num">
                {formatINR(metrics.recommendedFutureDailyLimit, 2)}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                / day for next {metrics.remainingDaysAfterToday} days
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {metrics.remainingToday > 0
                ? `✨ Saving ${formatINR(metrics.remainingToday, 0)} today boosts each upcoming day's spending limit!`
                : `⚠️ Overspending today was automatically cushioned across the remaining ${metrics.remainingDaysAfterToday} days.`}
            </div>
          </div>

          {/* Quick CTA */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={onOpenAddExpense}
              style={{ flex: 1, padding: '12px 20px' }}
              id="btn-quick-add-expense"
            >
              <PlusCircle size={18} />
              <span>Log New Expense</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
