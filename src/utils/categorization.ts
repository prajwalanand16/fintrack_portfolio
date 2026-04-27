/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TransactionType } from '../types';

const KEYWORDS = {
  FOOD: ['zomato', 'swiggy', 'dominos', 'pizza', 'cafe', 'coffee', 'restaurant', 'food'],
  TRAVEL: ['uber', 'ola', 'petrol', 'fuel', 'flight', 'bus', 'auto', 'taxi'],
  NECESSITIES: ['medical', 'pharmacy', 'electricity', 'water', 'internet', 'bill', 'rent', 'hospital'],
  SHOPPING: ['amazon', 'flipkart', 'mall', 'shopping', 'store'],
  INCOME: {
    Salary: ['salary', 'payroll'],
    Clients: ['client', 'payment'],
    Freelance: ['freelance', 'project'],
    Transfer: ['transfer'],
  },
  INVESTMENT: {
    FD: ['fd', 'fixed deposit', 'sip'],
    Stocks: ['stock', 'market', 'trading'],
    Gold: ['gold', 'bullion'],
    Crypto: ['crypto', 'bitcoin', 'ethereum'],
  }
};

export function autoCategorize(details: string, debit: number | '', credit: number | ''): { type: TransactionType, category: string, amount: number } {
  const detailLower = details.toLowerCase();
  let type: TransactionType = '';
  let category = 'Other';
  let amount = 0;

  // 1. Determine Amount
  if (typeof debit === 'number' && debit > 0) {
    amount = debit;
  } else if (typeof credit === 'number' && credit > 0) {
    amount = credit;
  }

  // 2. Determine Type & Category
  if (credit !== '' && credit > 0) {
    type = 'Income';
    category = 'Other Income';
    for (const [cat, keywords] of Object.entries(KEYWORDS.INCOME)) {
      if (keywords.some(kw => detailLower.includes(kw))) {
        category = cat;
        break;
      }
    }
  } else if (debit !== '' && debit > 0) {
    // Check Investment keywords first
    let isInvestment = false;
    for (const [cat, keywords] of Object.entries(KEYWORDS.INVESTMENT)) {
      if (keywords.some(kw => detailLower.includes(kw))) {
        type = 'Investment';
        category = cat;
        isInvestment = true;
        break;
      }
    }

    if (!isInvestment) {
      type = 'Expense';
      if (KEYWORDS.FOOD.some(kw => detailLower.includes(kw))) category = 'Food';
      else if (KEYWORDS.TRAVEL.some(kw => detailLower.includes(kw))) category = 'Travel';
      else if (KEYWORDS.NECESSITIES.some(kw => detailLower.includes(kw))) category = 'Necessities';
      else if (KEYWORDS.SHOPPING.some(kw => detailLower.includes(kw))) category = 'Shopping';
      else category = 'Other';
    }
  }

  return { type, category, amount };
}
