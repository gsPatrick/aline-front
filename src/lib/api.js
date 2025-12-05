import axios from 'axios';

// URL Hardcoded conforme solicitado
const BASE_URL = 'https://sistema-grande-api.zjbwih.easypanel.host/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o Token JWT automaticamente se existir
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('10stats_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Endpoints Mapeados ---

export const matchService = {
  // Busca jogos ao vivo
  getLive: async () => {
    const { data } = await api.get('/matches/live');
    return data;
  },

  // NOVA: Busca jogos do dia (Home)
  getDaily: async () => {
    const { data } = await api.get('/matches/daily');
    return data;
  },

  // CORREÇÃO DO BUG INFINITO:
  // A rota no backend é /matches/:id e não /matches/:id/stats
  getStats: async (matchId) => {
    const { data } = await api.get(`/matches/${matchId}`);
    return data;
  }
};
export const leagueService = {
  getAll: async (page = 1) => {
    const { data } = await api.get(`/leagues?page=${page}`);
    return data;
  }
};
export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('10stats_token', data.token);
      localStorage.setItem('10stats_user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  }
};

export const teamService = {
  getSchedule: async (teamId) => {
    const { data } = await api.get(`/teams/${teamId}/schedule`);
    return data;
  },
  getSquad: async (teamId) => {
    const { data } = await api.get(`/teams/${teamId}/squad`);
    return data;
  },
  getInfo: async (teamId) => {
    const { data } = await api.get(`/teams/${teamId}/info`);
    return data;
  }
}

// --- HELPER: Normaliza o JSON complexo do Jogador ---
const normalizePlayerProfile = (p) => {
  if (!p) return null;

  // 1. Pé Preferido e Posição
  const footMeta = p.metadata?.find(m => m.type_id === 229);
  const preferredFoot = footMeta ? footMeta.values : "N/A";
  const position = p.detailedposition?.name || p.position?.name || "Jogador";

  // 2. Time Atual
  const currentTeamEntry = p.teams?.sort((a, b) => new Date(b.start) - new Date(a.start))[0];
  const currentTeam = currentTeamEntry ? {
    id: currentTeamEntry.team.id,
    name: currentTeamEntry.team.name,
    logo: currentTeamEntry.team.image_path,
    short_code: currentTeamEntry.team.short_code,
    shirt_number: currentTeamEntry.jersey_number
  } : null;

  // 3. Estatísticas por Temporada (Agrupadas)
  const careerStats = (p.statistics || []).map(stat => {
    const getVal = (id) => {
      const item = stat.details?.find(d => d.type_id === id);
      // Trata valores aninhados ou diretos
      return item ? Number(item.value?.total ?? item.value?.average ?? item.value ?? 0) : 0;
    };

    if (!stat.has_values && !stat.details?.length) return null;

    return {
      id: stat.id,
      season_id: stat.season_id,
      season_name: stat.season?.name,
      league_name: stat.season?.league?.name,
      league_logo: stat.season?.league?.image_path,
      team_logo: stat.team?.image_path,
      matches: getVal(321), // Appearances
      goals: getVal(52),    // Goals
      assists: getVal(79),  // Assists
      rating: getVal(118).toFixed(2), // Rating
      minutes: getVal(119), // Minutes
      yellow_cards: getVal(84),
      shots: getVal(42),
      passes: getVal(80)
    };
  }).filter(Boolean).sort((a, b) => b.season_id - a.season_id);

  // 4. Últimos Jogos
  const lastMatches = (p.latest || []).map(latest => {
    const fix = latest.fixture;
    if (!fix) return null;

    // Identifica times
    const myTeam = fix.participants?.find(x => x.id === latest.team_id);
    const opponent = fix.participants?.find(x => x.id !== latest.team_id);

    // Busca nota específica do jogo
    const ratingDetail = latest.details?.find(d => d.type_id === 118);
    const rating = ratingDetail ? Number(ratingDetail.value?.average ?? ratingDetail.value).toFixed(2) : "-";

    // Busca gols/assistencias no jogo
    const goals = latest.details?.find(d => d.type_id === 52)?.value?.total || 0;
    const assists = latest.details?.find(d => d.type_id === 79)?.value?.total || 0;

    return {
      id: fix.id,
      date: fix.starting_at_timestamp || new Date(fix.starting_at).getTime() / 1000,
      league_name: fix.league?.name,
      league_logo: fix.league?.image_path,
      opponent_name: opponent?.name,
      opponent_logo: opponent?.image_path,
      home_score: fix.scores?.find(s => s.description === 'CURRENT' && s.participant_id === myTeam?.id)?.score?.goals || 0,
      away_score: fix.scores?.find(s => s.description === 'CURRENT' && s.participant_id === opponent?.id)?.score?.goals || 0,
      is_home: myTeam?.meta?.location === 'home',
      rating,
      goals,
      assists
    };
  }).filter(Boolean).sort((a, b) => b.date - a.date);

  // 5. Troféus
  const trophies = (p.trophies || []).map(t => ({
    id: t.id,
    league_name: t.league?.name,
    season: t.season?.name,
    status: t.trophy?.name, // Winner, Runner-up
    team_logo: t.team?.image_path,
    league_logo: t.league?.image_path
  }));

  return {
    info: {
      id: p.id,
      name: p.display_name,
      fullname: p.name,
      photo: p.image_path,
      age: p.date_of_birth ? Math.floor((new Date() - new Date(p.date_of_birth).getTime()) / 3.15576e+10) : "-",
      birthdate: p.date_of_birth,
      height: p.height,
      weight: p.weight,
      nationality: p.nationality?.name,
      flag: p.nationality?.image_path,
      position: position,
      foot: preferredFoot,
      current_team: currentTeam
    },
    career: careerStats,
    latest: lastMatches,
    trophies: trophies
  };
};

// --- NOVOS ENDPOINTS ---
export const playerService = {
  getProfile: async (playerId) => {
    // Includes gigantescos conforme solicitado
    const includes = [
      "trophies.league", "trophies.season", "trophies.trophy", "trophies.team",
      "teams.team", "statistics.details.type", "statistics.team", "statistics.season.league",
      "latest.fixture.participants", "latest.fixture.league", "latest.fixture.scores",
      "latest.details.type", "nationality", "detailedPosition", "metadata.type"
    ].join(";");

    // Faz a chamada passando os includes como query param
    // Nota: O axios vai serializar automaticamente se configurado, ou passamos na string
    const { data } = await api.get(`/players/${playerId}`, {
      params: { include: includes }
    });

    // Retorna os dados JÁ NORMALIZADOS para a página
    return normalizePlayerProfile(data);
  }
};

export default api;