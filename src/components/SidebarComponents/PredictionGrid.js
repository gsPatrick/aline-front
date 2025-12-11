'use client';
import styles from './PredictionGrid.module.css';

// Mock baseado na imagem
const mockPredictions = [
    { label: '100% Over 0.5HT', sub: '1/1 Jogos', type: 'high' },
    { label: '100% BTTS', sub: '1/1 Jogos', type: 'high' },
    { label: '100% Over 8.5FT', sub: '1/1 Jogos', type: 'high' },
    { label: '100% Over 1.5FT', sub: '1/1 Jogos', type: 'high' },
    { label: '100% Canto 37HT', sub: '1/1 Jogos', type: 'high' },
    { label: '100% Over 9.5FT', sub: '1/1 Jogos', type: 'high' },
    { label: '100% Over 2.5FT', sub: '1/1 Jogos', type: 'high' },
    { label: '100% Canto 87FT', sub: '1/1 Jogos', type: 'high' },
    { label: '61-75 Golos', sub: '2 Golos - 1 Jogos', type: 'warn' },
];

export default function PredictionGrid({ title, predictions = mockPredictions }) {
    return (
        <div className={styles.container}>
            {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.grid}>
                {predictions.map((pred, idx) => (
                    <div key={idx} className={`${styles.card} ${pred.type === 'high' ? styles.high : styles.warn}`}>
                        <span className={styles.label}>{pred.label}</span>
                        <span className={styles.sub}>{pred.sub}</span>
                        {pred.type === 'warn' && <div className={styles.barWarn}></div>}
                    </div>
                ))}
            </div>
        </div>
    );
}