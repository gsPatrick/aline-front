import { useState, useEffect } from 'react';
import { matchService } from '@/lib/api';

export function useMatchDetails(matchId) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await matchService.getStats(matchId);
        setMatch(data);
      } catch (err) {
        console.error("Erro ao carregar detalhes da partida:", err);
        setError("Não foi possível carregar os dados desta partida.");
      } finally {
        setLoading(false);
      }
    };

    load();

    // Opcional: Polling para atualizar dados em tempo real se o jogo estiver LIVE
    const interval = setInterval(load, 30000); // 30 segundos
    return () => clearInterval(interval);

  }, [matchId]);

  return { match, loading, error };
}