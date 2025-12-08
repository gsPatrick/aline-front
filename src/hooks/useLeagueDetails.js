import { useState, useEffect } from 'react';
import { leagueService } from '@/lib/api';

export function useLeagueDetails(leagueId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!leagueId) return;

        const loadLeagueDetails = async () => {
            try {
                setLoading(true);
                const response = await leagueService.getDetails(leagueId);

                // API retorna: { success, data: { leagueInfo, standings, ... } }
                if (response?.success) {
                    setData(response.data);
                } else {
                    setError('Failed to load league details');
                }
            } catch (err) {
                console.error("Erro ao carregar detalhes da liga:", err);
                setError(err.message || 'Failed to load league details');
            } finally {
                setLoading(false);
            }
        };

        loadLeagueDetails();
    }, [leagueId]);

    return { data, loading, error };
}
