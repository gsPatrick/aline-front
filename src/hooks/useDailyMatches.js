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
        const data = await matchService.getDaily();
        setMatches(data || []);
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