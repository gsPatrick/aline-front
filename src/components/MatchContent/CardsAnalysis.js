import React from 'react';
import { motion } from 'framer-motion';
import styles from './MatchContent.module.css';
import AnalysisTable from './AnalysisTable';
import { FaSquare, FaUserTie } from 'react-icons/fa';

const CardsAnalysis = ({ data }) => {
    if (!data) return <div className={styles.emptyState}>Carregando análise de cartões...</div>;

    const { predictions_table, analysis } = data;

    return (
        <div className={styles.analysisContainer}>
            {/* Esquerda: Tabela de Previsões */}
            <div>
                <h3 className={styles.cardTitle}>
                    <FaSquare style={{ color: '#ffd700' }} /> Probabilidades de Cartões
                </h3>
                <AnalysisTable predictionsTable={predictions_table} />
            </div>

            {/* Direita: Estatísticas e Árbitro */}
            <div className={styles.statsPanel}>
                {/* Médias */}
                <div className={styles.statGroup}>
                    <div className={styles.statGroupTitle}>Médias de Cartões</div>
                    <div className={styles.statsList}>
                        <div className={styles.statRow}>
                            <div className={styles.labels}>
                                <span className={styles.valueHome}>{analysis.home?.averages?.total || 0}</span>
                                <span className={styles.statName}>Total por Jogo</span>
                                <span className={styles.valueAway}>{analysis.away?.averages?.total || 0}</span>
                            </div>
                            <div className={styles.barTrack}>
                                <div className={styles.barHome} style={{ width: '50%', background: '#ffd700' }} />
                                <div className={styles.barSeparator} />
                                <div className={styles.barAway} style={{ width: '50%', background: '#ffd700' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Árbitro */}
                {analysis.referee && (
                    <div className={styles.statGroup}>
                        <div className={styles.statGroupTitle}>
                            <FaUserTie /> Árbitro
                        </div>
                        <div className={styles.refereeInfo}>
                            <img
                                src={analysis.referee.image_path || '/api/placeholder/50/50'}
                                alt="Referee"
                                className={styles.refereeAvatar}
                                onError={(e) => e.target.src = '/api/placeholder/50/50'}
                            />
                            <div className={styles.refereeDetails}>
                                <span className={styles.refereeName}>{analysis.referee.common_name || analysis.referee.fullname}</span>
                                <span className={styles.refereeStat}>Média Cartões: {analysis.referee.stats?.yellow_cards_avg || '-'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardsAnalysis;
