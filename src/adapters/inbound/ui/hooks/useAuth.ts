import { useContext } from 'react';
import { AuthContext } from '@/src/infrastructure/providers';

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
