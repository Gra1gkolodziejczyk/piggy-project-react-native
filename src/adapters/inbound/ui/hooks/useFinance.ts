import { useState, useEffect } from 'react';
import { Bank, Transaction, TransactionType } from '@/src/domain/entities';
import { financeUseCases } from '@/src/infrastructure/config';

export function useFinance() {
  const [bankAccount, setBankAccount] = useState<Bank | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [account, txs] = await Promise.all([
        financeUseCases.getBankAccount(),
        financeUseCases.getRecentTransactions(20),
      ]);
      setBankAccount(account);
      setTransactions(txs);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    try {
      setIsRefreshing(true);
      await loadData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const addTransaction = async (
    name: string,
    amount: number,
    type: TransactionType,
    category: string,
    frequency: 'once' | 'weekly' | 'monthly' | 'yearly',
    isRecurring: boolean,
    description?: string
  ) => {
    if (type === TransactionType.INCOME) {
      await financeUseCases.createIncome({
        name,
        type: category as any,
        amount,
        frequency: frequency as any,
        isRecurring,
        description,
      });
    } else {
      await financeUseCases.createExpense({
        name,
        amount,
        category: category as any,
        frequency: frequency as any,
        isRecurring,
        description,
      });
    }

    await refresh();
  };

  const [monthlyStats, setMonthlyStats] = useState({ incomes: 0, expenses: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const stats = await financeUseCases.getMonthlyStats();
      setMonthlyStats(stats);
    };
    if (transactions.length > 0) {
      loadStats();
    }
  }, [transactions]);

  return {
    bankAccount,
    transactions,
    monthlyStats,
    isLoading,
    isRefreshing,
    refresh,
    addTransaction,
  };
}
