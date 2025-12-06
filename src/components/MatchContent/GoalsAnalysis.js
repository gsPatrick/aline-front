import React from 'react';
import { motion } from 'framer-motion';
import styles from './MatchContent.module.css';
import AnalysisTable from './AnalysisTable';
import { FaChartBar, FaClock } from 'react-icons/fa';

const GoalsAnalysis = ({ data }) => {
    if (!data) return <div className={styles.emptyState}>Carregando análise de gols...</div>;

    const { predictions_table, analysis } = data;

    return (
        <div className={styles.analysisContainer}>
            {/* Esquerda: Tabela de Previsões */}
            <div>
                <h3 className={styles.cardTitle}>
                    <FaChartBar style={{ color: 'var(--color-primary)' }} /> Probabilidades de Gols
                </h3>
                <AnalysisTable predictionsTable={predictions_table} />
            </div>

            {/* Direita: Estatísticas e Timing */}
            <div className={styles.statsPanel}>
                {/* Médias */}
                <div className={styles.statGroup}>
                    <div className={styles.statGroupTitle}>Médias de Gols (Marcados/Sofridos)</div>
                    <div className={styles.statsList}>
                        <div className={styles.statRow}>
                            <div className={styles.labels}>
                                <span className={styles.valueHome}>{analysis.home?.averages?.scored || 0}</span>
                                <span className={styles.statName}>Marcados</span>
                                <span className={styles.valueAway}>{analysis.away?.averages?.scored || 0}</span>
                            </div>
                            <div className={styles.barTrack}>
                                <div className={styles.barHome} style={{ width: '50%' }} />
                                <div className={styles.barSeparator} />
                                <div className={styles.barAway} style={{ width: '50%' }} />
                            </div>
                        </div>
                        <div className={styles.statRow}>
                            <div className={styles.labels}>
                                <span className={styles.valueHome}>{analysis.home?.averages?.conceded || 0}</span>
                                <span className={styles.statName}>Sofridos</span>
                                <span className={styles.valueAway}>{analysis.away?.averages?.conceded || 0}</span>
                            </div>
                            <div className={styles.barTrack}>
                                <div className={styles.barHome} style={{ width: '50%', background: '#ff4444' }} />
                                <div className={styles.barSeparator} />
                                <div className={styles.barAway} style={{ width: '50%', background: '#ff4444' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timing */}
                <div className={styles.statGroup}>
                    <div className={styles.statGroupTitle}>
                        <FaClock /> Momento dos Gols
                    </div>
                    <div className={styles.timingGrid}>
                        {analysis.timing && Object.entries(analysis.timing).map(([interval, value]) => (
                            <div key={interval} className={styles.timingItem}>
                                <span className={styles.timingLabel}>{interval}</span>
                                <span className={styles.timingValue}>{value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalsAnalysis;
