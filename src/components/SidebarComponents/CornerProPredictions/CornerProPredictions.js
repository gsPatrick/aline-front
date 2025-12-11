'use client';
import { useState } from 'react';
import styles from './CornerProPredictions.module.css';

export default function CornerProPredictions({ analysis }) {
    const [activeTab, setActiveTab] = useState('ft'); // ft, ht, 2ht

    // Helper to get value or default based on active tab
    const getVal = (team, key) => {
        if (activeTab === 'ht') {
            return analysis?.[team]?.ht?.[key] || 0;
        } else if (activeTab === '2ht') {
            return analysis?.[team]?.sh?.[key] || 0;
        }
        return analysis?.[team]?.[key] || 0;
    };

    // Calculate Game Average (simple average of home and away for now)
    const getGameAvg = (key) => {
        const h = parseFloat(getVal('home', key));
        const a = parseFloat(getVal('away', key));
        return Math.round((h + a) / 2);
    };

    const rows = [
        { label: 'Over 0.5', home: `${getVal('home', 'over05')}%`, away: `${getVal('away', 'over05')}%`, game: `${getGameAvg('over05')}%`, type: getGameAvg('over05') > 80 ? 'high' : 'med' },
        { label: 'Over 1.5', home: `${getVal('home', 'over15')}%`, away: `${getVal('away', 'over15')}%`, game: `${getGameAvg('over15')}%`, type: getGameAvg('over15') > 70 ? 'high' : 'med' },
        { label: 'Over 2.5', home: `${getVal('home', 'over25')}%`, away: `${getVal('away', 'over25')}%`, game: `${getGameAvg('over25')}%`, type: getGameAvg('over25') > 50 ? 'med' : 'low' },
    ];

    // Only show Over 3.5 for Full Time
    if (activeTab === 'ft') {
        rows.push({ label: 'Over 3.5', home: `${getVal('home', 'over35')}%`, away: `${getVal('away', 'over35')}%`, game: `${getGameAvg('over35')}%`, type: getGameAvg('over35') > 30 ? 'med' : 'low' });
    }

    return (
        <div className={styles.container}>
            {/* Header: Título e Botões Mais/Menos */}
            <div className={styles.header}>
                <span className={styles.title}>Previsões CornerPro</span>
                <div className={styles.toggleGroup}>
                    <button className={`${styles.toggleBtn} ${styles.activeToggle}`}>Mais</button>
                    <button className={styles.toggleBtn}>Menos</button>
                </div>
            </div>

            {/* Abas: Fim do Jogo, 1a Parte... */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'ft' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('ft')}
                >
                    Fim do Jogo <span className={styles.badge}>2.6</span>
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'ht' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('ht')}
                >
                    1ª Parte <span>1.4</span>
                </button>
                <button
                    className={`${styles.tab} ${activeTab === '2ht' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('2ht')}
                >
                    2ª Parte <span>1.2</span>
                </button>
            </div>

            {/* Tabela */}
            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <span></span> {/* Espaço label */}
                    <span>Casa</span>
                    <span>Fora</span>
                    <span>Jogo</span>
                </div>

                <div className={styles.tableBody}>
                    {rows.map((row, idx) => (
                        <div key={idx} className={styles.tableRow}>
                            <span className={styles.rowLabel}>{row.label}</span>
                            <span className={styles.rowVal}>{row.home}</span>
                            <span className={styles.rowVal}>{row.away}</span>
                            <span className={styles.gameValContainer}>
                                <span className={`${styles.gameBadge} ${styles[row.type]}`}>{row.game}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer: Valor da Aposta */}
            <div className={styles.footer}>
                <div className={styles.footerLeft}>
                    <span className={styles.marketLabel}>over 2.5</span>
                </div>
                <div className={styles.footerMiddle}>
                    <div className={styles.oddRow}>
                        <span>Odd Over</span>
                        <span className={styles.oddVal}>1.60</span>
                    </div>
                    <div className={styles.oddRow}>
                        <span>Odd Under</span>
                        <span className={styles.oddVal}>2.30</span>
                    </div>
                </div>
                <div className={styles.footerRight}>
                    <button className={styles.btnNoValue}>Sem Valor</button>
                    <button className={styles.btnValue}>Com Valor</button>
                </div>
            </div>
        </div>
    );
}