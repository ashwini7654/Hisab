import React from 'react';
import { Wallet, Settings, UploadCloud, RotateCcw, Calendar } from 'lucide-react';

export function Header({ currentDay, totalDays, onOpenSettings, onOpenImport, onResetDefaults }) {
  return (
    <header className="app-navbar">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Wallet size={22} />
        </div>
        <div className="brand-text">
          <h1>Hisab</h1>
          <div className="brand-tagline">Dynamic Daily Budget Engine</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div className="badge badge-cyan" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          <Calendar size={14} />
          Day {currentDay} of {totalDays}
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenSettings}
          title="Adjust Salary & Fixed Expenses"
          id="btn-edit-commitments"
        >
          <Settings size={15} />
          <span>Commitments</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenImport}
          title="Import Bank Statement (CSV)"
          id="btn-import-statement"
        >
          <UploadCloud size={15} />
          <span>Import CSV</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onResetDefaults}
          title="Reset to default example"
          id="btn-reset-defaults"
        >
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
