'use client';
import { useState } from 'react';
import { FaFutbol, FaChartLine, FaClock, FaTrophy } from 'react-icons/fa';
import StatCard from '@/components/shared/StatCard';
import MarketsTable from '@/components/shared/MarketsTable';
import HeatmapTable from '@/components/shared/HeatmapTable';
import styles from './GoalsAnalysis.module.css';

export default function GoalsAnalysis({ data, filterCondition = 'ALL' }) {
    const [activeTeam, setActiveTeam] = useState('home');

    if (!data) {
        return (
            <div className={styles.emptyState}>
                <FaFutbol className={styles.emptyIcon} />
                <p>Análise de gols não disponível</p>
            </div>
        );
    }

    const { home, away } = data;
    const currentData = filterCondition === 'HOME' ? home : filterCondition === 'AWAY' ? away : null;

    // If ALL, show both teams side by side
    if (filterCondition === 'ALL') {
        return (
            <div className={styles.container}>
                <div className={styles.teamToggle}>
                    <button
                        className={`${styles.toggleBtn} ${activeTeam === 'home' ? styles.active : ''}`}
                        onClick={() => setActiveTeam('home')}
                    >
                        Casa
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${activeTeam === 'away' ? styles.active : ''}`}
                        onClick={() => setActiveTeam('away')}
                    >
                        Fora
                    </button>
                </div>

                <TeamGoalsAnalysis data={activeTeam === 'home' ? home : away} />
            </div>
        );
    }

    // Single team view
    return (
        <div className={styles.container}>
            <TeamGoalsAnalysis data={currentData} />
        </div>
    );
}

function TeamGoalsAnalysis({ data }) {
    if (!data) return null;

    return (
        <>
            {/* Stats Cards Grid */}
            <div className={styles.statsGrid}>
                <StatCard
                    title="BTTS"
                    value={`${data.btts}%`}
                    subtitle="Both Teams To Score"
                    icon={FaFutbol}
                    color={parseFloat(data.btts) >= 50 ? 'success' : 'warning'}
                />
                <StatCard
                    title="Primeiro a Marcar"
                    value={`${data.firstToScore}%`}
                    subtitle="Abre o placar"
                    icon={FaTrophy}
                    color="primary"
                />
                <StatCard
                    title="Marca e Vence"
                    value={`${data.firstToScoreAndWin}%`}
                    subtitle="Após marcar primeiro"
                    icon={FaChartLine}
                    color="success"
                />
                <StatCard
                    title="Over 1.5"
                    value={`${data.over15}%`}
                    subtitle="Mais de 1.5 gols"
                    icon={FaClock}
                    color={parseFloat(data.over15) >= 70 ? 'success' : 'warning'}
                />
            </div>

            {/* Markets Table */}
            <div className={styles.section}>
                <MarketsTable
                    markets={{
                        'Over 0.5': data.over05,
                        'Over 1.5': data.over15,
                        'Over 2.5': data.over25,
                        'Over 3.5': data.over35 || '0'
                    }}
                    title="Mercados de Gols"
                />
            </div>

            {/* Intervals Heatmap */}
            {data.intervals && (
                <div className={styles.section}>
                    <HeatmapTable
                        intervals={data.intervals}
                        title="Distribuição de Gols por Intervalo"
                        type="goals"
                    />
                </div>
            )}

            {/* First to Score Analysis */}
            <div className={styles.section}>
                <div className={styles.firstToScoreCard}>
                    <h4 className={styles.sectionTitle}>
                        <FaTrophy className={styles.titleIcon} />
                        Análise: Primeiro a Marcar
                    </h4>
                    <div className={styles.firstToScoreGrid}>
                        <div className={styles.ftScoreItem}>
                            <div className={styles.ftScoreLabel}>Probabilidade de abrir o placar</div>
                            <div className={styles.ftScoreValue}>{data.firstToScore}%</div>
                            <div className={styles.ftScoreBar}>
                                <div
                                    className={styles.ftScoreBarFill}
                                    style={{ width: `${data.firstToScore}%` }}
                                />
                            </div>
                        </div>
                        <div className={styles.ftScoreItem}>
                            <div className={styles.ftScoreLabel}>Vence após marcar primeiro</div>
                            <div className={styles.ftScoreValue}>{data.firstToScoreAndWin}%</div>
                            <div className={styles.ftScoreBar}>
                                <div
                                    className={`${styles.ftScoreBarFill} ${styles.winBar}`}
                                    style={{ width: `${data.firstToScoreAndWin}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
