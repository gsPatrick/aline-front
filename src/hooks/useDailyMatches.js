import { useState, useEffect } from 'react';
import { matchService } from '@/lib/api';

export function useDailyMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        setLoading(true);
        const response = await matchService.getDaily();

        // A API agora retorna: { success, date, total_leagues, total_fixtures, data: [...] }
        // onde data é um array de objetos com: { league_id, league_name, country_name, country_flag, fixtures: [...] }
        setMatches(response?.data || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDaily();
  }, []);

  return { matches, loading, error };
}