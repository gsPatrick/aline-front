'use client';
import { useState } from 'react';
import { FaUsers, FaStar, FaFutbol, FaHandsHelping, FaExclamationTriangle } from 'react-icons/fa';
import styles from './SquadAnalysis.module.css';

export default function SquadAnalysis({ homeSquad, awaySquad, homeTeamName, awayTeamName, homeTeamLogo, awayTeamLogo }) {
    const [activeTeam, setActiveTeam] = useState('home');
    const [positionFilter, setPositionFilter] = useState('all');

    // Check if any squad data exists
    const hasAnyData = (homeSquad?.hasData || homeSquad?.players?.length > 0) ||
        (awaySquad?.hasData || awaySquad?.players?.length > 0);

    if (!hasAnyData) {
        return (
            <div className={styles.emptyState}>
                <FaUsers className={styles.emptyIcon} />
                <p>Dados do elenco não disponíveis</p>
            </div>
        );
    }

    const currentSquad = activeTeam === 'home' ? homeSquad : awaySquad;
    const currentTeamName = activeTeam === 'home' ? homeTeamName : awayTeamName;

    // Filter players by position
    const positionCategories = {
        all: 'Todos',
        goalkeeper: 'Goleiros',
        defender: 'Defensores',
        midfielder: 'Meias',
        attacker: 'Atacantes'
    };

    const filterByPosition = (players) => {
        if (!players || positionFilter === 'all') return players || [];

        const positionMap = {
            goalkeeper: ['Goalkeeper', 'Goleiro', 'GK'],
            defender: ['Defender', 'Defensor', 'Centre-Back', 'Left-Back', 'Right-Back', 'CB', 'LB', 'RB', 'Zagueiro', 'Lateral'],
            midfielder: ['Midfielder', 'Meio-Campo', 'Central Midfield', 'Defensive Midfield', 'Attacking Midfield', 'CM', 'DM', 'AM', 'Volante', 'Meia'],
            attacker: ['Attacker', 'Atacante', 'Forward', 'Striker', 'Winger', 'ST', 'LW', 'RW', 'CF', 'Ponta']
        };

        const matchPositions = positionMap[positionFilter] || [];
        return players.filter(p => {
            const pos = (p.position || '').toLowerCase();
            return matchPositions.some(mp => pos.includes(mp.toLowerCase()));
        });
    };

    const filteredPlayers = filterByPosition(currentSquad?.players);

    // Stats to display in table
    const statColumns = [
        { key: 'appearances', label: 'J', title: 'Jogos' },
        { key: 'goals', label: 'G', title: 'Gols' },
        { key: 'assists', label: 'A', title: 'Assistências' },
        { key: 'yellowCards', label: 'AM', title: 'Cartões Amarelos' },
        { key: 'redCards', label: 'VM', title: 'Cartões Vermelhos' },
        { key: 'minutes', label: 'Min', title: 'Minutos Jogados' }
    ];

    return (
        <div className={styles.container}>
            {/* Team Toggle with Logos */}
            <div className={styles.teamToggle}>
                <button
                    className={`${styles.toggleBtn} ${activeTeam === 'home' ? styles.active : ''}`}
                    onClick={() => setActiveTeam('home')}
                >
                    {homeTeamLogo && (
                        <img src={homeTeamLogo} alt={homeTeamName} className={styles.teamLogo} />
                    )}
                    <span>{homeTeamName}</span>
                </button>
                <button
                    className={`${styles.toggleBtn} ${activeTeam === 'away' ? styles.active : ''}`}
                    onClick={() => setActiveTeam('away')}
                >
                    {awayTeamLogo && (
                        <img src={awayTeamLogo} alt={awayTeamName} className={styles.teamLogo} />
                    )}
                    <span>{awayTeamName}</span>
                </button>
            </div>

            {/* Check if current team has data */}
            {(!currentSquad || !currentSquad.hasData || !currentSquad.players?.length) ? (
                <div className={styles.noDataCard}>
                    <FaUsers className={styles.noDataIcon} />
                    <p>Dados do elenco não disponíveis para {currentTeamName}</p>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className={styles.squadHeader}>
                        <h3 className={styles.squadTitle}>
                            <FaUsers className={styles.titleIcon} />
                            Elenco - {currentTeamName}
                        </h3>
                        <div className={styles.squadCount}>
                            {filteredPlayers.length} jogadores
                        </div>
                    </div>

                    {/* Position Filters */}
                    <div className={styles.positionFilters}>
                        {Object.entries(positionCategories).map(([key, label]) => (
                            <button
                                key={key}
                                className={`${styles.positionBtn} ${positionFilter === key ? styles.active : ''}`}
                                onClick={() => setPositionFilter(key)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Stats Table */}
                    <div className={styles.tableWrapper}>
                        <table className={styles.statsTable}>
                            <thead>
                                <tr>
                                    <th className={styles.playerCol}>Jogador</th>
                                    <th className={styles.posCol}>Pos</th>
                                    {statColumns.map(col => (
                                        <th key={col.key} title={col.title}>{col.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlayers.map((player) => (
                                    <tr key={player.id}>
                                        <td className={styles.playerCell}>
                                            <div className={styles.playerRow}>
                                                <img
                                                    src={player.photo || '/placeholder-player.png'}
                                                    alt={player.name}
                                                    className={styles.playerThumb}
                                                    onError={(e) => e.target.src = '/placeholder-player.png'}
                                                />
                                                <div className={styles.playerMeta}>
                                                    <span className={styles.playerName}>
                                                        {player.jerseyNumber && <span className={styles.jersey}>#{player.jerseyNumber}</span>}
                                                        {player.name}
                                                    </span>
                                                    {player.rating > 0 && (
                                                        <span className={styles.ratingTag} style={{
                                                            background: player.rating >= 7.5 ? '#00ff88' : player.rating >= 6 ? '#ffaa00' : '#ff3366'
                                                        }}>
                                                            <FaStar size={10} /> {player.rating.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.posCell}>
                                            <span className={styles.positionTag}>{player.position}</span>
                                        </td>
                                        {statColumns.map(col => (
                                            <td key={col.key} className={styles.statCell}>
                                                <span className={
                                                    col.key === 'goals' && player[col.key] > 0 ? styles.highlight :
                                                        col.key === 'assists' && player[col.key] > 0 ? styles.highlightAssist :
                                                            col.key === 'yellowCards' && player[col.key] > 0 ? styles.highlightYellow :
                                                                col.key === 'redCards' && player[col.key] > 0 ? styles.highlightRed :
                                                                    ''
                                                }>
                                                    {player[col.key] || 0}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
