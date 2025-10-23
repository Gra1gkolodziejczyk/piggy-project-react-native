import { Bank } from "@/src/domain/entities";
import { BankAccountPort } from "@/src/domain/ports/outbound";
import { HttpClient } from "../http/httpClient";

interface BackendBankResponse {
  id: string;
  userId: string;
  balance: string;
  currency: string;
  lastUpdatedAt: string;
  createdAt: string;
}

export class BankApiAdapter implements BankAccountPort {
  constructor(private readonly httpClient: HttpClient) {}

  async getBankAccount(): Promise<Bank> {
    try {
      const response = await this.httpClient.get<BackendBankResponse>("/banks");

      return new Bank(
        response.id,
        response.userId,
        parseFloat(response.balance),
        response.currency,
        new Date(response.lastUpdatedAt),
        new Date(response.createdAt)
      );
    } catch (error) {
      console.error("Erreur lors de la récupération du compte:", error);
      throw new Error("Impossible de récupérer les données bancaires");
    }
  }

  async addBalance(amount: number, description: string): Promise<Bank> {
    try {
      const response = await this.httpClient.patch<BackendBankResponse>(
        "/banks/balance/add",
        { amount, description }
      );

      return new Bank(
        response.id,
        response.userId,
        parseFloat(response.balance),
        response.currency,
        new Date(response.lastUpdatedAt),
        new Date(response.createdAt)
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout au solde:", error);
      throw new Error("Impossible d'ajouter au solde");
    }
  }

  async subtractBalance(amount: number, description: string): Promise<Bank> {
    try {
      const response = await this.httpClient.patch<BackendBankResponse>(
        "/banks/balance/subtract",
        { amount, description }
      );

      return new Bank(
        response.id,
        response.userId,
        parseFloat(response.balance),
        response.currency,
        new Date(response.lastUpdatedAt),
        new Date(response.createdAt)
      );
    } catch (error) {
      console.error("Erreur lors du retrait du solde:", error);
      throw new Error("Impossible de retirer du solde");
    }
  }

  async updateCurrency(currency: string): Promise<Bank> {
    try {
      const response = await this.httpClient.patch<BackendBankResponse>(
        "/banks/currency",
        { currency }
      );

      return new Bank(
        response.id,
        response.userId,
        parseFloat(response.balance),
        response.currency,
        new Date(response.lastUpdatedAt),
        new Date(response.createdAt)
      );
    } catch (error) {
      console.error("Erreur lors du changement de devise:", error);
      throw new Error("Impossible de changer la devise");
    }
  }
}
