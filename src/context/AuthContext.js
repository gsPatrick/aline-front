'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifica se já existe token salvo ao carregar
    const storedUser = localStorage.getItem('10stats_user');
    const token = localStorage.getItem('10stats_token');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      router.push('/'); // Redireciona para home após login
      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Falha ao entrar. Verifique suas credenciais.' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      await authService.register(name, email, password);
      // Após registro, fazemos o login automático ou pedimos para logar
      // Aqui vamos redirecionar para o login
      router.push('/login');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao criar conta.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('10stats_token');
    localStorage.removeItem('10stats_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);