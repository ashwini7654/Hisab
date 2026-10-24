import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/formatters';

const SAMPLE_CSV = `Date,Description,Category,Amount,PaymentMode
2026-10-25,Reliance Smart Superstore,Groceries,420,UPI (GPay)
2026-10-25,Shell Fuel Station,Fuel & Travel,350,Debit Card
2026-10-25,Pharmacy Apollo Medicine,Health & Pharmacy,195,UPI (Paytm)
2026-10-25,Starbucks Coffee,Food & Dining,260,Credit Card`;

export function StatementImportModal({ isOpen, onClose, onImportTransactions, existingTransactions }) {
  const [csvContent, setCsvContent] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);

  if (!isOpen) return null;

  const handleLoadSample = () => {
    setCsvContent(SAMPLE_CSV);
    parseCsv(SAMPLE_CSV);
  };

  const parseCsv = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length <= 1) {
      setParsedRows([]);
      setDuplicateCount(0);
      return;
    }

    const rows = [];
    let dups = 0;

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(',');
      if (parts.length >= 4) {
        const [date, description, category, amountStr, paymentMode] = parts;
        const amount = parseFloat(amountStr) || 0;

        // Simple deduplication hash
        const dedupKey = `${date}_${description.trim()}_${amount}`.toLowerCase();
        const isDuplicate = existingTransactions.some(
          (t) => `${t.date.slice(0, 10)}_${t.title.trim()}_${t.amount}`.toLowerCase() === dedupKey
        );

        if (isDuplicate) {
          dups += 1;
        } else {
          rows.push({
            id: `imported-${Date.now()}-${i}`,
            title: description.trim(),
            category: category.trim() || 'Miscellaneous',
            categoryIcon: getCategoryIcon(category.trim()),
            amount,
            paymentMode: paymentMode ? paymentMode.trim() : 'Bank Import',
            date: date.trim(),
            isToday: true,
          });
        }
      }
    }

    setParsedRows(rows);
    setDuplicateCount(dups);
  };

  const getCategoryIcon = (category) => {
    const map = {
      'Groceries': '🛒',
      'Fuel & Travel': '⛽',
      'Food & Dining': '🍔',
      'Health & Pharmacy': '💊',
      'Utilities & Bills': '💡',
      'Shopping & Retail': '🛍️',
    };
    return map[category] || '💸';
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setCsvContent(text);
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length > 0) {
      onImportTransactions(parsedRows);
      onClose();
    }
  };

  const totalParsedAmount = parsedRows.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-400)',
              }}
            >
              <UploadCloud size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Import Bank Statement (CSV)</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Upload your bank statement or UPI statement CSV. The system will categorize entries, detect duplicate records, and recalculate today's dynamic budget.
        </p>

        {/* Action Bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'center' }}>
          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
            <FileText size={14} />
            <span>Choose File</span>
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <button type="button" className="btn btn-outline-emerald btn-sm" onClick={handleLoadSample}>
            <span>⚡ Load Sample UPI/Bank Feed</span>
          </button>
        </div>

        {/* Text Area */}
        <div className="form-group">
          <textarea
            className="form-input"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', minHeight: '110px' }}
            placeholder="Date,Description,Category,Amount,PaymentMode"
            value={csvContent}
            onChange={(e) => {
              setCsvContent(e.target.value);
              parseCsv(e.target.value);
            }}
          />
        </div>

        {/* Parsing preview */}
        {parsedRows.length > 0 && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              marginBottom: '16px',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, color: 'var(--emerald-400)' }}>
                ✓ {parsedRows.length} Valid Transactions Found
              </span>
              <span className="currency-num" style={{ fontWeight: 700 }}>
                Total: {formatINR(totalParsedAmount)}
              </span>
            </div>

            {duplicateCount > 0 && (
              <div style={{ fontSize: '0.78rem', color: 'var(--amber-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={13} />
                <span>{duplicateCount} duplicate transaction(s) skipped automatically.</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirmImport}
            disabled={parsedRows.length === 0}
            id="btn-confirm-import"
          >
            <CheckCircle2 size={16} />
            <span>Import {parsedRows.length} Entries</span>
          </button>
        </div>
      </div>
    </div>
  );
}
