'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import styles from './LeagueGeneralStats.module.css';

export default function LeagueGeneralStats({ stats = {}, teams = [] }) {
    // Calculate stats from teams data
    const calculatedStats = useMemo(() => {
        if (!teams || teams.length === 0) return null;

        // Create copies to avoid mutating original array
        const teamsCopy = [...teams];

        // Best Attack (most goals scored)
        const bestAttack = teamsCopy.sort((a, b) => (b.goals_for || 0) - (a.goals_for || 0))[0];

        // Best Defense (least goals conceded)
        const bestDefense = [...teams].sort((a, b) => (a.goals_against || 0) - (b.goals_against || 0))[0];

        // Most Wins
        const mostWins = [...teams].sort((a, b) => (b.won || 0) - (a.won || 0))[0];

        // Most Draws
        const mostDraws = [...teams].sort((a, b) => (b.draw || 0) - (a.draw || 0))[0];

        // Most Losses
        const mostLosses = [...teams].sort((a, b) => (b.lost || 0) - (a.lost || 0))[0];

        // Calculate league-wide stats
        const totalGames = teams.reduce((sum, t) => sum + ((t.won || 0) + (t.draw || 0) + (t.lost || 0)), 0) / 2;
        const totalGoals = teams.reduce((sum, t) => sum + (t.goals_for || 0), 0);
        const avgGoals = totalGames > 0 ? (totalGoals / totalGames).toFixed(2) : '-';

        return {
            bestAttack,
            bestDefense,
            mostWins,
            mostDraws,
            mostLosses,
            avgGoals,
            totalGames: Math.round(totalGames),
            totalGoals
        };
    }, [teams]);

    if (!calculatedStats) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>DADOS GERAIS LIGA</h2>
                <div className={styles.empty}>Dados não disponíveis</div>
            </div>
        );
    }

    const { bestAttack, bestDefense, mostWins, mostDraws, mostLosses, avgGoals, totalGoals } = calculatedStats;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>DADOS GERAIS LIGA</h2>

            <div className={styles.grid}>
                {/* Best Teams Section */}
                <div className={styles.section}>
                    {bestAttack && (
                        <div className={styles.statRow}>
                            <span className={styles.label}>Melhor Ataque</span>
                            <Link href={`/team/${bestAttack.id}`} className={styles.teamLink}>
                                {bestAttack.logo && <img src={bestAttack.logo} alt="" className={styles.teamLogo} />}
                                <span>{bestAttack.name}</span>
                            </Link>
                            <span className={styles.value}>{bestAttack.goals_for || 0} Golos</span>
                        </div>
                    )}

                    {bestDefense && (
                        <div className={styles.statRow}>
                            <span className={styles.label}>Melhor Defesa</span>
                            <Link href={`/team/${bestDefense.id}`} className={styles.teamLink}>
                                {bestDefense.logo && <img src={bestDefense.logo} alt="" className={styles.teamLogo} />}
                                <span>{bestDefense.name}</span>
                            </Link>
                            <span className={styles.value}>{bestDefense.goals_against || 0} Golos</span>
                        </div>
                    )}

                    {mostWins && (
                        <div className={styles.statRow}>
                            <span className={styles.label}>Mais Vitórias</span>
                            <Link href={`/team/${mostWins.id}`} className={styles.teamLink}>
                                {mostWins.logo && <img src={mostWins.logo} alt="" className={styles.teamLogo} />}
                                <span>{mostWins.name}</span>
                            </Link>
                            <span className={styles.value}>{mostWins.won || 0} Vitórias</span>
                        </div>
                    )}

                    {mostDraws && (
                        <div className={styles.statRow}>
                            <span className={styles.label}>Mais Empates</span>
                            <Link href={`/team/${mostDraws.id}`} className={styles.teamLink}>
                                {mostDraws.logo && <img src={mostDraws.logo} alt="" className={styles.teamLogo} />}
                                <span>{mostDraws.name}</span>
                            </Link>
                            <span className={styles.value}>{mostDraws.draw || 0} Empates</span>
                        </div>
                    )}

                    {mostLosses && (
                        <div className={styles.statRow}>
                            <span className={styles.label}>Mais Derrotas</span>
                            <Link href={`/team/${mostLosses.id}`} className={styles.teamLink}>
                                {mostLosses.logo && <img src={mostLosses.logo} alt="" className={styles.teamLogo} />}
                                <span>{mostLosses.name}</span>
                            </Link>
                            <span className={styles.value}>{mostLosses.lost || 0} Derrotas</span>
                        </div>
                    )}
                </div>

                {/* League Stats Section */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>ESTATÍSTICAS GERAIS LIGA</h3>
                    <div className={styles.statsGrid}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Média Golos</span>
                            <span className={styles.statPercent}>{avgGoals}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Total Golos</span>
                            <span className={styles.statPercent}>{totalGoals}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Over 2.5FT</span>
                            <span className={styles.statPercent}>{stats.over25ft || '-'}%</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>BTTS</span>
                            <span className={styles.statPercent}>{stats.btts || '-'}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
