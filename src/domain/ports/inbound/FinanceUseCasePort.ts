import {
  Expense,
  ExpenseCategory,
  Frequency as ExpenseFrequency,
} from "../../entities/Expense";
import {
  Income,
  Frequency as IncomeFrequency,
  IncomeType,
} from "../../entities/Income";

import { Transaction } from "@/src/domain/entities";
import { Bank } from "../../entities/Bank";

export interface CreateIncomeCommand {
  name: string;
  type: IncomeType;
  amount: number;
  frequency: IncomeFrequency;
  isRecurring: boolean;
  nextPaymentDate?: Date;
  description?: string;
}

export interface CreateExpenseCommand {
  name: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  frequency: ExpenseFrequency;
  isRecurring: boolean;
  nextPaymentDate?: Date;
}

export interface FinanceUseCasePort {
  getBankAccount(): Promise<Bank>;
  addBalanceManually(amount: number, description: string): Promise<Bank>;
  subtractBalanceManually(amount: number, description: string): Promise<Bank>;
  updateCurrency(currency: string): Promise<Bank>;

  getRecentTransactions(limit?: number): Promise<Transaction[]>;

  createIncome(command: CreateIncomeCommand): Promise<Income>;
  createExpense(command: CreateExpenseCommand): Promise<Expense>;

  deleteIncome(incomeId: string): Promise<void>;
  deleteExpense(expenseId: string): Promise<void>;

  getMonthlyStats(): Promise<{ incomes: number; expenses: number }>;
}
