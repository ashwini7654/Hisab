import React from 'react';
import { formatINR, formatPercent } from '../utils/formatters';
import { PieChart, Layers } from 'lucide-react';

export function CategoryBreakdown({ transactions, totalSpent }) {
  // Aggregate by category
  const breakdown = {};
  transactions.forEach((tx) => {
    const cat = tx.category || 'Other';
    if (!breakdown[cat]) {
      breakdown[cat] = {
        name: cat,
        amount: 0,
        icon: tx.categoryIcon || '📦',
        count: 0,
      };
    }
    breakdown[cat].amount += Number(tx.amount) || 0;
    breakdown[cat].count += 1;
  });

  const categories = Object.values(breakdown).sort((a, b) => b.amount - a.amount);

  const categoryColors = [
    'var(--emerald-500)',
    'var(--cyan-400)',
    'var(--amber-500)',
    'var(--indigo-400)',
    '#ec4899',
    '#8b5cf6',
    '#14b8a6',
    '#64748b',
  ];

  return (
    <div className="glass-panel cat-progress-card">
      <div className="section-header" style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart size={18} color="var(--cyan-400)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Category Breakdown</h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {categories.length} active categories
        </span>
      </div>

      {categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          No category spending recorded yet.
        </div>
      ) : (
        categories.map((cat, idx) => {
          const percent = totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0;
          const color = categoryColors[idx % categoryColors.length];

          return (
            <div key={cat.name} className="cat-item">
              <div className="cat-info">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
                <span style={{ fontWeight: 700 }} className="currency-num">
                  {formatINR(cat.amount)}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    ({formatPercent(percent)})
                  </span>
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })
      )}

      {/* Quick Summary footnote */}
      <div
        style={{
          marginTop: '18px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
        }}
      >
        <span>Today's Total Spend</span>
        <span className="currency-num" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
          {formatINR(totalSpent)}
        </span>
      </div>
    </div>
  );
}
