
import { HttpClient } from '../adapters/outbound/http/httpClient';
import { AuthApiAdapter } from '../adapters/outbound/api/AuthApiAdapter';
import { SecureStorageAdapter } from '../adapters/outbound/storage';
import { AuthUseCases } from '../domain/usecases';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export const httpClient = new HttpClient({
  baseUrl: API_BASE_URL,
  timeout: 30000,
});

export const storageAdapter = new SecureStorageAdapter();
export const authApiAdapter = new AuthApiAdapter(httpClient);
export const authUseCases = new AuthUseCases(authApiAdapter, storageAdapter);
