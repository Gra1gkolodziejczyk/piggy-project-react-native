import { Expense } from "./Expense";
import { Income } from "./Income";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly category: string,
    public readonly date: Date
  ) {}

  static fromIncome(income: Income): Transaction {
    return new Transaction(
      income.id,
      income.name,
      income.amount,
      TransactionType.INCOME,
      income.type,
      income.createdAt
    );
  }

  static fromExpense(expense: Expense): Transaction {
    return new Transaction(
      expense.id,
      expense.name,
      expense.amount,
      TransactionType.EXPENSE,
      expense.category,
      expense.createdAt
    );
  }

  formatAmount(): string {
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(Math.abs(this.amount));

    return this.type === TransactionType.INCOME
      ? `+${formatted}`
      : `-${formatted}`;
  }

  getIcon(): string {
    return this.type === TransactionType.INCOME ? "↗️" : "↘️";
  }

  getColor(): string {
    return this.type === TransactionType.INCOME ? "#34C759" : "#FF3B30";
  }
}
