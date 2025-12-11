'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './TeamStatisticsTable.module.css';

// Percentage bar component
const StatBar = ({ percentage, value }) => {
    const getColor = (pct) => {
        if (pct >= 80) return '#10b981'; // green
        if (pct >= 60) return '#84cc16'; // lime
        if (pct >= 40) return '#f59e0b'; // yellow
        if (pct >= 20) return '#f97316'; // orange
        return '#ef4444'; // red
    };

    const color = getColor(percentage);

    return (
        <div className={styles.statCell}>
            <div className={styles.statBar}>
                <div
                    className={styles.statFill}
                    style={{ width: `${percentage}%`, background: color }}
                />
            </div>
            <span className={styles.statValue} style={{ color }}>{percentage}%</span>
            <span className={styles.statOdds}>{value}</span>
        </div>
    );
};

export default function TeamStatisticsTable({ teams = [], type = 'goals' }) {
    const [activeTab, setActiveTab] = useState('goals'); // 'corners' | 'goals'
    const [filter, setFilter] = useState('all'); // 'all' | 'home' | 'away'

    // Define columns based on type
    const columns = useMemo(() => {
        if (activeTab === 'goals') {
            return [
                { key: 'over05ht', label: 'Over 0.5HT' },
                { key: 'over05ft', label: 'Over 0.5FT' },
                { key: 'over15ft', label: 'Over 1.5FT' },
                { key: 'over25ft', label: 'Over 2.5FT' },
                { key: 'btts', label: 'BTTS' },
                { key: 'cleanSheet', label: 'Sem Sofrer' },
                { key: 'failedToScore', label: 'Sem Marcar' },
            ];
        } else {
            return [
                { key: 'over75corners', label: 'Over 7.5' },
                { key: 'over85corners', label: 'Over 8.5' },
                { key: 'over95corners', label: 'Over 9.5' },
                { key: 'over105corners', label: 'Over 10.5' },
                { key: 'avgCorners', label: 'Média' },
            ];
        }
    }, [activeTab]);

    if (!teams || teams.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.empty}>Estatísticas não disponíveis</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>ESTATÍSTICAS</h2>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'corners' ? styles.active : ''}`}
                        onClick={() => setActiveTab('corners')}
                    >
                        Cantos
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'goals' ? styles.active : ''}`}
                        onClick={() => setActiveTab('goals')}
                    >
                        Golos
                    </button>
                </div>

                <div className={styles.filters}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Tudo
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
                            {columns.map(col => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                            <th>Média a favor</th>
                            <th>Média contra</th>
                            <th>Média total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team, index) => {
                            // Get stats based on filter
                            const stats = filter === 'all'
                                ? team.stats
                                : filter === 'home'
                                    ? team.homeStats
                                    : team.awayStats;

                            const teamStats = stats || team.stats || {};

                            return (
                                <tr key={team.id || index}>
                                    <td className={styles.tdPos}>{index + 1}</td>
                                    <td className={styles.tdTeam}>
                                        <Link href={`/team/${team.id}`} className={styles.teamLink}>
                                            {team.logo && (
                                                <img src={team.logo} alt="" className={styles.teamLogo} />
                                            )}
                                            <span>{team.name}</span>
                                        </Link>
                                    </td>
                                    {columns.map(col => {
                                        const val = teamStats[col.key] || 0;
                                        const odds = teamStats[`${col.key}Odds`] || '-';
                                        return (
                                            <td key={col.key}>
                                                <StatBar percentage={val} value={odds} />
                                            </td>
                                        );
                                    })}
                                    <td className={styles.tdAvg}>{teamStats.avgFor || '-'}</td>
                                    <td className={styles.tdAvg}>{teamStats.avgAgainst || '-'}</td>
                                    <td className={styles.tdAvg}>{teamStats.avgTotal || '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
