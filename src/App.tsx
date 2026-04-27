/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { LayoutDashboard, Database, TrendingUp, TrendingDown, Wallet, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, TransactionType } from './types';
import { autoCategorize } from './utils/categorization';
import DataInputSheet from './components/DataInputSheet';
import SummarySheet from './components/SummarySheet';
import AnalysisSheet from './components/AnalysisSheet';

const SAMPLE_DATA: Transaction[] = [
  { id: '1', date: '2024-04-01', details: 'Salary credited to A/C', refNo: 'TXN101', debit: '', credit: 75000, balance: 75000, type: 'Income', category: 'Salary', subCategory: 'Main', amount: 75000, notes: 'Monthly Payroll' },
  { id: '2', date: '2024-04-02', details: 'Amazon Shopping Mall', refNo: 'TXN102', debit: 4500, credit: '', balance: 70500, type: 'Expense', category: 'Shopping', subCategory: 'Clothes', amount: 4500, notes: 'New shirt' },
  { id: '3', date: '2024-04-03', details: 'Zomato Food Order', refNo: 'TXN103', debit: 850, credit: '', balance: 69650, type: 'Expense', category: 'Food', subCategory: 'Dinner', amount: 850, notes: 'Pizza night' },
  { id: '4', date: '2024-04-04', details: 'Uber Ride City', refNo: 'TXN104', debit: 450, credit: '', balance: 69200, type: 'Expense', category: 'Travel', subCategory: 'Office', amount: 450, notes: 'Late night shift' },
  { id: '5', date: '2024-04-05', details: 'SIP Fixed Deposit Investment', refNo: 'TXN105', debit: 15000, credit: '', balance: 54200, type: 'Investment', category: 'FD', subCategory: 'Monthly', amount: 15000, notes: 'Retirement fund' },
  { id: '6', date: '2024-04-06', details: 'Electricity Bill Payment', refNo: 'TXN106', debit: 3200, credit: '', balance: 51000, type: 'Expense', category: 'Necessities', subCategory: 'Home', amount: 3200, notes: 'Summer usage' },
  { id: '7', date: '2024-04-07', details: 'Freelance Project Payout', refNo: 'TXN107', debit: '', credit: 12000, balance: 63000, type: 'Income', category: 'Freelance', subCategory: 'Design', amount: 12000, notes: 'Logo design' },
  { id: '8', date: '2024-04-08', details: 'Market Trading Stocks Buy', refNo: 'TXN108', debit: 8000, credit: '', balance: 55000, type: 'Investment', category: 'Stocks', subCategory: 'Growth', amount: 8000, notes: 'Bought Tech Index' },
];

type SheetType = 'DataInput' | 'Summary' | 'IncomeAnalysis' | 'ExpenseAnalysis' | 'InvestmentAnalysis';

export default function App() {
  const [activeSheet, setActiveSheet] = useState<SheetType>('DataInput');
  const [transactions, setTransactions] = useState<Transaction[]>(SAMPLE_DATA);

  const addRow = () => {
    const newRow: Transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      details: '',
      refNo: '',
      debit: '',
      credit: '',
      balance: '',
      type: '',
      category: 'Other',
      subCategory: '',
      amount: 0,
      notes: '',
    };
    setTransactions([...transactions, newRow]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const merged = { ...t, ...updates };
        // Recalculate auto-fields if Details, Debit, or Credit changes
        if ('details' in updates || 'debit' in updates || 'credit' in updates) {
          const auto = autoCategorize(merged.details, merged.debit, merged.credit);
          return { ...merged, ...auto };
        }
        return merged;
      }
      return t;
    }));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const navigation = [
    { id: 'DataInput', label: 'Data Input', icon: Database },
    { id: 'Summary', label: 'Summary', icon: LayoutDashboard },
    { id: 'IncomeAnalysis', label: 'Income Analysis', icon: TrendingUp },
    { id: 'ExpenseAnalysis', label: 'Expense Analysis', icon: TrendingDown },
    { id: 'InvestmentAnalysis', label: 'Investment Analysis', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
      {/* Top Header */}
      <header className="bg-[#1e3a8a] text-white px-6 py-4 flex justify-between items-center shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#1e3a8a] font-bold text-xl">₹</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">FinTrack Portfolio 📊</h1>
            <p className="text-xs text-blue-200 opacity-80 uppercase tracking-widest">Spreadsheet v4.2 • Auto-Categorized</p>
          </div>
        </div>
      </header>

      {/* Sheet Tabs - Sleek Excel Style */}
      <nav className="bg-slate-200 border-b border-slate-300 flex px-4 shrink-0">
        {navigation.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => setActiveSheet(item.id as SheetType)}
            className={`px-6 py-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
              activeSheet === item.id 
                ? 'border-[#1e3a8a] text-[#1e3a8a] bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSheet}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="h-full overflow-auto p-6"
          >
            {activeSheet === 'DataInput' && (
              <DataInputSheet 
                transactions={transactions} 
                onUpdate={updateTransaction} 
                onDelete={deleteTransaction}
                onAdd={addRow}
              />
            )}
            {activeSheet === 'Summary' && (
              <SummarySheet transactions={transactions} />
            )}
            {activeSheet === 'IncomeAnalysis' && (
              <AnalysisSheet transactions={transactions} type="Income" title="💰 Income Distribution by Source" />
            )}
            {activeSheet === 'ExpenseAnalysis' && (
              <AnalysisSheet transactions={transactions} type="Expense" title="💸 Expense Distribution by Category" />
            )}
            {activeSheet === 'InvestmentAnalysis' && (
              <AnalysisSheet transactions={transactions} type="Investment" title="📊 Investment Distribution by Type" />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Status Bar */}
      <footer className="bg-slate-800 text-slate-400 px-4 py-1.5 text-[10px] flex justify-between shrink-0">
        <div className="flex gap-4">
          <span>Sheet: {activeSheet}</span>
          <span>Ready</span>
          <span>Columns: A:K Active</span>
        </div>
        <div className="flex gap-4 uppercase tracking-tighter">
          <span className="text-green-400 font-bold">● Formulas Protected</span>
          <span>Auto-Sync Enabled</span>
        </div>
      </footer>
    </div>
  );
}
