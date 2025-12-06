'use client';
import { useState } from 'react';
import styles from './PredictionWidget.module.css';

export default function PredictionWidget({ predictions }) {
    const [activeTab, setActiveTab] = useState('fulltime'); // fulltime, 1st_half, 2nd_half

    if (!predictions || !predictions.probabilities) return null;

    const probs = predictions.probabilities;
    const valueBets = predictions.value_bets || [];

    // Helper para determinar cor
    const getProbClass = (val) => {
        if (val >= 70) return styles.highProb;
        if (val >= 40) return styles.medProb;
        return styles.lowProb;
    };

    // Mockando dados se não vierem completos da API para demonstração
    // Na prática, você usaria os dados reais de `probs` filtrados pela tab
    const markets = [
        { label: 'Home', value: probs.home || 0 },
        { label: 'Draw', value: probs.draw || 0 },
        { label: 'Away', value: probs.away || 0 },
        { label: 'Over 2.5', value: probs.over_2_5 || 0 },
        { label: 'BTTS', value: probs.btts || 0 },
    ];

    // Verifica Value Bet (Exemplo simples)
    const hasValueBet = valueBets.length > 0;

    return (
        <div className={styles.widgetContainer}>
            <div className={styles.header}>
                <h3 className={styles.title}>Previsões CornerPro</h3>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'fulltime' ? styles.active : ''}`}
                        onClick={() => setActiveTab('fulltime')}
                    >
                        Fim do Jogo
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === '1st_half' ? styles.active : ''}`}
                        onClick={() => setActiveTab('1st_half')}
                    >
                        1ª Parte
                    </button>
                </div>
            </div>

            <div className={styles.marketList}>
                {markets.map((m, idx) => {
                    const colorClass = getProbClass(m.value);
                    // Extrai apenas a classe de cor de fundo para a barra
                    const bgClass = colorClass.split(' ')[0];

                    return (
                        <div key={idx} className={styles.marketRow}>
                            <span className={styles.marketLabel}>{m.label}</span>
                            <div className={styles.probBarContainer}>
                                <div
                                    className={`${styles.probBar} ${bgClass}`}
                                    style={{ width: `${m.value}%` }}
                                />
                            </div>
                            <span className={`${styles.probValue} ${colorClass}`}>{m.value}%</span>
                        </div>
                    );
                })}
            </div>

            <div className={`${styles.valueBet} ${hasValueBet ? styles.hasValue : styles.noValue}`}>
                {hasValueBet ? "COM VALOR" : "SEM VALOR"}
            </div>
        </div>
    );
}
