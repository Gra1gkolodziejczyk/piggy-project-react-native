import {
  CreateExpenseCommand,
  CreateIncomeCommand,
  FinanceUseCasePort,
} from "../ports/inbound";
import { BankAccountPort, ExpensePort, IncomePort } from "../ports/outbound";

import { Transaction } from "@/src/domain/entities";
import { Bank } from "../entities/Bank";
import { Expense } from "../entities/Expense";
import { Income } from "../entities/Income";

export class FinanceUseCases implements FinanceUseCasePort {
  constructor(
    private readonly bankAccountPort: BankAccountPort,
    private readonly incomePort: IncomePort,
    private readonly expensePort: ExpensePort
  ) {}

  async getBankAccount(): Promise<Bank> {
    return await this.bankAccountPort.getBankAccount();
  }

  async addBalanceManually(amount: number, description: string): Promise<Bank> {
    if (amount <= 0) {
      throw new Error("Le montant doit être positif");
    }
    return await this.bankAccountPort.addBalance(amount, description);
  }

  async subtractBalanceManually(
    amount: number,
    description: string
  ): Promise<Bank> {
    if (amount <= 0) {
      throw new Error("Le montant doit être positif");
    }
    return await this.bankAccountPort.subtractBalance(amount, description);
  }

  async updateCurrency(currency: string): Promise<Bank> {
    return await this.bankAccountPort.updateCurrency(currency);
  }

  async getRecentTransactions(limit: number = 20): Promise<Transaction[]> {
    const [incomes, expenses] = await Promise.all([
      this.incomePort.getIncomes(),
      this.expensePort.getExpenses(),
    ]);

    const incomeTransactions = incomes.map((i) => Transaction.fromIncome(i));
    const expenseTransactions = expenses.map((e) => Transaction.fromExpense(e));

    const allTransactions = [...incomeTransactions, ...expenseTransactions];
    allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    return allTransactions.slice(0, limit);
  }

  async createIncome(command: CreateIncomeCommand): Promise<Income> {
    if (command.amount <= 0) {
      throw new Error("Le montant doit être positif");
    }

    if (!command.name || command.name.trim().length === 0) {
      throw new Error("Le nom est requis");
    }

    return await this.incomePort.createIncome({
      name: command.name.trim(),
      type: command.type,
      amount: command.amount,
      frequency: command.frequency,
      isRecurring: command.isRecurring,
      nextPaymentDate: command.nextPaymentDate,
      description: command.description,
    });
  }

  async deleteIncome(incomeId: string): Promise<void> {
    await this.incomePort.deleteIncome(incomeId);
  }

  async createExpense(command: CreateExpenseCommand): Promise<Expense> {
    if (command.amount <= 0) {
      throw new Error("Le montant doit être positif");
    }

    if (!command.name || command.name.trim().length === 0) {
      throw new Error("Le nom est requis");
    }

    return await this.expensePort.createExpense({
      name: command.name.trim(),
      amount: command.amount,
      category: command.category,
      description: command.description,
      frequency: command.frequency,
      isRecurring: command.isRecurring,
      nextPaymentDate: command.nextPaymentDate,
    });
  }

  async deleteExpense(expenseId: string): Promise<void> {
    await this.expensePort.deleteExpense(expenseId);
  }

  async getMonthlyStats(): Promise<{ incomes: number; expenses: number }> {
    const transactions = await this.getRecentTransactions(100);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const incomes = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { incomes, expenses };
  }
}
