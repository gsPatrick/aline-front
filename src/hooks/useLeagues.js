import { useState, useEffect } from 'react';
import { leagueService } from '@/lib/api';

export function useLeagues() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadLeagues = async (pageNum) => {
    try {
      setLoading(true);
      const data = await leagueService.getAll(pageNum);

      if (data) {
        setLeagues(data);
      }
    } catch (error) {
      console.error("Erro ao carregar ligas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeagues(1);
  }, []);

  const nextPage = () => {
    if (!loading) {
      const next = page + 1;
      setPage(next);
      loadLeagues(next);
    }
  };

  const prevPage = () => {
    if (!loading && page > 1) {
      const prev = page - 1;
      setPage(prev);
      loadLeagues(prev);
    }
  };

  return { leagues, loading, page, nextPage, prevPage };
}