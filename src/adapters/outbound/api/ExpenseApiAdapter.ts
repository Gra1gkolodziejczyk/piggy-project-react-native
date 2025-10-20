import { ExpensePort, CreateExpenseData } from '@/src/domain/ports/outbound';
import { Expense, ExpenseCategory, Frequency } from '@/src/domain/entities/Expense';
import { HttpClient } from '../http/httpClient';

interface BackendExpenseResponse {
  id: string;
  userId: string;
  name: string;
  icon: string | null;
  category: string;
  description: string;
  amount: string;
  frequency: string;
  isRecurring: boolean;
  nextPaymentDate: string | null;
  splitPercentages: any | null;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export class ExpenseApiAdapter implements ExpensePort {
  constructor(private readonly httpClient: HttpClient) {}

  async getExpenses(): Promise<Expense[]> {
    try {
      const response = await this.httpClient.get<BackendExpenseResponse[]>('/expenses');

      return response.map(e => new Expense(
        e.id,
        e.userId,
        e.name,
        e.icon,
        e.category as ExpenseCategory,
        e.description,
        parseFloat(e.amount),
        e.frequency as Frequency,
        e.isRecurring,
        e.nextPaymentDate ? new Date(e.nextPaymentDate) : null,
        e.splitPercentages,
        e.isActive,
        e.isArchived,
        new Date(e.createdAt),
        new Date(e.updatedAt),
        e.archivedAt ? new Date(e.archivedAt) : null
      ));
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses:', error);
      throw new Error('Impossible de récupérer les dépenses');
    }
  }

  async createExpense(data: CreateExpenseData): Promise<Expense> {
    try {
      const response = await this.httpClient.post<BackendExpenseResponse>('/expenses', {
        name: data.name,
        amount: data.amount,
        category: data.category,
        description: data.description || '',
        frequency: data.frequency,
        isRecurring: data.isRecurring,
        nextPaymentDate: data.nextPaymentDate?.toISOString(),
      });

      return new Expense(
        response.id,
        response.userId,
        response.name,
        response.icon,
        response.category as ExpenseCategory,
        response.description,
        parseFloat(response.amount),
        response.frequency as Frequency,
        response.isRecurring,
        response.nextPaymentDate ? new Date(response.nextPaymentDate) : null,
        response.splitPercentages,
        response.isActive,
        response.isArchived,
        new Date(response.createdAt),
        new Date(response.updatedAt),
        response.archivedAt ? new Date(response.archivedAt) : null
      );
    } catch (error) {
      console.error('Erreur lors de la création de la dépense:', error);
      throw new Error('Impossible de créer la dépense');
    }
  }

  async deleteExpense(expenseId: string): Promise<void> {
    try {
      await this.httpClient.delete(`/expenses/${expenseId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense:', error);
      throw new Error('Impossible de supprimer la dépense');
    }
  }
}
