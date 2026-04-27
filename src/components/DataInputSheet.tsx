/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, Trash2 } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  onUpdate: (id: string, updates: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function DataInputSheet({ transactions, onUpdate, onDelete, onAdd }: Props) {
  const headers = [
    { label: 'Date (A)', className: 'w-32' },
    { label: 'Details (B)', className: 'min-w-[200px]' },
    { label: 'Ref No/Cheque No (C)', className: 'w-40' },
    { label: 'Debit (₹) (D)', className: 'w-28' },
    { label: 'Credit (₹) (E)', className: 'w-28' },
    { label: 'Balance (₹) (F)', className: 'w-28' },
    { label: 'Type (G)', className: 'w-32' },
    { label: 'Category (H)', className: 'w-32' },
    { label: 'Sub-Category (I)', className: 'w-32' },
    { label: 'Amount (₹) (J)', className: 'w-28' },
    { label: 'Notes (K)', className: 'min-w-[150px]' },
    { label: 'Actions', className: 'w-16' },
  ];

  const formatCurrency = (val: number | string) => {
    if (val === '' || val === undefined) return '';
    const num = Number(val);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(num);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
          📑 Live Data Input (Bank Format)
        </h2>
        <button
          onClick={onAdd}
          className="bg-[#1e3a8a] hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          Add Row
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left text-xs border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-900 text-white">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`p-2 border border-slate-700 font-medium ${
                    h.label.includes('Debit') || h.label.includes('Credit') ? 'bg-blue-900' : ''
                  } ${h.className}`}
                >
                  {h.label.split(' (')[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={t.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/50 transition-colors`}>
                {/* Date */}
                <td className="border border-slate-200 p-0">
                  <input
                    type="date"
                    value={t.date}
                    onChange={(e) => onUpdate(t.id, { date: e.target.value })}
                    className="w-full h-full p-2 bg-transparent border-none outline-none focus:bg-blue-50 font-mono"
                  />
                </td>
                {/* Details */}
                <td className="border border-slate-200 p-0">
                  <input
                    type="text"
                    value={t.details}
                    placeholder="Details..."
                    onChange={(e) => onUpdate(t.id, { details: e.target.value })}
                    className="w-full h-full p-2 italic bg-transparent border-none outline-none focus:bg-blue-50"
                  />
                </td>
                {/* Ref No */}
                <td className="border border-slate-200 p-0">
                  <input
                    type="text"
                    value={t.refNo}
                    onChange={(e) => onUpdate(t.id, { refNo: e.target.value })}
                    className="w-full h-full p-2 bg-transparent border-none outline-none focus:bg-blue-50"
                  />
                </td>
                {/* Debit */}
                <td className="border border-slate-200 p-0">
                  <input
                    type="text"
                    value={t.debit}
                    onChange={(e) => onUpdate(t.id, { debit: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full h-full p-2 font-mono text-blue-600 bg-transparent border-none outline-none focus:bg-blue-50"
                  />
                </td>
                {/* Credit */}
                <td className="border border-slate-200 p-0">
                  <input
                    type="text"
                    value={t.credit}
                    onChange={(e) => onUpdate(t.id, { credit: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full h-full p-2 font-mono text-blue-600 bg-transparent border-none outline-none focus:bg-blue-50"
                  />
                </td>
                {/* Balance */}
                <td className="border border-slate-200 p-0">
                  <input
                    type="text"
                    value={t.balance}
                    onChange={(e) => onUpdate(t.id, { balance: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full h-full p-2 font-mono text-slate-600 bg-transparent border-none outline-none focus:bg-blue-50"
                  />
                </td>
                {/* Type (Auto) */}
                <td className={`border border-slate-200 p-2 font-bold ${
                  t.type === 'Income' ? 'text-green-600' : 
                  t.type === 'Expense' ? 'text-red-500' : 'text-blue-600'
                }`}>
                  {t.type}
                </td>
                {/* Category (Auto) */}
                <td className="border border-slate-200 p-2 uppercase text-slate-500">
                  {t.category}
                </td>
                {/* Sub-Category (Manual) */}
                <td className="border border-slate-200 p-0">
                  <input
                    type="text"
                    value={t.subCategory}
                    onChange={(e) => onUpdate(t.id, { subCategory: e.target.value })}
                    className="w-full h-full p-2 bg-transparent border-none outline-none focus:bg-blue-50"
                  />
                </td>
                {/* Amount (Auto Calculation Result) */}
                <td className="border border-slate-200 p-2 font-bold bg-slate-50">
                  {formatCurrency(t.amount)}
                </td>
                {/* Notes */}
                <td className="border border-slate-200 p-0">
                  <input
                    type="text"
                    value={t.notes}
                    onChange={(e) => onUpdate(t.id, { notes: e.target.value })}
                    className="w-full h-full p-2 text-blue-600 bg-transparent border-none outline-none focus:bg-blue-50"
                  />
                </td>
                {/* Actions */}
                <td className="border border-slate-200 p-2 text-center">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-100 p-2 text-[10px] text-slate-500 italic flex justify-between items-center">
        <span>* Auto-categorization active using Detail keywords. Blue text indicates user input fields.</span>
        <span className="font-mono">Rows: {transactions.length}</span>
      </div>
    </div>
  );
}
