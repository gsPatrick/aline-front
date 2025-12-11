'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaChartBar } from 'react-icons/fa';
import styles from './PreviousGames.module.css';

/**
 * PreviousGames Component
 * Shows match history for both teams with filtering options
 * 
 * Props:
 * - homeTeam: { name, logo, id }
 * - awayTeam: { name, logo, id }
 * - homeGames: Array of games from home team's history
 * - awayGames: Array of games from away team's history
 */
export default function PreviousGames({
    homeTeam = { name: 'Time Casa' },
    awayTeam = { name: 'Time Fora' },
    homeGames = [],
    awayGames = [],
    // Legacy props for backwards compatibility
    teamName,
    games = []
}) {
    // Team selector: 'home' or 'away'
    const [selectedTeam, setSelectedTeam] = useState('home');
    // Location filter: 'all', 'home', 'away'
    const [locationFilter, setLocationFilter] = useState('all');

    // Use legacy props if new ones aren't provided
    const homeTeamData = homeTeam || { name: teamName || 'Time Casa' };
    const awayTeamData = awayTeam || { name: 'Time Fora' };
    const homeTeamGames = homeGames.length > 0 ? homeGames : games;
    const awayTeamGames = awayGames;

    // Get current team info based on selection
    const currentTeam = selectedTeam === 'home' ? homeTeamData : awayTeamData;
    const currentGames = selectedTeam === 'home' ? homeTeamGames : awayTeamGames;

    // Transform backend data to display format
    const transformGames = (rawGames, teamData) => {
        if (!rawGames || rawGames.length === 0) return [];

        return rawGames.map(g => {
            // Handle different data formats
            const participants = g.participants || [];
            const homeParticipant = participants.find(p => p.meta?.location === 'home');
            const awayParticipant = participants.find(p => p.meta?.location === 'away');

            // Extract scores
            let hScore = 0, aScore = 0;
            if (g.scores && g.scores.length > 0) {
                for (const s of g.scores) {
                    if (s.description === 'CURRENT' || s.type_id === 1525) {
                        if (s.score?.participant === 'home') hScore = s.score.goals || 0;
                        if (s.score?.participant === 'away') aScore = s.score.goals || 0;
                    }
                }
            } else if (g.score) {
                // Legacy format: "2-1"
                const parts = String(g.score).split('-');
                hScore = parseInt(parts[0]) || 0;
                aScore = parseInt(parts[1]) || 0;
            }

            // Determine if the SELECTED team was home or away in this match
            // Check by ID first, then by name
            const teamId = teamData?.id;
            const teamName = teamData?.name?.toLowerCase() || '';

            // Check if selected team was the HOME team in this match
            const homeId = homeParticipant?.id;
            const homeName = (homeParticipant?.name || g.home_team || '').toLowerCase();
            const awayId = awayParticipant?.id;
            const awayName = (awayParticipant?.name || g.away_team || '').toLowerCase();

            // Match by ID if available, otherwise by name
            let isTeamHome = false;
            if (teamId && homeId) {
                isTeamHome = homeId === teamId;
            } else if (teamName) {
                // Fuzzy match by name (contains check)
                isTeamHome = homeName.includes(teamName) || teamName.includes(homeName);
            }

            // Determine result (V/E/D) from perspective of selected team
            let result = 'E';
            const homeWon = homeParticipant?.meta?.winner || hScore > aScore;
            const awayWon = awayParticipant?.meta?.winner || aScore > hScore;

            if (homeWon) {
                result = isTeamHome ? 'V' : 'D';
            } else if (awayWon) {
                result = isTeamHome ? 'D' : 'V';
            } else {
                result = 'E';
            }

            // Extract stats from statistics array
            let homeCorners = 0, awayCorners = 0;
            let homeYellow = 0, awayYellow = 0;
            let homeRed = 0, awayRed = 0;

            if (g.statistics && Array.isArray(g.statistics)) {
                for (const stat of g.statistics) {
                    const name = (stat.type?.name || '').toLowerCase();
                    const value = stat.data?.value || 0;
                    const isHome = stat.participant_id === homeParticipant?.id;

                    if (name.includes('corner')) {
                        if (isHome) homeCorners = value; else awayCorners = value;
                    } else if (name.includes('yellow')) {
                        if (isHome) homeYellow = value; else awayYellow = value;
                    } else if (name.includes('red')) {
                        if (isHome) homeRed = value; else awayRed = value;
                    }
                }
            }

            return {
                id: g.id,
                date: formatDate(g.starting_at || g.date),
                league: g.league?.short_code || g.league?.name?.substring(0, 3) || 'LIG',
                leagueLogo: g.league?.image_path,
                home: {
                    name: homeParticipant?.name || g.home_team || 'Home',
                    logo: homeParticipant?.image_path || g.home_logo,
                    rank: '-',
                    score: hScore
                },
                away: {
                    name: awayParticipant?.name || g.away_team || 'Away',
                    logo: awayParticipant?.image_path || g.away_logo,
                    rank: '-',
                    score: aScore
                },
                result: result,
                isTeamHome: isTeamHome,
                corners: { home: homeCorners, away: awayCorners },
                cards: { home: homeYellow, away: awayYellow },
                redCards: { home: homeRed, away: awayRed }
            };
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    // Transform games for display
    const transformedGames = transformGames(currentGames, currentTeam);

    // Apply location filter
    const filteredGames = transformedGames.filter(game => {
        if (locationFilter === 'all') return true;
        if (locationFilter === 'home') return game.isTeamHome === true;
        if (locationFilter === 'away') return game.isTeamHome === false;
        return true;
    }).slice(0, 10);

    const getResultClass = (res) => {
        if (res === 'V') return styles.win;
        if (res === 'D') return styles.loss;
        return styles.draw;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Jogos Anteriores</h3>
            </div>

            {/* Team Selector */}
            <div className={styles.teamSelector}>
                <button
                    className={`${styles.teamTab} ${selectedTeam === 'home' ? styles.activeTeam : ''}`}
                    onClick={() => setSelectedTeam('home')}
                >
                    {homeTeamData.logo && (
                        <img src={homeTeamData.logo} alt="" className={styles.tabLogo} onError={(e) => e.target.style.display = 'none'} />
                    )}
                    <span>{homeTeamData.name}</span>
                </button>
                <button
                    className={`${styles.teamTab} ${selectedTeam === 'away' ? styles.activeTeam : ''}`}
                    onClick={() => setSelectedTeam('away')}
                >
                    {awayTeamData.logo && (
                        <img src={awayTeamData.logo} alt="" className={styles.tabLogo} onError={(e) => e.target.style.display = 'none'} />
                    )}
                    <span>{awayTeamData.name}</span>
                </button>
            </div>

            {/* Location Filter */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${locationFilter === 'all' ? styles.active : ''}`}
                    onClick={() => setLocationFilter('all')}
                >
                    Tudo
                </button>
                <button
                    className={`${styles.tab} ${locationFilter === 'home' ? styles.active : ''}`}
                    onClick={() => setLocationFilter('home')}
                >
                    Casa
                </button>
                <button
                    className={`${styles.tab} ${locationFilter === 'away' ? styles.active : ''}`}
                    onClick={() => setLocationFilter('away')}
                >
                    Fora
                </button>
            </div>

            <div className={styles.sectionTitle}>
                {currentTeam.name} - {locationFilter === 'all' ? 'Todos os Jogos' : locationFilter === 'home' ? 'Jogos em Casa' : 'Jogos Fora'}
            </div>

            <div className={styles.gamesList}>
                {/* Header das Colunas */}
                <div className={styles.colHeader}>
                    <div></div>
                    <div style={{ textAlign: 'center' }}>⚽</div>
                    <div style={{ textAlign: 'center' }}>🚩</div>
                    <div style={{ textAlign: 'center' }}>🟨</div>
                    <div style={{ textAlign: 'center' }}>🟥</div>
                    <div></div>
                </div>

                {filteredGames.length === 0 ? (
                    <div className={styles.emptyState}>
                        Nenhum jogo encontrado
                    </div>
                ) : (
                    filteredGames.map((game) => (
                        <Link href={`/match/${game.id}`} key={game.id} className={styles.gameRow} style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>

                            {/* Data e Liga */}
                            <div className={styles.dateCol}>
                                <span className={styles.date}>{game.date}</span>
                                {game.leagueLogo ? (
                                    <img src={game.leagueLogo} alt="" className={styles.leagueLogoSmall} onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <span className={styles.leagueBadge}>{game.league}</span>
                                )}
                            </div>

                            {/* Times */}
                            <div className={styles.matchCol}>
                                <div className={styles.teamLine}>
                                    <img src={game.home.logo} alt="" style={{ width: 16, height: 16, marginRight: 6, objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                                    <span className={styles.teamName}>{game.home.name}</span>
                                </div>
                                <div className={styles.teamLine}>
                                    <img src={game.away.logo} alt="" style={{ width: 16, height: 16, marginRight: 6, objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                                    <span className={styles.teamName}>{game.away.name}</span>
                                </div>
                            </div>

                            {/* Resultado Badge (V/E/D) */}
                            <div className={styles.resultCol}>
                                <div className={`${styles.resultBadge} ${getResultClass(game.result)}`}>{game.result}</div>
                            </div>

                            {/* Placar */}
                            <div className={styles.statsCol}>
                                <div>{game.home.score}</div>
                                <div>{game.away.score}</div>
                            </div>

                            {/* Cantos */}
                            <div className={styles.statsCol}>
                                <div>{game.corners.home || 0}</div>
                                <div>{game.corners.away || 0}</div>
                            </div>

                            {/* Cartões Amarelos */}
                            <div className={styles.statsCol}>
                                <div>{game.cards.home || 0}</div>
                                <div>{game.cards.away || 0}</div>
                            </div>

                            {/* Cartões Vermelhos */}
                            <div className={styles.statsCol}>
                                <div>{game.redCards.home || 0}</div>
                                <div>{game.redCards.away || 0}</div>
                            </div>

                            {/* Ícone Gráfico */}
                            <div className={styles.chartCol}>
                                <FaChartBar />
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {filteredGames.length > 0 && (
                <button className={styles.showMoreBtn}>Mostrar Mais Jogos</button>
            )}
        </div>
    );
}