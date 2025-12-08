'use client';
import { motion } from 'framer-motion';
import styles from './ProgressBar.module.css';

export default function ProgressBar({
    homeValue = 0,
    awayValue = 0,
    homeLabel = 'Home',
    awayLabel = 'Away',
    showPercentage = true
}) {
    const total = homeValue + awayValue;
    const homePercent = total > 0 ? (homeValue / total) * 100 : 50;
    const awayPercent = total > 0 ? (awayValue / total) * 100 : 50;

    return (
        <div className={styles.container}>
            <div className={styles.labels}>
                <span className={styles.homeLabel}>
                    {homeValue}{showPercentage && total > 0 ? ` (${homePercent.toFixed(0)}%)` : ''}
                </span>
                <span className={styles.centerLabel}>{homeLabel} vs {awayLabel}</span>
                <span className={styles.awayLabel}>
                    {awayValue}{showPercentage && total > 0 ? ` (${awayPercent.toFixed(0)}%)` : ''}
                </span>
            </div>
            <div className={styles.track}>
                <motion.div
                    className={styles.homeBar}
                    initial={{ width: 0 }}
                    animate={{ width: `${homePercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                <div className={styles.separator} />
                <motion.div
                    className={styles.awayBar}
                    initial={{ width: 0 }}
                    animate={{ width: `${awayPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}
