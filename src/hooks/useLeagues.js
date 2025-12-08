import { useState, useEffect } from 'react';
import { leagueService } from '@/lib/api';

export function useLeagues() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeagues = async () => {
      try {
        setLoading(true);
        const response = await leagueService.getAll();

        // A API agora retorna: { success, total, data: [...] }
        // onde data contém todas as 113 ligas
        setLeagues(response?.data || []);
      } catch (err) {
        console.error("Erro ao carregar ligas", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadLeagues();
  }, []);

  return { leagues, loading, error };
}