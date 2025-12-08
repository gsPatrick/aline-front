'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HeatmapTable from '../shared/HeatmapTable';
import MarketsTable from '../shared/MarketsTable';
import { FaIdCard, FaUserTie } from 'react-icons/fa';
import styles from './CardsTab.module.css';

export default function CardsTab({ data, referee }) {
    if (!data) {
        return <div className={styles.emptyState}>Dados de cartões não disponíveis</div>;
    }

    const { intervals, markets, comparison } = data;

    // Prepare comparison data for chart
    const comparisonData = comparison ? [
        {
            period: '1º Tempo',
            home: comparison.firstHalf?.home || 0,
            away: comparison.firstHalf?.away || 0
        },
        {
            period: '2º Tempo',
            home: comparison.secondHalf?.home || 0,
            away: comparison.secondHalf?.away || 0
        }
    ] : [];

    return (
        <div className={styles.container}>
            {/* Referee Card */}
            {referee && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaUserTie className={styles.icon} />
                        Árbitro
                    </h3>
                    <div className={styles.refereeCard}>
                        {referee.photo && (
                            <img
                                src={referee.photo}
                                alt={referee.name}
                                className={styles.refereePhoto}
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                        <div className={styles.refereeInfo}>
                            <div className={styles.refereeName}>{referee.name || 'N/A'}</div>
                            <div className={styles.refereeStats}>
                                <div className={styles.refereeStat}>
                                    <span className={styles.statLabel}>Média de Cartões</span>
                                    <span className={styles.statValue}>
                                        {referee.avgCards?.toFixed(1) || 'N/A'}
                                    </span>
                                </div>
                                <div className={styles.refereeStat}>
                                    <span className={styles.statLabel}>Amarelos/Jogo</span>
                                    <span className={styles.statValue} style={{ color: '#ffd700' }}>
                                        {referee.avgYellow?.toFixed(1) || 'N/A'}
                                    </span>
                                </div>
                                <div className={styles.refereeStat}>
                                    <span className={styles.statLabel}>Vermelhos/Jogo</span>
                                    <span className={styles.statValue} style={{ color: '#ff3333' }}>
                                        {referee.avgRed?.toFixed(1) || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Chart */}
            {comparison && comparisonData.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaIdCard className={styles.icon} />
                        Comparação 1º vs 2º Tempo
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="period"
                                stroke="#a0a0a0"
                                tick={{ fill: '#a0a0a0' }}
                            />
                            <YAxis
                                stroke="#a0a0a0"
                                tick={{ fill: '#a0a0a0' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#2a2a2a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#e0e0e0'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="home" fill="#00ff88" name="Casa" />
                            <Bar dataKey="away" fill="#00d4ff" name="Fora" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Intervals Heatmap */}
            {intervals && (
                <div className={styles.section}>
                    <HeatmapTable
                        intervals={intervals}
                        title="Intervalos de Cartões"
                        type="cards"
                    />
                </div>
            )}

            {/* Markets */}
            {markets && (
                <div className={styles.section}>
                    <MarketsTable
                        markets={markets}
                        type="cards"
                    />
                </div>
            )}
        </div>
    );
}
