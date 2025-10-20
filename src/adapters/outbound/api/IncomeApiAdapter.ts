import { IncomePort, CreateIncomeData } from '@/src/domain/ports/outbound';
import { Income, IncomeType, Frequency } from '@/src/domain/entities/Income';
import { HttpClient } from '../http/httpClient';

interface BackendIncomeResponse {
  id: string;
  userId: string;
  name: string;
  type: string;
  amount: string;
  frequency: string;
  nextPaymentDate: string | null;
  isRecurring: boolean;
  isActive: boolean;
  isArchived: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export class IncomeApiAdapter implements IncomePort {
  constructor(private readonly httpClient: HttpClient) {}

  async getIncomes(): Promise<Income[]> {
    try {
      const response = await this.httpClient.get<BackendIncomeResponse[]>('/incomes');

      return response.map(i => new Income(
        i.id,
        i.userId,
        i.name,
        i.type as IncomeType,
        parseFloat(i.amount),
        i.frequency as Frequency,
        i.isRecurring,
        i.nextPaymentDate ? new Date(i.nextPaymentDate) : null,
        i.isActive,
        i.isArchived,
        i.description,
        new Date(i.createdAt),
        new Date(i.updatedAt),
        i.archivedAt ? new Date(i.archivedAt) : null
      ));
    } catch (error) {
      console.error('Erreur lors de la récupération des revenus:', error);
      throw new Error('Impossible de récupérer les revenus');
    }
  }

  async createIncome(data: CreateIncomeData): Promise<Income> {
    try {
      const response = await this.httpClient.post<BackendIncomeResponse>('/incomes', {
        name: data.name,
        type: data.type,
        amount: data.amount,
        frequency: data.frequency,
        isRecurring: data.isRecurring,
        nextPaymentDate: data.nextPaymentDate?.toISOString(),
        description: data.description || '',
      });

      return new Income(
        response.id,
        response.userId,
        response.name,
        response.type as IncomeType,
        parseFloat(response.amount),
        response.frequency as Frequency,
        response.isRecurring,
        response.nextPaymentDate ? new Date(response.nextPaymentDate) : null,
        response.isActive,
        response.isArchived,
        response.description,
        new Date(response.createdAt),
        new Date(response.updatedAt),
        response.archivedAt ? new Date(response.archivedAt) : null
      );
    } catch (error) {
      console.error('Erreur lors de la création du revenu:', error);
      throw new Error('Impossible de créer le revenu');
    }
  }

  async deleteIncome(incomeId: string): Promise<void> {
    try {
      await this.httpClient.delete(`/incomes/${incomeId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du revenu:', error);
      throw new Error('Impossible de supprimer le revenu');
    }
  }
}
