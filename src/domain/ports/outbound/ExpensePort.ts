import { Expense, ExpenseCategory, Frequency } from '../../entities/Expense';

export interface CreateExpenseData {
  name: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  frequency: Frequency;
  isRecurring: boolean;
  nextPaymentDate?: Date;
}

export interface ExpensePort {
  getExpenses(): Promise<Expense[]>;
  createExpense(data: CreateExpenseData): Promise<Expense>;
  deleteExpense(expenseId: string): Promise<void>;
}
