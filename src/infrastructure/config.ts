import { SecureStorageAdapter } from "@/src/adapters/outbound/storage";
import { AuthUseCases } from "@/src/domain/usecases";
import { AuthApiAdapter } from "../adapters/outbound/api/AuthApiAdapter";
import { BankApiAdapter } from "../adapters/outbound/api/BankApiAdapter";
import { ExpenseApiAdapter } from "../adapters/outbound/api/ExpenseApiAdapter";
import { IncomeApiAdapter } from "../adapters/outbound/api/IncomeApiAdapter";
import { HttpClient } from "../adapters/outbound/http/httpClient";
import { FinanceUseCases } from "../domain/usecases/FinanceUseCases";
import {TokenService} from "@/src/infrastructure/services/TokenService";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export const httpClient = new HttpClient({
  baseUrl: API_BASE_URL,
  timeout: 30000,
});

httpClient.setTokenProvider(async () => {
  const token = await TokenService.getToken();
  return token;
});

export const storageAdapter = new SecureStorageAdapter();
export const authApiAdapter = new AuthApiAdapter(httpClient);
export const bankApiAdapter = new BankApiAdapter(httpClient);
export const incomeApiAdapter = new IncomeApiAdapter(httpClient);
export const expenseApiAdapter = new ExpenseApiAdapter(httpClient);

export const authUseCases = new AuthUseCases(authApiAdapter, storageAdapter);
export const financeUseCases = new FinanceUseCases(
  bankApiAdapter,
  incomeApiAdapter,
  expenseApiAdapter
);
