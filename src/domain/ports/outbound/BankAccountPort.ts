import { Bank } from "../../entities/Bank";

export interface BankAccountPort {
  getBankAccount(): Promise<Bank>;
  addBalance(amount: number, description: string): Promise<Bank>;
  subtractBalance(amount: number, description: string): Promise<Bank>;
  updateCurrency(currency: string): Promise<Bank>;
}
