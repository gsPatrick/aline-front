'use client';
import styles from './HeatmapTable.module.css';

export default function HeatmapTable({ intervals, title = "Time Intervals", type = "goals" }) {
    if (!intervals) return null;

    const getIntensityClass = (frequency) => {
        const freq = parseFloat(frequency);
        if (freq >= 70) return styles.intensity5;
        if (freq >= 50) return styles.intensity4;
        if (freq >= 30) return styles.intensity3;
        if (freq >= 10) return styles.intensity2;
        return styles.intensity1;
    };

    const intervalKeys = Object.keys(intervals).filter(key =>
        !key.includes('HT') && !key.includes('FT')
    );

    const specialIntervals = Object.keys(intervals).filter(key =>
        key.includes('HT') || key.includes('FT')
    );

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>{title}</h4>
            <div className={styles.grid}>
                {intervalKeys.map((key) => {
                    const data = intervals[key];
                    const frequency = data?.frequency || '0';

                    return (
                        <div
                            key={key}
                            className={`${styles.cell} ${getIntensityClass(frequency)}`}
                            title={`${key} min: ${frequency}% frequency`}
                        >
                            <div className={styles.cellLabel}>{key}'</div>
                            <div className={styles.cellValue}>{frequency}%</div>
                            {data?.avgFor !== undefined && (
                                <div className={styles.cellStats}>
                                    <span className={styles.statFor}>{data.avgFor}</span>
                                    <span className={styles.statSep}>-</span>
                                    <span className={styles.statAgainst}>{data.avgAgainst}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {specialIntervals.length > 0 && (
                <div className={styles.specialRow}>
                    {specialIntervals.map((key) => {
                        const data = intervals[key];
                        const frequency = data?.frequency || '0';

                        return (
                            <div
                                key={key}
                                className={`${styles.specialCell} ${getIntensityClass(frequency)}`}
                            >
                                <div className={styles.specialLabel}>{key}</div>
                                <div className={styles.specialValue}>{frequency}%</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
