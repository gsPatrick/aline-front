'use client';
import { useState } from 'react';
import styles from './CornerPredictionsWidget.module.css';

export default function CornerPredictionsWidget({ analysis }) {
    const [tab, setTab] = useState('ft');

    // Analysis structure based on debug output:
    // analysis.totalCorners = [ { label: 'Over 8.5', homeM: '60%', awayM: '60%' } ]
    // analysis.htCorners = [ ... ]
    // analysis.shCorners = [ ... ]

    let rows = [];
    if (tab === 'ft') rows = analysis?.totalCorners || [];
    else if (tab === 'ht') rows = analysis?.htCorners || [];
    else if (tab === '2ht') rows = analysis?.shCorners || [];

    // Helper to determine badge color
    const getBadgeType = (val) => {
        const num = parseFloat(val);
        if (num >= 70) return 'high';
        if (num >= 50) return 'med';
        return 'low';
    };

    // Calculate game probability (average of home and away for now, or use a specific stat if available)
    const getGameProb = (row) => {
        const h = parseFloat(row.homeM) || 0;
        const a = parseFloat(row.awayM) || 0;
        return Math.round((h + a) / 2) + '%';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>Previsões CornerPro</div>

            <div className={styles.tabs}>
                <button className={`${styles.tab} ${tab === 'ft' ? styles.active : ''}`} onClick={() => setTab('ft')}>
                    Fim do Jogo <span className={styles.predictionVal}>{analysis?.home?.avgTotal || '-'}</span>
                </button>
                <button className={`${styles.tab} ${tab === 'ht' ? styles.active : ''}`} onClick={() => setTab('ht')}>
                    1ª Parte <span className={styles.predictionVal}>{analysis?.home?.avgHt || '-'}</span>
                </button>
                <button className={`${styles.tab} ${tab === '2ht' ? styles.active : ''}`} onClick={() => setTab('2ht')}>
                    2ª Parte <span className={styles.predictionVal}>{analysis?.home?.avgSh || '-'}</span>
                </button>
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

            <div className={styles.footer}>
                <div className={styles.market}>Total Cantos</div>
                <div className={styles.odds}>
                    <div className={styles.oddRow}><span>Média Casa</span> <strong>{analysis?.home?.avgTotal || '-'}</strong></div>
                    <div className={styles.oddRow}><span>Média Fora</span> <strong>{analysis?.away?.avgTotal || '-'}</strong></div>
                </div>
                {/* Actions buttons removed or kept as placeholders? User didn't specify. Keeping as is but disabled/static. */}
            </div>
        </div>
    );
}