/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'Income' | 'Expense' | 'Investment' | '';

export interface Transaction {
  id: string;
  date: string;
  details: string;
  refNo: string;
  debit: number | '';
  credit: number | '';
  balance: number | '';
  type: TransactionType;
  category: string;
  subCategory: string;
  amount: number;
  notes: string;
}

export interface CategorySummary {
  name: string;
  value: number;
  percentage: number;
}
