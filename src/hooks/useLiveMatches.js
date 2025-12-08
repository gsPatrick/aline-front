import { useState, useEffect, useRef } from 'react';
import { matchService } from '@/lib/api';
import { getSocket } from '@/lib/socket';

export function useLiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const matchesRef = useRef([]); // Ref para acesso imediato dentro do socket callback

  // Função para buscar dados iniciais
  const fetchMatches = async () => {
    try {
      // Só mostra loading na primeira carga se não tiver dados
      if (matchesRef.current.length === 0) setLoading(true);

      const response = await matchService.getLive();

      // A API agora retorna: { success, total_leagues, total_fixtures, data: [...] }
      // onde data é um array de objetos com: { league_id, league_name, country_name, country_flag, fixtures: [...] }
      const newMatches = response?.data || [];

      setMatches(newMatches);
      matchesRef.current = newMatches;
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar jogos:", err);
      setError("Falha ao carregar jogos ao vivo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Busca inicial via HTTP
    fetchMatches();

    // 2. Conecta ao Socket para atualizações em tempo real
    const socket = getSocket();

    const handleMatchUpdate = (updatedMatches) => {
      console.log("⚡ Live Update via Socket:", updatedMatches.length, "jogos");

      // Atualização Otimista / Imutável
      // O backend já manda a lista completa dos jogos ao vivo atualizada
      // Se mandasse apenas o delta, faríamos o merge aqui.
      // Como manda a lista, substituímos, mas o React fará o diff virtual DOM
      setMatches(updatedMatches);
      matchesRef.current = updatedMatches;
    };

    socket.on('match:update', handleMatchUpdate);
    socket.on('alert:new', (payload) => {
      console.log("🔔 Novo Alerta:", payload);
    });

    // 3. Polling de segurança (Fallback) - Aumentado para 60s já que temos socket
    const intervalId = setInterval(fetchMatches, 60000);

    return () => {
      socket.off('match:update', handleMatchUpdate);
      socket.off('alert:new');
      clearInterval(intervalId);
    };
  }, []);

  return { matches, loading, fetchMatches, error };
}