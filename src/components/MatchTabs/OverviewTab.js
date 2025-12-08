'use client';
import { motion } from 'framer-motion';
import { FaTrophy, FaFire, FaHistory } from 'react-icons/fa';
import ProgressBar from '../shared/ProgressBar';
import StatCard from '../shared/StatCard';
import styles from './OverviewTab.module.css';

export default function OverviewTab({ data, h2h, history }) {
    if (!data) {
        return <div className={styles.emptyState}>Dados de análise não disponíveis</div>;
    }

    const { probabilities, insights } = data;

    return (
        <div className={styles.container}>
            <div className={styles.twoColumn}>
                {/* Left Column */}
                <div className={styles.leftColumn}>
                    {/* Probabilities */}
                    {probabilities && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <FaTrophy className={styles.titleIcon} />
                                Probabilidades
                            </h3>
                            <div className={styles.probabilities}>
                                <ProgressBar
                                    homeValue={probabilities.home || 0}
                                    awayValue={probabilities.away || 0}
                                    homeLabel="Casa"
                                    awayLabel="Fora"
                                    showPercentage={true}
                                />
                                {probabilities.draw !== undefined && (
                                    <div className={styles.drawProb}>
                                        <span className={styles.drawLabel}>Empate</span>
                                        <span className={styles.drawValue}>{probabilities.draw}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Insights */}
                    {insights && insights.length > 0 && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <FaFire className={styles.titleIcon} />
                                Insights
                            </h3>
                            <div className={styles.insightsGrid}>
                                {insights.map((insight, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={styles.insightBadge}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <span className={styles.insightValue}>{insight.value}</span>
                                        <span className={styles.insightLabel}>{insight.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* H2H Summary */}
                    {h2h && h2h.summary && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <FaHistory className={styles.titleIcon} />
                                Confrontos Diretos
                            </h3>
                            <div className={styles.h2hSummary}>
                                <div className={styles.h2hStat}>
                                    <span className={styles.h2hLabel}>Vitórias Casa</span>
                                    <span className={styles.h2hValue}>{h2h.summary.homeWins || 0}</span>
                                </div>
                                <div className={styles.h2hStat}>
                                    <span className={styles.h2hLabel}>Empates</span>
                                    <span className={styles.h2hValue}>{h2h.summary.draws || 0}</span>
                                </div>
                                <div className={styles.h2hStat}>
                                    <span className={styles.h2hLabel}>Vitórias Fora</span>
                                    <span className={styles.h2hValue}>{h2h.summary.awayWins || 0}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Games */}
                    {history && history.length > 0 && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Últimos Jogos</h3>
                            <div className={styles.historyList}>
                                {history.slice(0, 5).map((match, idx) => (
                                    <div key={idx} className={styles.historyCard}>
                                        <div className={styles.historyDate}>
                                            {new Date(match.date).toLocaleDateString('pt-BR')}
                                        </div>
                                        <div className={styles.historyMatch}>
                                            <span>{match.homeTeam}</span>
                                            <span className={styles.historyScore}>
                                                {match.homeScore} - {match.awayScore}
                                            </span>
                                            <span>{match.awayTeam}</span>
                                        </div>
                                        {match.stats && (
                                            <div className={styles.historyStats}>
                                                {match.stats.corners && (
                                                    <span className={styles.statBadge}>
                                                        {match.stats.corners} Cantos
                                                    </span>
                                                )}
                                                {match.stats.cards && (
                                                    <span className={styles.statBadge}>
                                                        {match.stats.cards} Cartões
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Timeline */}
                <div className={styles.rightColumn}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Timeline de Eventos</h3>
                        <div className={styles.timeline}>
                            <p className={styles.timelinePlaceholder}>
                                Timeline será exibido aqui (Gols, Cartões, Substituições)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
