/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, CategorySummary, TransactionType } from '../types';

interface Props {
  transactions: Transaction[];
  type: TransactionType;
  title: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function AnalysisSheet({ transactions, type, title }: Props) {
  const data = useMemo(() => {
    const filtered = transactions.filter(t => t.type === type);
    const total = filtered.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryMap = filtered.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
    })).sort((a, b) => b.value - a.value);
  }, [transactions, type]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-tight">{title} - Detailed List</h2>
          <span className="text-[10px] text-slate-400 font-mono">Type: {type}</span>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-medium">
                <th className="p-2 border border-slate-700">Category Source</th>
                <th className="p-2 border border-slate-700 text-right">Amount (₹)</th>
                <th className="p-2 border border-slate-700 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/50 transition-colors`}>
                  <td className="p-2 border border-slate-200 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="font-bold text-slate-700 uppercase">{row.name}</span>
                  </td>
                  <td className="p-2 border border-slate-200 font-mono text-slate-900 text-right">
                    {formatCurrency(row.value)}
                  </td>
                  <td className="p-2 border border-slate-200 text-right font-bold text-blue-600">
                    {row.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400 italic">
                    No data available for {type}.
                  </td>
                </tr>
              )}
            </tbody>
            {data.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td className="p-2 text-slate-600 uppercase text-[10px] tracking-widest pl-4">GRAND TOTAL</td>
                  <td className="p-2 text-right text-[#1e3a8a] text-sm">{formatCurrency(totalValue)}</td>
                  <td className="p-2 text-right text-slate-600">100.0%</td>
                </tr>
              </tfoot>
            )}
          </table>
          
          <div className="mt-6 p-3 bg-slate-50 rounded border border-slate-200 border-dashed">
            <h4 className="text-[10px] text-slate-500 font-bold mb-1 opacity-80 flex items-center gap-1 uppercase tracking-wider">
              <span>💡</span> Insight
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed italic">
              {data.length > 0 ? (
                <>Your primary {type.toLowerCase()} source is <span className="font-bold text-[#1e3a8a]">{data[0].name}</span>, which accounts for {data[0].percentage.toFixed(1)}% of total volume.</>
              ) : (
                <>No transactional data detected for this sheet.</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[450px]">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-tight">{title} - Visual breakdown</h2>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Live Graph</span>
        </div>
        
        <div className="flex-1 p-6 relative">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={600}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
              Chart data will update automatically...
            </div>
          )}
          
          {data.length > 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-4">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block opacity-70">Total</span>
              <span className="text-xl font-black text-[#1e3a8a] block">{formatCurrency(totalValue)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
