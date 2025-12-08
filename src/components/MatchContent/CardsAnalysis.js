'use client';
import { useState } from 'react';
import { FaIdCard, FaUserTie, FaClock } from 'react-icons/fa';
import StatCard from '@/components/shared/StatCard';
import MarketsTable from '@/components/shared/MarketsTable';
import HeatmapTable from '@/components/shared/HeatmapTable';
import styles from './CardsAnalysis.module.css';

export default function CardsAnalysis({ data, referee, filterCondition = 'ALL' }) {
    const [activeTeam, setActiveTeam] = useState('home');

    if (!data) {
        return (
            <div className={styles.emptyState}>
                <FaIdCard className={styles.emptyIcon} />
                <p>Análise de cartões não disponível</p>
            </div>
        );
    }

    const { home, away } = data;
    const currentData = filterCondition === 'HOME' ? home : filterCondition === 'AWAY' ? away : null;

    // If ALL, show both teams side by side
    if (filterCondition === 'ALL') {
        return (
            <div className={styles.container}>
                {/* Referee Card */}
                {referee && <RefereeCard referee={referee} />}

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

                <TeamCardsAnalysis data={activeTeam === 'home' ? home : away} />
            </div>
        );
    }

    // Single team view
    return (
        <div className={styles.container}>
            {referee && <RefereeCard referee={referee} />}
            <TeamCardsAnalysis data={currentData} />
        </div>
    );
}

function RefereeCard({ referee }) {
    return (
        <div className={styles.refereeCard}>
            <div className={styles.refereeHeader}>
                <FaUserTie className={styles.refereeIcon} />
                <h4 className={styles.refereeTitle}>Árbitro da Partida</h4>
            </div>
            <div className={styles.refereeContent}>
                <div className={styles.refereeName}>{referee.name || 'Não informado'}</div>
                {referee.avgCards && (
                    <div className={styles.refereeStats}>
                        <div className={styles.refereeStat}>
                            <span className={styles.refereeStatLabel}>Média de Cartões</span>
                            <span className={styles.refereeStatValue}>{referee.avgCards}</span>
                        </div>
                        {referee.avgYellow && (
                            <div className={styles.refereeStat}>
                                <span className={styles.refereeStatLabel}>Amarelos</span>
                                <span className={`${styles.refereeStatValue} ${styles.yellow}`}>{referee.avgYellow}</span>
                            </div>
                        )}
                        {referee.avgRed && (
                            <div className={styles.refereeStat}>
                                <span className={styles.refereeStatLabel}>Vermelhos</span>
                                <span className={`${styles.refereeStatValue} ${styles.red}`}>{referee.avgRed}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function TeamCardsAnalysis({ data }) {
    if (!data) return null;

    return (
        <>
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <StatCard
                    title="Total Médio"
                    value={data.avgTotal}
                    subtitle="Cartões por jogo"
                    icon={FaIdCard}
                    color="warning"
                />
                <StatCard
                    title="Média A Favor"
                    value={data.avgFor}
                    subtitle="Recebidos"
                    icon={FaIdCard}
                    color="danger"
                />
                <StatCard
                    title="Média Contra"
                    value={data.avgAgainst}
                    subtitle="Adversários"
                    icon={FaIdCard}
                    color="primary"
                />
                <StatCard
                    title="1º Tempo"
                    value={data.firstHalfAvg}
                    subtitle="Média 1ª metade"
                    icon={FaClock}
                    color="success"
                />
            </div>

            {/* Markets Table */}
            {data.markets && (
                <div className={styles.section}>
                    <MarketsTable
                        markets={data.markets}
                        title="Mercados de Cartões"
                    />
                </div>
            )}

            {/* Intervals Heatmap */}
            {data.intervals && (
                <div className={styles.section}>
                    <HeatmapTable
                        intervals={data.intervals}
                        title="Distribuição de Cartões por Intervalo"
                        type="cards"
                    />
                </div>
            )}

            {/* Half Comparison */}
            <div className={styles.section}>
                <div className={styles.halfComparisonCard}>
                    <h4 className={styles.sectionTitle}>
                        <FaClock className={styles.titleIcon} />
                        Comparação por Tempo
                    </h4>
                    <div className={styles.halfComparisonGrid}>
                        <div className={styles.halfItem}>
                            <div className={styles.halfLabel}>Primeiro Tempo</div>
                            <div className={styles.halfValue}>{data.firstHalfAvg}</div>
                            <div className={styles.halfBar}>
                                <div
                                    className={styles.halfBarFill}
                                    style={{ width: `${(parseFloat(data.firstHalfAvg) / parseFloat(data.avgTotal)) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div className={styles.halfItem}>
                            <div className={styles.halfLabel}>Segundo Tempo</div>
                            <div className={styles.halfValue}>{data.secondHalfAvg}</div>
                            <div className={styles.halfBar}>
                                <div
                                    className={`${styles.halfBarFill} ${styles.secondHalf}`}
                                    style={{ width: `${(parseFloat(data.secondHalfAvg) / parseFloat(data.avgTotal)) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
