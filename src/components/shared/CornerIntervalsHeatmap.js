'use client';
import { motion } from 'framer-motion';
import styles from './CornerIntervalsHeatmap.module.css';

export default function CornerIntervalsHeatmap({ homeIntervals, awayIntervals, homeTeam, awayTeam }) {
    if (!homeIntervals || !awayIntervals) {
        return <div className={styles.emptyState}>Dados de intervalos não disponíveis</div>;
    }

    const regularIntervals = [
        '0-10', '11-20', '21-30', '31-40', '41-50',
        '51-60', '61-70', '71-80', '81-90'
    ];

    const specialIntervals = ['37-HT', '87-FT'];

    const getOpacity = (frequency) => {
        const freq = parseInt(frequency || '0');
        return Math.max(0.1, freq / 100);
    };

    const getCellColor = (frequency) => {
        const freq = parseInt(frequency || '0');
        if (freq >= 70) return styles.high;
        if (freq >= 40) return styles.medium;
        return styles.low;
    };

    return (
        <div className={styles.container}>
            {/* Home Team Intervals */}
            <div className={styles.teamSection}>
                <h4 className={styles.teamTitle}>{homeTeam} - Intervalos de Cantos</h4>
                <div className={styles.grid}>
                    {regularIntervals.map((interval) => {
                        const data = homeIntervals[interval];
                        if (!data) return null;

                        const frequency = parseInt(data.frequency || '0');
                        const avgFor = parseFloat(data.avgFor || '0').toFixed(1);
                        const avgAgainst = parseFloat(data.avgAgainst || '0').toFixed(1);

                        return (
                            <motion.div
                                key={interval}
                                className={`${styles.cell} ${getCellColor(data.frequency)}`}
                                style={{ opacity: getOpacity(data.frequency) }}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: getOpacity(data.frequency) }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={styles.intervalLabel}>{interval}</div>
                                <div className={styles.avgValue}>{avgFor}</div>
                                <div className={styles.frequency}>{frequency}%</div>
                                <div className={styles.against}>vs {avgAgainst}</div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Special Intervals */}
                <div className={styles.specialSection}>
                    <h5 className={styles.specialTitle}>Destaques de Pressão</h5>
                    <div className={styles.specialGrid}>
                        {specialIntervals.map((interval) => {
                            const data = homeIntervals[interval];
                            if (!data) return null;

                            const frequency = parseInt(data.frequency || '0');

                            return (
                                <div key={interval} className={styles.specialCard}>
                                    <span className={styles.specialLabel}>{interval}</span>
                                    <span className={`${styles.specialValue} ${frequency >= 60 ? styles.highPressure : ''}`}>
                                        {frequency}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Away Team Intervals */}
            <div className={styles.teamSection}>
                <h4 className={styles.teamTitle}>{awayTeam} - Intervalos de Cantos</h4>
                <div className={styles.grid}>
                    {regularIntervals.map((interval) => {
                        const data = awayIntervals[interval];
                        if (!data) return null;

                        const frequency = parseInt(data.frequency || '0');
                        const avgFor = parseFloat(data.avgFor || '0').toFixed(1);
                        const avgAgainst = parseFloat(data.avgAgainst || '0').toFixed(1);

                        return (
                            <motion.div
                                key={interval}
                                className={`${styles.cell} ${getCellColor(data.frequency)}`}
                                style={{ opacity: getOpacity(data.frequency) }}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: getOpacity(data.frequency) }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={styles.intervalLabel}>{interval}</div>
                                <div className={styles.avgValue}>{avgFor}</div>
                                <div className={styles.frequency}>{frequency}%</div>
                                <div className={styles.against}>vs {avgAgainst}</div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Special Intervals */}
                <div className={styles.specialSection}>
                    <h5 className={styles.specialTitle}>Destaques de Pressão</h5>
                    <div className={styles.specialGrid}>
                        {specialIntervals.map((interval) => {
                            const data = awayIntervals[interval];
                            if (!data) return null;

                            const frequency = parseInt(data.frequency || '0');

                            return (
                                <div key={interval} className={styles.specialCard}>
                                    <span className={styles.specialLabel}>{interval}</span>
                                    <span className={`${styles.specialValue} ${frequency >= 60 ? styles.highPressure : ''}`}>
                                        {frequency}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
