import React, { useState } from 'react';
import { formatINR, formatDate } from '../utils/formatters';
import { Search, Plus, Trash2, Tag, CreditCard } from 'lucide-react';

export function TransactionList({ transactions, onDeleteTransaction, onOpenAddModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Unique categories in the current list
  const categories = ['ALL', ...new Set(transactions.map((t) => t.category))];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.paymentMode && t.paymentMode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div className="section-header">
        <div>
          <h3 className="section-title">Today's Transactions</h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Each logged expense immediately updates your remaining balance & future daily limit
          </div>
        </div>

        <button
          className="btn btn-outline-emerald btn-sm"
          onClick={onOpenAddModal}
          id="btn-add-transaction-list"
        >
          <Plus size={15} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', paddingBottom: '8px', paddingTop: '8px', fontSize: '0.85rem' }}
            placeholder="Search expense, UPI, petrol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="input-search-transactions"
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '130px', padding: '8px 12px', fontSize: '0.85rem' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          id="select-category-filter"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'ALL' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="tx-list">
        {filteredTransactions.length === 0 ? (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <p style={{ marginBottom: '10px', fontSize: '0.9rem' }}>No expenses found matching filter.</p>
            <button className="btn btn-secondary btn-sm" onClick={onOpenAddModal}>
              <Plus size={14} />
              <span>Log an Expense</span>
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="tx-item">
              <div className="tx-left">
                <div className="tx-icon-circle">
                  {tx.categoryIcon || '💸'}
                </div>
                <div>
                  <div className="tx-title">{tx.title}</div>
                  <div className="tx-meta">
                    <span className="badge badge-cyan" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                      <Tag size={10} />
                      {tx.category}
                    </span>
                    {tx.paymentMode && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CreditCard size={11} />
                        {tx.paymentMode}
                      </span>
                    )}
                    <span>• {formatDate(tx.date)}</span>
                  </div>
                </div>
              </div>

              <div className="tx-right">
                <span className="tx-amount">{formatINR(tx.amount)}</span>
                <button
                  className="tx-delete-btn"
                  onClick={() => onDeleteTransaction(tx.id)}
                  title="Delete transaction"
                  aria-label="Delete transaction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
