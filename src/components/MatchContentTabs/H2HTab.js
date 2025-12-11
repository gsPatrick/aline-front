'use client';
import { useState } from 'react';
import styles from './H2HTab.module.css';

export default function H2HTab({ match }) {
    const [activeTab, setActiveTab] = useState('home'); // 'home' | 'away' | 'h2h'

    const homeTeam = match?.homeTeam;
    const awayTeam = match?.awayTeam;
    const h2h = match?.h2h;

    // Get match history based on active tab
    const getMatches = () => {
        switch (activeTab) {
            case 'home':
                return homeTeam?.detailedHistory || [];
            case 'away':
                return awayTeam?.detailedHistory || [];
            case 'h2h':
                return h2h?.matches || [];
            default:
                return [];
        }
    };

    const matches = getMatches().slice(0, 10);
    const focusedTeamId = activeTab === 'home' ? homeTeam?.id : (activeTab === 'away' ? awayTeam?.id : homeTeam?.id);

    // Extract score from various score formats
    const extractScores = (fixture) => {
        const scores = fixture.scores || [];
        let homeScore = null;
        let awayScore = null;

        // Try CURRENT or FULLTIME first
        for (const s of scores) {
            if (s.description === 'CURRENT' || s.description === 'FULLTIME' || s.type_id === 1525) {
                if (s.score?.participant === 'home') {
                    homeScore = s.score.goals;
                } else if (s.score?.participant === 'away') {
                    awayScore = s.score.goals;
                }
            }
        }

        // If still null, try alternative format
        if (homeScore === null || awayScore === null) {
            const participants = fixture.participants || [];
            const home = participants.find(p => p.meta?.location === 'home');
            const away = participants.find(p => p.meta?.location === 'away');
            if (home?.meta?.score !== undefined) homeScore = home.meta.score;
            if (away?.meta?.score !== undefined) awayScore = away.meta.score;
        }

        return { homeScore, awayScore };
    };

    // Determine result for a given team
    const getResult = (fixture, teamId) => {
        const { homeScore, awayScore } = extractScores(fixture);
        const participants = fixture.participants || [];

        // Check if team was winner via meta
        const team = participants.find(p => p.id === teamId);
        if (team?.meta?.winner !== undefined) {
            if (team.meta.winner) return 'W';
            const opponent = participants.find(p => p.id !== teamId);
            if (opponent?.meta?.winner) return 'L';
            return 'D';
        }

        // Fallback to score comparison
        if (homeScore !== null && awayScore !== null) {
            const isHome = participants.find(p => p.id === teamId && p.meta?.location === 'home');
            const teamScore = isHome ? homeScore : awayScore;
            const oppScore = isHome ? awayScore : homeScore;

            if (teamScore > oppScore) return 'W';
            if (teamScore < oppScore) return 'L';
            return 'D';
        }

        return '?';
    };

    const getResultClass = (result) => {
        if (result === 'W') return styles.win;
        if (result === 'L') return styles.loss;
        if (result === 'D') return styles.draw;
        return '';
    };

    const getResultLabel = (result) => {
        if (result === 'W') return 'V';
        if (result === 'L') return 'D';
        if (result === 'D') return 'E';
        return '?';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    const getScore = (fixture) => {
        const { homeScore, awayScore } = extractScores(fixture);
        if (homeScore !== null && awayScore !== null) {
            return `${homeScore} - ${awayScore}`;
        }
        return '? - ?';
    };

    const getTeamLogos = (fixture) => {
        const participants = fixture.participants || [];
        const home = participants.find(p => p.meta?.location === 'home');
        const away = participants.find(p => p.meta?.location === 'away');
        return { home, away };
    };

    // Extract statistics for a specific team
    const getTeamStats = (fixture, teamId) => {
        const statistics = fixture.statistics || [];

        const findStat = (keywords) => {
            for (const stat of statistics) {
                if (stat.participant_id !== teamId) continue;
                const name = (stat.type?.name || stat.type?.developer_name || '').toLowerCase();
                if (keywords.some(k => name.includes(k))) {
                    return stat.data?.value || 0;
                }
            }
            return 0;
        };

        return {
            yellowCards: findStat(['yellow', 'yellowcards']),
            redCards: findStat(['red', 'redcards']),
            corners: findStat(['corner']),
            penalties: 0 // Usually not in standard stats
        };
    };

    // Calculate H2H summary
    const calculateH2HSummary = () => {
        if (!h2h?.matches?.length) return { homeWins: 0, draws: 0, awayWins: 0 };

        let homeWins = 0, draws = 0, awayWins = 0;
        h2h.matches.forEach(match => {
            const result = getResult(match, homeTeam?.id);
            if (result === 'W') homeWins++;
            else if (result === 'L') awayWins++;
            else if (result === 'D') draws++;
        });
        return { homeWins, draws, awayWins };
    };

    const h2hSummary = calculateH2HSummary();

    return (
        <div className={styles.container}>
            {/* Team Tabs */}
            <div className={styles.tabSelector}>
                <button
                    className={`${styles.teamTab} ${activeTab === 'home' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('home')}
                >
                    {homeTeam?.name || 'Time Casa'}
                </button>
                <button
                    className={`${styles.teamTab} ${activeTab === 'away' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('away')}
                >
                    {awayTeam?.name || 'Time Fora'}
                </button>
                <button
                    className={`${styles.teamTab} ${activeTab === 'h2h' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('h2h')}
                >
                    H2H
                </button>
            </div>

            {/* Section Title */}
            <div className={styles.sectionTitle}>
                {activeTab === 'h2h'
                    ? 'CONFRONTOS DIRETOS'
                    : `ÚLTIMAS PARTIDAS: ${activeTab === 'home' ? homeTeam?.name?.toUpperCase() : awayTeam?.name?.toUpperCase()}`
                }
            </div>

            {/* H2H Summary (only for H2H tab) */}
            {activeTab === 'h2h' && (
                <div className={styles.summaryHeader}>
                    <div className={styles.teamSummary}>
                        <img src={homeTeam?.logo || homeTeam?.image_path} alt="" className={styles.teamLogoSummary} />
                        <span className={styles.teamNameSummary}>{homeTeam?.name}</span>
                    </div>
                    <div className={styles.h2hStats}>
                        <span className={styles.statBox}>
                            <span className={styles.statValue}>{h2hSummary.homeWins}</span>
                            <span className={styles.statLabel}>VITÓRIAS</span>
                        </span>
                        <span className={styles.statBox}>
                            <span className={styles.statValue}>{h2hSummary.draws}</span>
                            <span className={styles.statLabel}>EMPATES</span>
                        </span>
                        <span className={styles.statBox}>
                            <span className={styles.statValue}>{h2hSummary.awayWins}</span>
                            <span className={styles.statLabel}>VITÓRIAS</span>
                        </span>
                    </div>
                    <div className={styles.teamSummary}>
                        <img src={awayTeam?.logo || awayTeam?.image_path} alt="" className={styles.teamLogoSummary} />
                        <span className={styles.teamNameSummary}>{awayTeam?.name}</span>
                    </div>
                </div>
            )}

            {/* Match History Table */}
            {matches.length === 0 ? (
                <p className={styles.empty}>Sem histórico disponível</p>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Liga</th>
                                <th>P</th>
                                <th className={styles.redCardHeader}>🟥</th>
                                <th className={styles.yellowCardHeader}>🟨</th>
                                <th>🏠</th>
                                <th>Placar</th>
                                <th>🏃</th>
                                <th className={styles.yellowCardHeader}>🟨</th>
                                <th className={styles.redCardHeader}>🟥</th>
                                <th>P</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.map((fixture, idx) => {
                                const { home, away } = getTeamLogos(fixture);
                                const result = getResult(fixture, focusedTeamId);
                                const homeStats = getTeamStats(fixture, home?.id);
                                const awayStats = getTeamStats(fixture, away?.id);

                                return (
                                    <tr key={fixture.id || idx}>
                                        {/* Result Badge */}
                                        <td className={styles.resultCell}>
                                            <span className={`${styles.resultBadge} ${getResultClass(result)}`}>
                                                {getResultLabel(result)}
                                            </span>
                                        </td>

                                        {/* League Logo */}
                                        <td className={styles.leagueCell}>
                                            <img
                                                src={fixture.league?.image_path}
                                                alt=""
                                                className={styles.leagueLogo}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </td>

                                        {/* Home Team Stats */}
                                        <td className={styles.statCell}>{homeStats.penalties}</td>
                                        <td className={styles.statCell}>{homeStats.redCards}</td>
                                        <td className={styles.statCellYellow}>{homeStats.yellowCards}</td>

                                        {/* Home Team Logo */}
                                        <td className={styles.teamCell}>
                                            <img
                                                src={home?.image_path}
                                                alt={home?.name}
                                                className={styles.teamLogo}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </td>

                                        {/* Score */}
                                        <td className={styles.scoreCell}>
                                            <div className={styles.scoreWrapper}>
                                                <span className={styles.score}>{getScore(fixture)}</span>
                                                <span className={styles.dateSmall}>{formatDate(fixture.starting_at)}</span>
                                            </div>
                                        </td>

                                        {/* Away Team Logo */}
                                        <td className={styles.teamCell}>
                                            <img
                                                src={away?.image_path}
                                                alt={away?.name}
                                                className={styles.teamLogo}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </td>

                                        {/* Away Team Stats */}
                                        <td className={styles.statCellYellow}>{awayStats.yellowCards}</td>
                                        <td className={styles.statCell}>{awayStats.redCards}</td>
                                        <td className={styles.statCell}>{awayStats.penalties}</td>

                                        {/* Date */}
                                        <td className={styles.dateCell}>
                                            {formatDate(fixture.starting_at)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
