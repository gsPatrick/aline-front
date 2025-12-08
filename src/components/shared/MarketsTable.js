'use client';
import styles from './MarketsTable.module.css';

export default function MarketsTable({ markets, title = "Over/Under Markets" }) {
    if (!markets) return null;

    const getColorClass = (percentage) => {
        const pct = parseFloat(percentage);
        if (pct >= 70) return styles.high;
        if (pct >= 50) return styles.medium;
        return styles.low;
    };

    const marketItems = Object.entries(markets).map(([key, value]) => ({
        label: key.replace('over', 'Over ').replace('under', 'Under '),
        value: value
    }));

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>{title}</h4>
            <div className={styles.table}>
                <div className={styles.header}>
                    <span>Market</span>
                    <span>Probability</span>
                </div>
                {marketItems.map((item, index) => (
                    <div key={index} className={styles.row}>
                        <span className={styles.label}>{item.label}</span>
                        <div className={styles.valueContainer}>
                            <div className={styles.barTrack}>
                                <div
                                    className={`${styles.barFill} ${getColorClass(item.value)}`}
                                    style={{ width: `${item.value}%` }}
                                />
                            </div>
                            <span className={`${styles.value} ${getColorClass(item.value)}`}>
                                {item.value}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
