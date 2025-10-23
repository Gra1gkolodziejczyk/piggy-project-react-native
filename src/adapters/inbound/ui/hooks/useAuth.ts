import { AuthContext } from "@/src/infrastructure/providers";
import { useContext } from "react";

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
