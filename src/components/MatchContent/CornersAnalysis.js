import React from 'react';
import { motion } from 'framer-motion';
import styles from './MatchContent.module.css';
import AnalysisTable from './AnalysisTable';
import { FaFlag, FaRunning } from 'react-icons/fa';

const CornersAnalysis = ({ data }) => {
    if (!data) return <div className={styles.emptyState}>Carregando análise de cantos...</div>;

    const { predictions_table, analysis } = data;

    return (
        <div className={styles.analysisContainer}>
            {/* Esquerda: Tabela de Previsões */}
            <div>
                <h3 className={styles.cardTitle}>
                    <FaFlag style={{ color: 'var(--color-primary)' }} /> Probabilidades de Cantos
                </h3>
                <AnalysisTable predictionsTable={predictions_table} />
            </div>

            {/* Direita: Estatísticas e Race */}
            <div className={styles.statsPanel}>
                {/* Médias */}
                <div className={styles.statGroup}>
                    <div className={styles.statGroupTitle}>Médias de Cantos (Favor/Contra)</div>
                    <div className={styles.statsList}>
                        <div className={styles.statRow}>
                            <div className={styles.labels}>
                                <span className={styles.valueHome}>{analysis.home?.averages?.for || 0}</span>
                                <span className={styles.statName}>A Favor</span>
                                <span className={styles.valueAway}>{analysis.away?.averages?.for || 0}</span>
                            </div>
                            <div className={styles.barTrack}>
                                <div className={styles.barHome} style={{ width: '50%' }} />
                                <div className={styles.barSeparator} />
                                <div className={styles.barAway} style={{ width: '50%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Race to X */}
                <div className={styles.statGroup}>
                    <div className={styles.statGroupTitle}>
                        <FaRunning /> Corridas (Race)
                    </div>
                    <table className={styles.raceTable}>
                        <tbody>
                            {['race_3', 'race_5', 'race_7', 'race_9'].map(race => (
                                <tr key={race}>
                                    <td>{race.replace('_', ' ').toUpperCase()}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                        {analysis.home?.races?.[race] || 0} vs {analysis.away?.races?.[race] || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CornersAnalysis;
