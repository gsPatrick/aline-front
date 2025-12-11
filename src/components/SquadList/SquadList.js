'use client';
import { useState, useMemo } from 'react';
import { FaSearch, FaUserAlt } from 'react-icons/fa';
import styles from './SquadList.module.css';

// Get position abbreviation
const getPositionLabel = (position) => {
  if (!position) return '-';
  const pos = position.toLowerCase();
  if (pos.includes('goal') || pos.includes('keeper')) return 'G';
  if (pos.includes('defend') || pos.includes('back')) return 'D';
  if (pos.includes('mid')) return 'M';
  if (pos.includes('attack') || pos.includes('forward') || pos.includes('striker')) return 'A';
  return position.charAt(0).toUpperCase();
};

// Get rating color class
const getRatingClass = (rating) => {
  if (!rating || rating === 0) return 'ratingNone';
  if (rating >= 8) return 'ratingExcellent';
  if (rating >= 7) return 'ratingGood';
  if (rating >= 6) return 'ratingAverage';
  return 'ratingPoor';
};

export default function SquadList({ squad, competitions = [] }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'absences'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [showOnlyWithMinutes, setShowOnlyWithMinutes] = useState(false);
  const [sortColumn, setSortColumn] = useState('rating');
  const [sortDirection, setSortDirection] = useState('desc');

  if (!squad || !Array.isArray(squad) || squad.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <FaUserAlt className={styles.emptyIcon} />
          <p>Dados do elenco indisponíveis no momento.</p>
        </div>
      </div>
    );
  }

  // Normalize player data
  const players = useMemo(() => {
    return squad.map((p, idx) => ({
      id: p.id,
      jersey: p.jersey_number || p.number || (idx + 1),
      name: p.name || p.common_name || p.display_name || 'Jogador',
      position: p.position?.name || p.position_name || p.position || 'N/A',
      photo: p.image || p.photo || p.image_path,
      rating: p.rating || p.stats?.rating || 0,
      age: p.age || null,
      goals: p.goals || p.stats?.goals || 0,
      assists: p.assists || p.stats?.assists || 0,
      matches: p.matchesPlayed || p.stats?.matches || 0,
      minutes: p.minutesPlayed || p.stats?.minutes || 0,
      yellowCards: p.yellowCards || p.stats?.yellowCards || 0,
      redCards: p.redCards || p.stats?.redCards || 0,
      // Injury/absence info
      isInjured: p.is_injured || p.injury || false,
      injuryReason: p.injury_reason || p.reason || null,
      injuryType: p.injury_type || p.type_of_injury || null,
      // Competition data
      competitions: p.competitions || []
    }));
  }, [squad]);

  // Get unique leagues from competitions or players
  const leagues = useMemo(() => {
    const leagueSet = new Set();
    competitions.forEach(c => {
      if (c.name) leagueSet.add(c.name);
    });
    if (leagueSet.size === 0) {
      leagueSet.add('Todas as ligas');
    }
    return Array.from(leagueSet);
  }, [competitions]);

  // Filter players
  const filteredPlayers = useMemo(() => {
    let result = [...players];

    // Tab filter
    if (activeTab === 'absences') {
      result = result.filter(p => p.isInjured);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query)
      );
    }

    // Minutes filter
    if (showOnlyWithMinutes && activeTab === 'all') {
      result = result.filter(p => p.minutes > 0 || p.matches > 0);
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortColumn] ?? 0;
      let bVal = b[sortColumn] ?? 0;

      // Handle string sort for name
      if (sortColumn === 'name') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
        if (sortDirection === 'asc') {
          return aVal.localeCompare(bVal);
        }
        return bVal.localeCompare(aVal);
      }

      // Number sort
      if (sortDirection === 'asc') {
        return (aVal || 0) - (bVal || 0);
      }
      return (bVal || 0) - (aVal || 0);
    });

    return result;
  }, [players, activeTab, searchQuery, showOnlyWithMinutes, sortColumn, sortDirection]);

  // Handle column header click for sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Get injured players count
  const injuredCount = players.filter(p => p.isInjured).length;

  return (
    <div className={styles.container}>
      {/* Header with Tabs */}
      <div className={styles.header}>
        <h3 className={styles.title}>Jogadores</h3>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Ver todos os jogadores
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'absences' ? styles.active : ''}`}
            onClick={() => setActiveTab('absences')}
          >
            Ausências {injuredCount > 0 && <span className={styles.badge}>{injuredCount}</span>}
          </button>
        </div>
      </div>

      {/* Filters Row */}
      {activeTab === 'all' && (
        <div className={styles.filtersRow}>
          {/* Minutes Toggle & Search */}
          <label className={styles.toggleLabel}>
            <span>Mostrar apenas jogadores com minutos jogados</span>
            <button
              className={`${styles.toggle} ${showOnlyWithMinutes ? styles.active : ''}`}
              onClick={() => setShowOnlyWithMinutes(!showOnlyWithMinutes)}
            >
              <span className={styles.toggleKnob} />
            </button>
          </label>

          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Procurar jogadores"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>
      )}

      {/* Search for absences tab */}
      {activeTab === 'absences' && (
        <div className={styles.filtersRow}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Procurar jogadores"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thNumber}>#</th>
              <th className={styles.thPlayer}>Jogador</th>
              {activeTab === 'all' ? (
                <>
                  <th
                    className={`${styles.thSortable} ${sortColumn === 'rating' ? styles.sorted : ''}`}
                    onClick={() => handleSort('rating')}
                  >
                    Classificação {sortColumn === 'rating' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className={styles.thStat}>Idade</th>
                  <th className={styles.thPos}>Posição</th>
                  <th
                    className={`${styles.thSortable} ${sortColumn === 'matches' ? styles.sorted : ''}`}
                    onClick={() => handleSort('matches')}
                  >
                    Jogos {sortColumn === 'matches' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className={`${styles.thSortable} ${sortColumn === 'minutes' ? styles.sorted : ''}`}
                    onClick={() => handleSort('minutes')}
                  >
                    Minutos {sortColumn === 'minutes' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className={`${styles.thSortable} ${sortColumn === 'goals' ? styles.sorted : ''}`}
                    onClick={() => handleSort('goals')}
                  >
                    Golos {sortColumn === 'goals' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className={`${styles.thSortable} ${sortColumn === 'assists' ? styles.sorted : ''}`}
                    onClick={() => handleSort('assists')}
                  >
                    Assistências {sortColumn === 'assists' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className={styles.thStat}>Cartões Amarelos</th>
                  <th className={styles.thStat}>Cartões Vermelhos</th>
                </>
              ) : (
                <>
                  <th className={styles.thPos}>Posição</th>
                  <th className={styles.thReason}>Razão</th>
                  <th className={styles.thReason}>Tipo de Lesão</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={activeTab === 'all' ? 11 : 5} className={styles.noResults}>
                  {activeTab === 'absences'
                    ? 'Nenhuma ausência registrada'
                    : 'Nenhum jogador encontrado'}
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player) => (
                <tr key={player.id} className={styles.row}>
                  <td className={styles.tdNumber}>{player.jersey}</td>
                  <td className={styles.tdPlayer}>
                    <div className={styles.playerInfo}>
                      <div className={styles.photoWrapper}>
                        {player.photo ? (
                          <img
                            src={player.photo}
                            alt={player.name}
                            className={styles.photo}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={styles.photoPlaceholder} style={{ display: player.photo ? 'none' : 'flex' }}>
                          <FaUserAlt />
                        </div>
                      </div>
                      <span className={styles.playerName}>{player.name}</span>
                    </div>
                  </td>
                  {activeTab === 'all' ? (
                    <>
                      <td className={styles.tdRating}>
                        <span className={`${styles.ratingBadge} ${styles[getRatingClass(player.rating)]}`}>
                          {player.rating ? player.rating.toFixed(2) : '-'}
                        </span>
                      </td>
                      <td className={styles.tdStat}>{player.age || '-'}</td>
                      <td className={styles.tdPos}>
                        <span className={styles.posBadge}>{getPositionLabel(player.position)}</span>
                      </td>
                      <td className={styles.tdStat}>{player.matches}</td>
                      <td className={styles.tdStat}>{player.minutes}</td>
                      <td className={styles.tdStat}>{player.goals || '-'}</td>
                      <td className={styles.tdStat}>{player.assists || '-'}</td>
                      <td className={styles.tdStat}>{player.yellowCards || '-'}</td>
                      <td className={styles.tdStat}>{player.redCards || '-'}</td>
                    </>
                  ) : (
                    <>
                      <td className={styles.tdPos}>
                        <span className={styles.posBadge}>{getPositionLabel(player.position)}</span>
                      </td>
                      <td className={styles.tdReason}>{player.injuryReason || 'injury'}</td>
                      <td className={styles.tdReason}>{player.injuryType || '-'}</td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Player Count */}
      <div className={styles.playerCount}>
        {activeTab === 'all'
          ? `Exibindo ${filteredPlayers.length} de ${players.length} jogadores`
          : `${filteredPlayers.length} ausência${filteredPlayers.length !== 1 ? 's' : ''}`
        }
      </div>
    </div>
  );
}
