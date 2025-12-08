'use client';
import { motion } from 'framer-motion';
import styles from './RaceChart.module.css';

export default function RaceChart({ homeRaces, awayRaces, homeTeam, awayTeam }) {
    if (!homeRaces || !awayRaces) {
        return <div className={styles.emptyState}>Dados de corridas não disponíveis</div>;
    }

    const races = [
        { key: 'race3', label: 'Corrida para 3 Cantos' },
        { key: 'race5', label: 'Corrida para 5 Cantos' },
        { key: 'race7', label: 'Corrida para 7 Cantos' },
        { key: 'race9', label: 'Corrida para 9 Cantos' }
    ];

    return (
        <div className={styles.container}>
            {races.map(({ key, label }) => {
                const homeValue = parseInt(homeRaces[key] || '0');
                const awayValue = parseInt(awayRaces[key] || '0');

                // Determine winner
                const homeWinning = homeValue > awayValue;
                const awayWinning = awayValue > homeValue;
                const tied = homeValue === awayValue;

                return (
                    <div key={key} className={styles.raceItem}>
                        <div className={styles.raceLabel}>{label}</div>

                        {/* Home Team Bar */}
                        <div className={styles.barContainer}>
                            <span className={styles.teamName}>{homeTeam}</span>
                            <div className={styles.barWrapper}>
                                <motion.div
                                    className={`${styles.bar} ${styles.homeBar} ${homeWinning ? styles.winning : ''}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${homeValue}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                >
                                    <span className={styles.barValue}>{homeValue}%</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Away Team Bar */}
                        <div className={styles.barContainer}>
                            <span className={styles.teamName}>{awayTeam}</span>
                            <div className={styles.barWrapper}>
                                <motion.div
                                    className={`${styles.bar} ${styles.awayBar} ${awayWinning ? styles.winning : ''}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${awayValue}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                >
                                    <span className={styles.barValue}>{awayValue}%</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Winner Badge */}
                        {!tied && (homeValue > 0 || awayValue > 0) && (
                            <div className={styles.winnerBadge}>
                                {homeWinning ? '🏆 Casa favorita' : '🏆 Fora favorita'}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
