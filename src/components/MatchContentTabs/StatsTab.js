'use client';
import { useState } from 'react';
import styles from './StatsTab.module.css';

export default function StatsTab({ match }) {
    const [period, setPeriod] = useState('full'); // full, ht, sh

    const stats = match?.generalStatsAnalysis;
    const matchInfo = match?.matchInfo;

    if (!stats) {
        return (
            <div className={styles.emptyState}>
                <p>📊 Estatísticas não disponíveis</p>
            </div>
        );
    }

    const { home, away } = stats;

    const statItems = [
        { label: 'Posse de Bola', homeKey: 'control.possession', awayKey: 'control.possession', suffix: '%' },
        { label: 'Remates', homeKey: 'shots.total', awayKey: 'shots.total' },
        { label: 'Remates à Baliza', homeKey: 'shots.onGoal', awayKey: 'shots.onGoal' },
        { label: 'Remates Fora', homeKey: 'shots.offGoal', awayKey: 'shots.offGoal' },
        { label: 'Passes', homeKey: 'control.passes', awayKey: 'control.passes' },
        { label: 'Faltas', homeKey: 'control.fouls', awayKey: 'control.fouls' },
        { label: 'Impedimentos', homeKey: 'control.offsides', awayKey: 'control.offsides' }
    ];

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc?.[part], obj) || 0;
    };

    const renderStatBar = (stat) => {
        const homeValue = parseFloat(getNestedValue(home, stat.homeKey));
        const awayValue = parseFloat(getNestedValue(away, stat.awayKey));
        const total = homeValue + awayValue;

        const homePercent = total > 0 ? (homeValue / total) * 100 : 50;
        const awayPercent = total > 0 ? (awayValue / total) * 100 : 50;

        return (
            <div key={stat.label} className={styles.statRow}>
                <span className={styles.statValueLeft}>
                    {homeValue}{stat.suffix || ''}
                </span>
                <div className={styles.statBarContainer}>
                    <div className={styles.statLabel}>{stat.label}</div>
                    <div className={styles.statBar}>
                        <div
                            className={styles.statBarHome}
                            style={{ width: `${homePercent}%` }}
                        />
                        <div
                            className={styles.statBarAway}
                            style={{ width: `${awayPercent}%` }}
                        />
                    </div>
                </div>
                <span className={styles.statValueRight}>
                    {awayValue}{stat.suffix || ''}
                </span>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {/* Period Filters */}
            <div className={styles.filters}>
                <button
                    className={`${styles.filterButton} ${period === 'full' ? styles.active : ''}`}
                    onClick={() => setPeriod('full')}
                >
                    Jogo
                </button>
                <button
                    className={`${styles.filterButton} ${period === 'ht' ? styles.active : ''}`}
                    onClick={() => setPeriod('ht')}
                >
                    1ª Parte
                </button>
                <button
                    className={`${styles.filterButton} ${period === 'sh' ? styles.active : ''}`}
                    onClick={() => setPeriod('sh')}
                >
                    2ª Parte
                </button>
            </div>

            {/* Team Headers */}
            <div className={styles.teamHeaders}>
                <span className={styles.teamName}>{matchInfo?.home_team?.name || 'Casa'}</span>
                <span className={styles.teamName}>{matchInfo?.away_team?.name || 'Fora'}</span>
            </div>

            {/* Stats Bars */}
            <div className={styles.statsContainer}>
                {statItems.map(stat => renderStatBar(stat))}
            </div>
        </div>
    );
}
