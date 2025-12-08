import { useState, useEffect, useCallback } from 'react';
import { matchService } from '@/lib/api';

export function useMatchDetails(matchId) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCondition, setFilterCondition] = useState('ALL'); // ALL, HOME, AWAY

  // Computed: Check if match is live
  const isLive = match?.matchInfo?.state === 'LIVE' ||
    match?.matchInfo?.state === 'HT' ||
    match?.matchInfo?.state === 'ET';

  const fetchMatchData = useCallback(async () => {
    if (!matchId) return;

    try {
      setLoading(true);
      const data = await matchService.getAnalysis(matchId);
      setMatch(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar detalhes da partida:", err);
      setError("Não foi possível carregar os dados desta partida.");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatchData();

    // Intelligent Polling: Only poll if match is LIVE
    let interval;
    if (isLive) {
      interval = setInterval(fetchMatchData, 30000); // 30 seconds for live matches
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [matchId, isLive, fetchMatchData]);

  return {
    match,
    loading,
    error,
    filterCondition,
    setFilterCondition,
    isLive,
    refetch: fetchMatchData
  };
}