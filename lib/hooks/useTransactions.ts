import { useState, useEffect } from 'react';

export type TransactionType = 'pemasukan' | 'pengeluaran';
export type SyariahLabel = 'Semua' | '✓ Halal' | '⚠️ Syubhat' | '✗ Haram' | '✓ Amal 🌟';

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  date: string;
  syariahLabel?: SyariahLabel;
  category?: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('tracki_transactions');
    if (data) {
      try {
        setTransactions(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse transactions', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const addTransaction = (trx: Omit<Transaction, 'id' | 'date'>) => {
    const newTrx: Transaction = {
      ...trx,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    const updated = [newTrx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('tracki_transactions', JSON.stringify(updated));
    return newTrx;
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('tracki_transactions', JSON.stringify(updated));
  };

  const getSummary = () => {
    let income = 0;
    let expense = 0;
    
    transactions.forEach(t => {
      if (t.type === 'pemasukan') income += t.amount;
      else expense += t.amount;
    });

    return {
      income,
      expense,
      balance: income - expense
    };
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    getSummary,
    isLoaded
  };
}
