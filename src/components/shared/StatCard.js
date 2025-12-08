'use client';
import styles from './StatCard.module.css';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', size = 'medium' }) {
    return (
        <div className={`${styles.card} ${styles[size]}`}>
            {Icon && (
                <div className={`${styles.iconContainer} ${styles[`icon${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
                    <Icon className={styles.icon} />
                </div>
            )}
            <div className={styles.content}>
                <div className={styles.title}>{title}</div>
                <div className={`${styles.value} ${styles[`value${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
                    {value}
                </div>
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
            </div>
        </div>
    );
}
