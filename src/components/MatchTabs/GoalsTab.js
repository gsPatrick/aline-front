'use client';
import { useState } from 'react';
import HeatmapTable from '../shared/HeatmapTable';
import MarketsTable from '../shared/MarketsTable';
import StatCard from '../shared/StatCard';
import { FaFutbol, FaChartLine } from 'react-icons/fa';
import styles from './GoalsTab.module.css';

export default function GoalsTab({ data, filterCondition, onFilterChange }) {
    if (!data) {
        return <div className={styles.emptyState}>Dados de gols não disponíveis</div>;
    }

    const { markets, intervals, stats } = data;

    return (
        <div className={styles.container}>
            {/* Filter Toggle */}
            <div className={styles.filterContainer}>
                <button
                    className={`${styles.filterBtn} ${filterCondition === 'ALL' ? styles.active : ''}`}
                    onClick={() => onFilterChange('ALL')}
                >
                    Geral
                </button>
                <button
                    className={`${styles.filterBtn} ${filterCondition === 'HOME' ? styles.active : ''}`}
                    onClick={() => onFilterChange('HOME')}
                >
                    Casa
                </button>
                <button
                    className={`${styles.filterBtn} ${filterCondition === 'AWAY' ? styles.active : ''}`}
                    onClick={() => onFilterChange('AWAY')}
                >
                    Fora
                </button>
            </div>

            {/* Markets */}
            {markets && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaChartLine className={styles.icon} />
                        Mercados de Gols
                    </h3>
                    <MarketsTable
                        markets={markets}
                        type="goals"
                    />
                </div>
            )}

            {/* Intervals Heatmap */}
            {intervals && (
                <div className={styles.section}>
                    <HeatmapTable
                        intervals={intervals}
                        title="Intervalos de Gols"
                        type="goals"
                    />
                </div>
            )}

            {/* Stats Cards */}
            {stats && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaFutbol className={styles.icon} />
                        Estatísticas
                    </h3>
                    <div className={styles.statsGrid}>
                        <StatCard
                            title="Média de Gols Marcados"
                            value={stats.avgScored?.toFixed(2) || '0.00'}
                            subtitle="Por jogo"
                            color="primary"
                        />
                        <StatCard
                            title="Média de Gols Sofridos"
                            value={stats.avgConceded?.toFixed(2) || '0.00'}
                            subtitle="Por jogo"
                            color="secondary"
                        />
                        <StatCard
                            title="BTTS"
                            value={`${stats.bttsPercentage || 0}%`}
                            subtitle="Ambas marcam"
                            color={stats.bttsPercentage > 50 ? 'success' : 'default'}
                        />
                        <StatCard
                            title="Clean Sheets"
                            value={`${stats.cleanSheets || 0}%`}
                            subtitle="Sem sofrer gols"
                            color="info"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
