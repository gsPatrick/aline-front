'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './LeagueStandingsTable.module.css';

// Form badge component
const FormBadge = ({ result }) => {
    const className = result === 'W' ? styles.win : result === 'D' ? styles.draw : styles.loss;
    const label = result === 'W' ? 'V' : result === 'D' ? 'E' : 'D';
    return <span className={`${styles.formBadge} ${className}`}>{label}</span>;
};

export default function LeagueStandingsTable({ standings = [] }) {
    const [filter, setFilter] = useState('all'); // 'all' | 'home' | 'away'

    // Apply filter to standings
    const filteredStandings = useMemo(() => {
        if (!standings || standings.length === 0) return [];

        return standings.map(team => {
            if (filter === 'all') return team;

            // For home/away filter, use specific stats if available
            const stats = filter === 'home' ? team.home : team.away;
            if (!stats) return team;

            return {
                ...team,
                points: stats.points ?? team.points,
                won: stats.won ?? team.won,
                draw: stats.draw ?? team.draw,
                lost: stats.lost ?? team.lost,
                goals_for: stats.goals_for ?? team.goals_for,
                goals_against: stats.goals_against ?? team.goals_against,
            };
        }).sort((a, b) => (b.points || 0) - (a.points || 0));
    }, [standings, filter]);

    // Get position zone color
    const getZoneClass = (position) => {
        if (position <= 4) return styles.zoneChampions;
        if (position <= 5) return styles.zoneEuropa;
        if (position <= 6) return styles.zoneConference;
        if (position >= 18) return styles.zoneRelegation;
        return '';
    };

    if (!standings || standings.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.empty}>Classificação não disponível</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>TABELA CLASSIFICATIVA</h2>
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'home' ? styles.active : ''}`}
                        onClick={() => setFilter('home')}
                    >
                        Casa
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'away' ? styles.active : ''}`}
                        onClick={() => setFilter('away')}
                    >
                        Fora
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.thPos}>#</th>
                            <th className={styles.thTeam}>Time</th>
                            <th>P</th>
                            <th>J</th>
                            <th>V</th>
                            <th>E</th>
                            <th>D</th>
                            <th>GM-GS</th>
                            <th className={styles.thForm}>Forma</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStandings.map((team, index) => {
                            const position = index + 1;
                            const played = (team.won || 0) + (team.draw || 0) + (team.lost || 0);
                            const goalDiff = (team.goals_for || 0) - (team.goals_against || 0);
                            const form = team.form || team.recent_form || '';
                            const formArray = typeof form === 'string' ? form.split('').slice(-5) : [];

                            return (
                                <tr key={team.id || index} className={getZoneClass(position)}>
                                    <td className={styles.tdPos}>{position}</td>
                                    <td className={styles.tdTeam}>
                                        <Link href={`/team/${team.id}`} className={styles.teamLink}>
                                            {team.logo && (
                                                <img src={team.logo} alt="" className={styles.teamLogo} />
                                            )}
                                            <span>{team.name}</span>
                                        </Link>
                                    </td>
                                    <td className={styles.tdPoints}>{team.points || 0}</td>
                                    <td>{played}</td>
                                    <td className={styles.tdWin}>{team.won || 0}</td>
                                    <td>{team.draw || 0}</td>
                                    <td className={styles.tdLoss}>{team.lost || 0}</td>
                                    <td>
                                        <span className={goalDiff > 0 ? styles.positive : goalDiff < 0 ? styles.negative : ''}>
                                            {goalDiff > 0 ? '+' : ''}{goalDiff}
                                        </span>
                                    </td>
                                    <td className={styles.tdForm}>
                                        <div className={styles.formList}>
                                            {formArray.map((result, i) => (
                                                <FormBadge key={i} result={result} />
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.zoneChampions}`}></span>
                    <span>Champions League</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.zoneEuropa}`}></span>
                    <span>Europa League</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.zoneRelegation}`}></span>
                    <span>Rebaixamento</span>
                </div>
            </div>
        </div>
    );
}
