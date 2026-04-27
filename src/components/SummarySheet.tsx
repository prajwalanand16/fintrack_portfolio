/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrendingUp, TrendingDown, Wallet, Calculator } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

export default function SummarySheet({ transactions }: Props) {
  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'Income') acc.income += t.amount;
    else if (t.type === 'Expense') acc.expense += t.amount;
    else if (t.type === 'Investment') acc.investment += t.amount;
    return acc;
  }, { income: 0, expense: 0, investment: 0 });

  const netSavings = totals.income - totals.expense - totals.investment;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Summary Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Income</p>
          <h2 className="text-2xl font-bold text-green-600">{formatCurrency(totals.income)}</h2>
          <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Expenses</p>
          <h2 className="text-2xl font-bold text-red-500">{formatCurrency(totals.expense)}</h2>
          <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-red-400 h-full" 
              style={{ width: `${totals.income > 0 ? (totals.expense / totals.income) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Investments</p>
          <h2 className="text-2xl font-bold text-blue-600">{formatCurrency(totals.investment)}</h2>
          <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full"
              style={{ width: `${totals.income > 0 ? (totals.investment / totals.income) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-purple-50/30 rounded-xl p-5 border-2 border-[#c084fc]/30 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Net Savings</p>
          <h2 className="text-2xl font-bold text-purple-600">{formatCurrency(netSavings)}</h2>
          <p className="text-[10px] text-purple-400 mt-1 italic font-medium">Formula: Income - (Exp + Inv)</p>
        </div>
      </div>

      {/* Detailed Calculation Section */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 -mx-8 -mt-8 mb-8 rounded-t-xl">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Savings Calculation Logic</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-2xl font-bold py-6">
          <div className="flex flex-col items-center">
            <span className="text-green-600 text-3xl font-mono">{formatCurrency(totals.income)}</span>
            <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Income</span>
          </div>
          
          <span className="text-slate-300 text-2xl font-light">−</span>
          
          <div className="flex flex-col items-center">
            <span className="text-slate-700 text-3xl font-mono">({formatCurrency(totals.expense)} + {formatCurrency(totals.investment)})</span>
            <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Deductions</span>
          </div>
          
          <span className="text-slate-300 text-2xl font-light">=</span>
          
          <div className="bg-[#1e3a8a] text-white p-6 rounded-lg shadow-lg flex flex-col items-center min-w-[220px]">
            <span className="text-4xl font-mono">{formatCurrency(netSavings)}</span>
            <span className="text-[10px] text-blue-200 mt-2 font-bold uppercase tracking-tighter opacity-80">Final Net Savings</span>
          </div>
        </div>
        
        <div className="mt-8 p-3 bg-slate-50 rounded text-[10px] text-slate-400 text-center italic border border-slate-200 border-dashed">
          * Professional Portfolio tracking active. All calculations are performed on full column datasets.
        </div>
      </div>
    </div>
  );
}
