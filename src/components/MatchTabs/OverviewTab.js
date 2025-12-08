'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaChartLine, FaUsers, FaListOl, FaMoneyBillWave, FaFutbol, FaExchangeAlt, FaFlag } from 'react-icons/fa';
import styles from './OverviewTab.module.css';

export default function OverviewTab({ match }) {
    const [activeSubTab, setActiveSubTab] = useState('resumo');

    if (!match) return <div className={styles.emptyState}>Dados não disponíveis</div>;

    const { matchInfo, goalAnalysis, cornerAnalysis, h2h, history } = match;

    // Calcular H2H stats
    const calculateH2H = () => {
        if (!h2h?.matches || h2h.matches.length === 0) {
            return { homeWins: 0, draws: 0, awayWins: 0, total: 0 };
        }

        let homeWins = 0, draws = 0, awayWins = 0;

        h2h.matches.forEach(m => {
            const homeScore = m.scores?.home || 0;
            const awayScore = m.scores?.away || 0;

            if (homeScore > awayScore) homeWins++;
            else if (homeScore < awayScore) awayWins++;
            else draws++;
        });

        return { homeWins, draws, awayWins, total: h2h.matches.length };
    };

    const h2hStats = calculateH2H();

    // Prediction Badges baseados em goalAnalysis e cornerAnalysis
    const predictionBadges = [];

    if (goalAnalysis?.home?.over05 === "100") {
        predictionBadges.push({ label: '100% Over 0.5 Gols', type: 'success' });
    }
    if (goalAnalysis?.home?.over25 && parseInt(goalAnalysis.home.over25) >= 70) {
        predictionBadges.push({ label: `${goalAnalysis.home.over25}% Over 2.5 Gols`, type: 'warning' });
    }
    if (cornerAnalysis?.home?.trends?.over85 && parseInt(cornerAnalysis.home.trends.over85) >= 70) {
        predictionBadges.push({ label: `${cornerAnalysis.home.trends.over85}% Over 8.5 Cantos`, type: 'info' });
    }

    const renderLeftColumn = () => (
        <div className={styles.leftColumn}>
            {/* Probabilidades / Previsão */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                    <FaChartLine /> Previsões
                </h3>
                <div className={styles.predictionBadges}>
                    {predictionBadges.length > 0 ? (
                        predictionBadges.map((badge, idx) => (
                            <div key={idx} className={`${styles.badge} ${styles[badge.type]}`}>
                                {badge.label}
                            </div>
                        ))
                    ) : (
                        <p className={styles.noData}>Sem previsões disponíveis</p>
                    )}
                </div>
            </div>

            {/* Confronto Direto (H2H) */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                    <FaTrophy /> Confronto Direto
                </h3>
                {h2hStats.total > 0 ? (
                    <>
                        <div className={styles.h2hBar}>
                            <div
                                className={styles.h2hHome}
                                style={{ width: `${(h2hStats.homeWins / h2hStats.total) * 100}%` }}
                            >
                                {h2hStats.homeWins > 0 && <span>{h2hStats.homeWins}</span>}
                            </div>
                            <div
                                className={styles.h2hDraw}
                                style={{ width: `${(h2hStats.draws / h2hStats.total) * 100}%` }}
                            >
                                {h2hStats.draws > 0 && <span>{h2hStats.draws}</span>}
                            </div>
                            <div
                                className={styles.h2hAway}
                                style={{ width: `${(h2hStats.awayWins / h2hStats.total) * 100}%` }}
                            >
                                {h2hStats.awayWins > 0 && <span>{h2hStats.awayWins}</span>}
                            </div>
                        </div>
                        <div className={styles.h2hLegend}>
                            <span className={styles.legendHome}>Vitórias Casa</span>
                            <span className={styles.legendDraw}>Empates</span>
                            <span className={styles.legendAway}>Vitórias Fora</span>
                        </div>
                        <p className={styles.h2hTotal}>Total: {h2hStats.total} jogos</p>
                    </>
                ) : (
                    <p className={styles.noData}>Sem histórico de confrontos</p>
                )}
            </div>

            {/* Últimos Jogos */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                    <FaListOl /> Últimos Jogos - Casa
                </h3>
                {history?.home && history.home.length > 0 ? (
                    <div className={styles.matchList}>
                        {history.home.slice(0, 5).map((m, idx) => (
                            <div key={idx} className={styles.matchItem}>
                                <span className={styles.matchName}>{m.name || 'Jogo'}</span>
                                <div className={styles.matchBadges}>
                                    {m.stats?.corners > 0 && (
                                        <span className={styles.statBadge}>
                                            <FaFlag /> {m.stats.corners} Cantos
                                        </span>
                                    )}
                                    {m.stats?.cards > 0 && (
                                        <span className={styles.statBadge}>
                                            🟨 {m.stats.cards} Cartões
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noData}>Sem histórico disponível</p>
                )}
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                    <FaListOl /> Últimos Jogos - Fora
                </h3>
                {history?.away && history.away.length > 0 ? (
                    <div className={styles.matchList}>
                        {history.away.slice(0, 5).map((m, idx) => (
                            <div key={idx} className={styles.matchItem}>
                                <span className={styles.matchName}>{m.name || 'Jogo'}</span>
                                <div className={styles.matchBadges}>
                                    {m.stats?.corners > 0 && (
                                        <span className={styles.statBadge}>
                                            <FaFlag /> {m.stats.corners} Cantos
                                        </span>
                                    )}
                                    {m.stats?.cards > 0 && (
                                        <span className={styles.statBadge}>
                                            🟨 {m.stats.cards} Cartões
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noData}>Sem histórico disponível</p>
                )}
            </div>
        </div>
    );

    const renderRightColumn = () => {
        const subTabs = [
            { id: 'resumo', label: 'Resumo', icon: FaChartLine },
            { id: 'onze', label: 'Onze Iniciais', icon: FaUsers },
            { id: 'eventos', label: 'Eventos Jogo', icon: FaFutbol },
            { id: 'classificacao', label: 'Classificação', icon: FaTrophy },
            { id: 'odds', label: 'Odds', icon: FaMoneyBillWave }
        ];

        return (
            <div className={styles.rightColumn}>
                {/* Sub-tabs Navigation */}
                <div className={styles.subTabs}>
                    {subTabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.subTab} ${activeSubTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveSubTab(tab.id)}
                        >
                            <tab.icon />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Sub-tab Content */}
                <motion.div
                    key={activeSubTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.subTabContent}
                >
                    {activeSubTab === 'resumo' && renderResumoTab()}
                    {activeSubTab === 'onze' && renderOnzeTab()}
                    {activeSubTab === 'eventos' && renderEventosTab()}
                    {activeSubTab === 'classificacao' && renderClassificacaoTab()}
                    {activeSubTab === 'odds' && renderOddsTab()}
                </motion.div>
            </div>
        );
    };

    const renderResumoTab = () => (
        <div className={styles.resumo}>
            <h4>Resumo da Partida</h4>
            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>BTTS Casa</span>
                    <span className={styles.statValue}>{goalAnalysis?.home?.btts || '0'}%</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>BTTS Fora</span>
                    <span className={styles.statValue}>{goalAnalysis?.away?.btts || '0'}%</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Média Cantos Casa</span>
                    <span className={styles.statValue}>{cornerAnalysis?.home?.avgTotal || '0.0'}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Média Cantos Fora</span>
                    <span className={styles.statValue}>{cornerAnalysis?.away?.avgTotal || '0.0'}</span>
                </div>
            </div>
        </div>
    );

    const renderOnzeTab = () => (
        <div className={styles.onze}>
            <h4>Escalação</h4>
            <p className={styles.noData}>Escalação não disponível para este jogo</p>
        </div>
    );

    const renderEventosTab = () => {
        const events = history?.home?.[0]?.events || [];

        return (
            <div className={styles.eventos}>
                <h4>Timeline de Eventos</h4>
                {events.length > 0 ? (
                    <div className={styles.timeline}>
                        {events.map((event, idx) => (
                            <div key={idx} className={styles.timelineItem}>
                                <span className={styles.eventMinute}>{event.minute}'</span>
                                <span className={styles.eventIcon}>
                                    {event.type?.code === 'goal' && '⚽'}
                                    {event.type?.code === 'yellowcard' && '🟨'}
                                    {event.type?.code === 'substitution' && <FaExchangeAlt />}
                                </span>
                                <span className={styles.eventText}>
                                    {event.player_name} - {event.type?.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noData}>Sem eventos disponíveis</p>
                )}
            </div>
        );
    };

    const renderClassificacaoTab = () => (
        <div className={styles.classificacao}>
            <h4>Tabela Classificativa</h4>
            <p className={styles.noData}>Classificação não disponível</p>
        </div>
    );

    const renderOddsTab = () => (
        <div className={styles.odds}>
            <h4>Odds de Mercados</h4>
            {match.goalMarkets ? (
                <div className={styles.oddsGrid}>
                    <div className={styles.oddItem}>
                        <span>Over 0.5</span>
                        <span className={styles.oddValue}>{match.goalMarkets.over05?.toFixed(2)}</span>
                    </div>
                    <div className={styles.oddItem}>
                        <span>Over 1.5</span>
                        <span className={styles.oddValue}>{match.goalMarkets.over15?.toFixed(2)}</span>
                    </div>
                    <div className={styles.oddItem}>
                        <span>Over 2.5</span>
                        <span className={styles.oddValue}>{match.goalMarkets.over25?.toFixed(2)}</span>
                    </div>
                    <div className={styles.oddItem}>
                        <span>Over 3.5</span>
                        <span className={styles.oddValue}>{match.goalMarkets.over35?.toFixed(2)}</span>
                    </div>
                </div>
            ) : (
                <p className={styles.noData}>Odds não disponíveis</p>
            )}
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.layout}>
                {renderLeftColumn()}
                {renderRightColumn()}
            </div>
        </div>
    );
}
