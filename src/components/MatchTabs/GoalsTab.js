'use client';
import ProgressBar from '../shared/ProgressBar';
import StatCard from '../shared/StatCard';
import { FaFutbol, FaChartLine, FaBullseye } from 'react-icons/fa';
import styles from './GoalsTab.module.css';

export default function GoalsTab({ goalAnalysis, goalMarkets, homeTeam, awayTeam }) {
    if (!goalAnalysis) {
        return <div className={styles.emptyState}>Dados de gols não disponíveis</div>;
    }

    const { home, away } = goalAnalysis;

    // Helper to get color class based on percentage
    const getColorClass = (value) => {
        const num = parseInt(value || '0');
        if (num >= 70) return styles.high;
        if (num <= 30) return styles.low;
        return styles.medium;
    };

    return (
        <div className={styles.container}>
            {/* BTTS Comparison */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                    <FaFutbol className={styles.icon} />
                    Ambas Marcam (BTTS)
                </h3>
                <div className={styles.bttsContainer}>
                    <ProgressBar
                        homeValue={parseInt(home.btts || '0')}
                        awayValue={parseInt(away.btts || '0')}
                        homeLabel={homeTeam || 'Casa'}
                        awayLabel={awayTeam || 'Fora'}
                    />
                </div>
            </div>

            {/* Markets Table */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                    <FaChartLine className={styles.icon} />
                    Mercados de Gols
                </h3>
                <div className={styles.tableContainer}>
                    <table className={styles.marketsTable}>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Over 0.5</th>
                                <th>Over 1.5</th>
                                <th>Over 2.5</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.teamCell}>{homeTeam || 'Casa'}</td>
                                <td className={getColorClass(home.over05)}>{home.over05 || '0'}%</td>
                                <td className={getColorClass(home.over15)}>{home.over15 || '0'}%</td>
                                <td className={getColorClass(home.over25)}>{home.over25 || '0'}%</td>
                            </tr>
                            <tr>
                                <td className={styles.teamCell}>{awayTeam || 'Fora'}</td>
                                <td className={getColorClass(away.over05)}>{away.over05 || '0'}%</td>
                                <td className={getColorClass(away.over15)}>{away.over15 || '0'}%</td>
                                <td className={getColorClass(away.over25)}>{away.over25 || '0'}%</td>
                            </tr>
                            {goalMarkets && (
                                <tr className={styles.oddsRow}>
                                    <td className={styles.teamCell}>Odds</td>
                                    <td>{goalMarkets.over05?.toFixed(2) || '-'}</td>
                                    <td>{goalMarkets.over15?.toFixed(2) || '-'}</td>
                                    <td>{goalMarkets.over25?.toFixed(2) || '-'}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                    <FaBullseye className={styles.icon} />
                    Estatísticas
                </h3>
                <div className={styles.statsGrid}>
                    <StatCard
                        title="Primeiro a Marcar - Casa"
                        value={`${home.firstToScore || '0'}%`}
                        subtitle="Probabilidade histórica"
                        color={parseInt(home.firstToScore || '0') >= 70 ? 'success' : 'primary'}
                    />
                    <StatCard
                        title="Primeiro a Marcar - Fora"
                        value={`${away.firstToScore || '0'}%`}
                        subtitle="Probabilidade histórica"
                        color={parseInt(away.firstToScore || '0') >= 70 ? 'success' : 'secondary'}
                    />
                    <StatCard
                        title="Marcar e Vencer - Casa"
                        value={`${home.firstToScoreAndWin || '0'}%`}
                        subtitle="1º gol e vitória"
                        color="info"
                    />
                    <StatCard
                        title="Marcar e Vencer - Fora"
                        value={`${away.firstToScoreAndWin || '0'}%`}
                        subtitle="1º gol e vitória"
                        color="info"
                    />
                </div>
            </div>
        </div>
    );
}
