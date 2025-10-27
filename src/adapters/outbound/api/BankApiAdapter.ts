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

      if (error instanceof Error) {
        if (error.message.includes('Unauthorized') || error.message.includes('401')) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        if (error.message.includes('Network') || error.message.includes('fetch')) {
          throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
        }
      }

      throw new Error('Impossible de récupérer les données bancaires');
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

      if (error instanceof Error) {
        if (error.message.includes('Unauthorized') || error.message.includes('401')) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        if (error.message.includes('Bad Request') || error.message.includes('400')) {
          throw new Error('Montant invalide. Veuillez vérifier les données saisies.');
        }
      }

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

      if (error instanceof Error) {
        if (error.message.includes('Unauthorized') || error.message.includes('401')) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        if (error.message.includes('Bad Request') || error.message.includes('400')) {
          throw new Error('Montant invalide ou solde insuffisant.');
        }

        if (error.message.includes('Insufficient')) {
          throw new Error('Solde insuffisant pour effectuer cette opération.');
        }
      }

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
      console.error('[BankApiAdapter] ❌ Erreur changement de devise:', error);

      if (error instanceof Error) {
        if (error.message.includes('Unauthorized') || error.message.includes('401')) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        if (error.message.includes('Bad Request') || error.message.includes('400')) {
          throw new Error('Devise invalide. Veuillez sélectionner une devise valide.');
        }
      }

      throw new Error("Impossible de changer la devise");
    }
  }
}