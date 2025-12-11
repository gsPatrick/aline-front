'use client';
import { useState } from 'react';
import styles from './CardPredictionsWidget.module.css';

export default function CardPredictionsWidget({ analysis }) {
    const [tab, setTab] = useState('ft');

    // Analysis structure based on debug output:
    // analysis.totalCards = [ { label: 'Over 0.5', homeM: '90%', awayM: '100%' } ]
    // We need to map this to the table.

    const rows = analysis?.totalCards || [];

    // Helper to determine badge color
    const getBadgeType = (val) => {
        const num = parseFloat(val);
        if (num >= 70) return 'high';
        if (num >= 50) return 'med';
        return 'low';
    };

    // Calculate game probability (average of home and away for now)
    const getGameProb = (row) => {
        const h = parseFloat(row.homeM) || 0;
        const a = parseFloat(row.awayM) || 0;
        return Math.round((h + a) / 2) + '%';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>Previsões CornerPro</div>

            <div className={styles.topActions}>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${tab === 'ft' ? styles.active : ''}`} onClick={() => setTab('ft')}>
                        Fim do Jogo <span className={styles.predictionVal}>{analysis?.averages?.total?.home ? ((parseFloat(analysis.averages.total.home) + parseFloat(analysis.averages.total.away)) / 2).toFixed(2) : '-'}</span>
                    </button>
                    {/* HT and 2HT tabs are placeholders for now */}
                    <button className={`${styles.tab} ${tab === 'ht' ? styles.active : ''}`} onClick={() => setTab('ht')}>
                        1ª Parte <span>-</span>
                    </button>
                    <button className={`${styles.tab} ${tab === '2ht' ? styles.active : ''}`} onClick={() => setTab('2ht')}>
                        2ª Parte <span>-</span>
                    </button>
                </div>
                <div className={styles.toggles}>
                    <button className={styles.toggleBtnActive}>Mais</button>
                    <button className={styles.toggleBtn}>Menos</button>
                </div>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHead}>
                    <span></span><span>Casa</span><span>Fora</span><span>Jogo</span>
                </div>
                {rows.length > 0 ? rows.map((row, i) => {
                    const gameProb = getGameProb(row);
                    return (
                        <div key={i} className={styles.row}>
                            <span className={styles.label}>{row.label}</span>
                            <span>{row.homeM}</span>
                            <span>{row.awayM}</span>
                            <span className={`${styles.badge} ${styles[getBadgeType(gameProb)]}`}>{gameProb}</span>
                        </div>
                    );
                }) : (
                    <div className={styles.row} style={{ justifyContent: 'center', color: '#888' }}>
                        Sem dados de previsões
                    </div>
                )}
            </div>
        </div>
    );
}