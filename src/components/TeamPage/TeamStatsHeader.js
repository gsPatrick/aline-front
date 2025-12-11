'use client';
import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import RadarChart from './RadarChart';
import styles from './TeamStatsHeader.module.css';

export default function TeamStatsHeader({ team, stats, recentMatches }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [filter, setFilter] = useState('last10'); // 'last10' | 'all'

    if (!team) return null;

    // Use form directly from stats if available, otherwise calculate
    const formFromStats = stats?.form || [];

    // Use latest_matches from stats as fallback
    const matches = recentMatches?.length > 0 ? recentMatches : (stats?.latest_matches || []);

    // Calculate form from recent matches (fallback)
    const getFormBadges = () => {
        // If we have form from stats, use it
        if (formFromStats.length > 0) {
            return formFromStats.slice(0, 5).map((result, i) => ({
                result,
                opponent: matches[i] ? {
                    logo: matches[i].away_team?.logo || matches[i].opponentLogo
                } : null,
                matchId: matches[i]?.id
            }));
        }

        // Fallback: calculate from matches
        if (!matches || matches.length === 0) return [];

        return matches.slice(0, 5).map(match => {
            const isHome = match.home_team?.id === team.id;
            const homeScore = match.home_team?.score ?? 0;
            const awayScore = match.away_team?.score ?? 0;

            let result = 'E'; // Draw
            if (homeScore > awayScore) result = isHome ? 'V' : 'D';
            else if (homeScore < awayScore) result = isHome ? 'D' : 'V';

            return {
                result,
                opponent: isHome ? match.away_team : match.home_team,
                matchId: match.id
            };
        });
    };

    // Calculate W-D-L counts
    const getWDLCounts = () => {
        const form = formFromStats.length > 0 ? formFromStats : getFormBadges().map(f => f.result);
        return {
            wins: form.filter(f => f === 'V').length,
            draws: form.filter(f => f === 'E').length,
            losses: form.filter(f => f === 'D').length
        };
    };

    // Calculate goals stats - use statsGrid if available
    const getGoalsStats = () => {
        // Use stats from backend if available
        if (stats?.statsGrid) {
            const scored = stats.statsGrid.avgGoalsScored || 0;
            const conceded = stats.statsGrid.avgGoalsConceded || 0;
            return {
                scored: Math.round(scored * 10),  // Total in last 10 matches
                conceded: Math.round(conceded * 10),
                average: (scored + conceded).toFixed(2)
            };
        }

        // Fallback: calculate from matches
        if (!matches || matches.length === 0) {
            return { scored: 0, conceded: 0, average: 0 };
        }

        let scored = 0;
        let conceded = 0;

        matches.slice(0, 10).forEach(match => {
            const isHome = match.home_team?.id === team.id;
            const homeScore = match.home_team?.score ?? 0;
            const awayScore = match.away_team?.score ?? 0;

            if (isHome) {
                scored += homeScore;
                conceded += awayScore;
            } else {
                scored += awayScore;
                conceded += homeScore;
            }
        });

        const numMatches = Math.min(matches.length, 10);
        return {
            scored,
            conceded,
            average: numMatches > 0 ? ((scored + conceded) / numMatches).toFixed(2) : 0
        };
    };

    const formBadges = getFormBadges();
    const wdl = getWDLCounts();
    const goalsStats = getGoalsStats();

    return (
        <div className={styles.header}>
            {/* Left Section: Team Info */}
            <div className={styles.teamSection}>
                <div className={styles.teamInfo}>
                    <div className={styles.logoWrapper}>
                        {team.image_path ? (
                            <img src={team.image_path} alt={team.name} className={styles.logo} />
                        ) : (
                            <div className={styles.logoPlaceholder}>{team.name?.charAt(0)}</div>
                        )}
                    </div>
                    <div className={styles.nameSection}>
                        <div className={styles.nameRow}>
                            <h1 className={styles.teamName}>{team.name}</h1>
                            <button
                                className={styles.favoriteBtn}
                                onClick={() => setIsFavorite(!isFavorite)}
                            >
                                {isFavorite ? <FaStar /> : <FaRegStar />}
                            </button>
                        </div>
                        <span className={styles.country}>{team.country?.name || 'Brazil'}</span>
                    </div>
                </div>

                {/* Recent Form */}
                <div className={styles.formSection}>
                    <div className={styles.formBadges}>
                        {formBadges.map((item, i) => (
                            <div key={i} className={styles.formItem}>
                                <div className={styles.opponentLogo}>
                                    {item.opponent?.logo ? (
                                        <img src={item.opponent.logo} alt="" />
                                    ) : (
                                        <div className={styles.opponentPlaceholder} />
                                    )}
                                </div>
                                <span className={`${styles.resultBadge} ${styles[`result${item.result}`]}`}>
                                    {item.result}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Section: Stats Summary */}
            <div className={styles.statsSection}>
                {/* Filter Toggle */}
                <div className={styles.filterRow}>
                    <label className={styles.filterOption}>
                        <input
                            type="radio"
                            name="filter"
                            checked={filter === 'last10'}
                            onChange={() => setFilter('last10')}
                        />
                        <span>Últimos 10 jogos</span>
                    </label>
                    <label className={styles.filterOption}>
                        <input
                            type="radio"
                            name="filter"
                            checked={filter === 'all'}
                            onChange={() => setFilter('all')}
                        />
                        <span>Todos os jogos</span>
                    </label>

                    <div className={styles.avgGoals}>
                        <span className={styles.avgLabel}>Média Golos</span>
                        <span className={styles.avgValue}>{goalsStats.average}</span>
                    </div>
                </div>

                {/* W-D-L Summary */}
                <div className={styles.wdlRow}>
                    <div className={styles.wdlBadges}>
                        <span className={`${styles.wdlBadge} ${styles.wdlWin}`}>V {wdl.wins}</span>
                        <span className={`${styles.wdlBadge} ${styles.wdlDraw}`}>E {wdl.draws}</span>
                        <span className={`${styles.wdlBadge} ${styles.wdlLoss}`}>D {wdl.losses}</span>
                    </div>

                    <div className={styles.goalsIcons}>
                        <span className={styles.goalItem}>
                            <span className={styles.goalIcon}>⚽</span> {goalsStats.scored}
                        </span>
                        <span className={styles.goalItem}>
                            <span className={styles.goalIconRed}>⚽</span> {goalsStats.conceded}
                        </span>
                        <span className={styles.goalItem}>
                            <span className={styles.goalIconYellow}>⚽</span> {goalsStats.scored + goalsStats.conceded}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Section: Radar Chart */}
            <div className={styles.radarSection}>
                <RadarChart
                    data={stats?.radar_data || {}}
                    size={180}
                />
            </div>
        </div>
    );
}
