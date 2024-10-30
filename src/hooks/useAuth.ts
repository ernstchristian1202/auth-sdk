// src/hooks/useAuth.ts
import { useAuth } from '../context/AuthContext';

export const useAuthAPI = () => {
  const { user, login, logout } = useAuth();

  return {
    isAuthenticated: !!user,
    user,
    login,
    logout,
  };
};
