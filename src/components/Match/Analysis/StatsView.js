'use client';
import { useState } from 'react';
import styles from './SubViews.module.css';

export default function StatsView({ match }) {
    const [period, setPeriod] = useState('ft'); // ft (Fim do Jogo), 1h (1ª Parte)

    // Acessar estatísticas baseado no período
    const statsData = period === 'ft' ? match?.stats?.fulltime : match?.stats?.firsthalf;
    // Mock para visualização se não tiver dados
    const stats = statsData || {
        possession: { home: 50, away: 50 },
        shots: { home: 10, away: 5 },
        corners: { home: 3, away: 2 }
    };

    return (
        <div className={styles.subContainer}>
            <div className={styles.filterBar}>
                <button className={`${styles.filterPill} ${period === 'ft' ? styles.pillActive : ''}`} onClick={() => setPeriod('ft')}>Fim do Jogo</button>
                <button className={`${styles.filterPill} ${period === '1h' ? styles.pillActive : ''}`} onClick={() => setPeriod('1h')}>1ª Parte</button>
            </div>

            <div className={styles.statsList}>
                <StatBar label="Posse de Bola" home={stats.possession?.home} away={stats.possession?.away} suffix="%" />
                <StatBar label="Ataques" home={stats.attacks?.home} away={stats.attacks?.away} />
                <StatBar label="Cantos" home={stats.corners?.home} away={stats.corners?.away} />
                <StatBar label="Cartões Amarelos" home={stats.yellowcards?.home} away={stats.yellowcards?.away} />
            </div>
        </div>
    );
}

const StatBar = ({ label, home, away, suffix = '' }) => {
    const total = (home || 0) + (away || 0);
    const hPerc = total === 0 ? 50 : (home / total) * 100;

    return (
        <div className={styles.statRow}>
            <div className={styles.statInfo}>
                <span>{home}{suffix}</span>
                <span className={styles.statLabel}>{label}</span>
                <span>{away}{suffix}</span>
            </div>
            <div className={styles.barTrack}>
                <div className={styles.barHome} style={{ width: `${hPerc}%` }}></div>
            </div>
        </div>
    );
};