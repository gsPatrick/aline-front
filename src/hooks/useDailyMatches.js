import { useState, useEffect } from 'react';
import { matchService } from '@/lib/api';

export function useDailyMatches(selectedDate = null) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        setLoading(true);
        let response;

        if (selectedDate) {
          // Fetch matches for specific date
          response = await matchService.getByDate(selectedDate);
        } else {
          // Fetch today's matches
          response = await matchService.getDaily();
        }

        // A API retorna: { success, date, total_leagues, total_fixtures, data: [...] }
        setMatches(response?.data || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDaily();
  }, [selectedDate]);

  return { matches, loading, error };
}