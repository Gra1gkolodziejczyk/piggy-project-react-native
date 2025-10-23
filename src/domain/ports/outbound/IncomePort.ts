import { Frequency, Income, IncomeType } from "../../entities/Income";

export interface CreateIncomeData {
  name: string;
  type: IncomeType;
  amount: number;
  frequency: Frequency;
  isRecurring: boolean;
  nextPaymentDate?: Date;
  description?: string;
}

export interface IncomePort {
  getIncomes(): Promise<Income[]>;
  createIncome(data: CreateIncomeData): Promise<Income>;
  deleteIncome(incomeId: string): Promise<void>;
}
