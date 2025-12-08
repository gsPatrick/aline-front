'use client';
import { FaTrophy, FaChartLine, FaFlag } from 'react-icons/fa';
import styles from './MatchAnalysisSidebar.module.css';

export default function MatchAnalysisSidebar({ match }) {
    if (!match) return null;

    const { matchInfo, goalAnalysis, cornerAnalysis, h2h, history } = match;

    // Calculate H2H dominance
    const calculateH2H = () => {
        if (!h2h?.matches || h2h.matches.length === 0) {
            return { homeWins: 0, draws: 0, awayWins: 0, total: 0, homePercent: 0, drawPercent: 0, awayPercent: 0 };
        }

        let homeWins = 0, draws = 0, awayWins = 0;

        h2h.matches.forEach(m => {
            const homeScore = m.scores?.home || 0;
            const awayScore = m.scores?.away || 0;

            if (homeScore > awayScore) homeWins++;
            else if (homeScore < awayScore) awayWins++;
            else draws++;
        });

        const total = h2h.matches.length;
        return {
            homeWins,
            draws,
            awayWins,
            total,
            homePercent: Math.round((homeWins / total) * 100),
            drawPercent: Math.round((draws / total) * 100),
            awayPercent: Math.round((awayWins / total) * 100)
        };
    };

    const h2hStats = calculateH2H();

    // Generate prediction badges
    const predictionBadges = [];

    if (goalAnalysis?.home?.btts && parseInt(goalAnalysis.home.btts) > 70) {
        predictionBadges.push({ label: 'Alta Prob. BTTS', value: `${goalAnalysis.home.btts}%`, type: 'success' });
    }
    if (goalAnalysis?.home?.over25 && parseInt(goalAnalysis.home.over25) > 70) {
        predictionBadges.push({ label: 'Over 2.5 Gols', value: `${goalAnalysis.home.over25}%`, type: 'success' });
    }
    if (cornerAnalysis?.home?.trends?.over85 && parseInt(cornerAnalysis.home.trends.over85) > 70) {
        predictionBadges.push({ label: 'Over 8.5 Cantos', value: `${cornerAnalysis.home.trends.over85}%`, type: 'info' });
    }

    return (
        <div className={styles.sidebar}>
            {/* Prediction Badges */}
            {predictionBadges.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaChartLine /> Previsões
                    </h3>
                    <div className={styles.badges}>
                        {predictionBadges.map((badge, idx) => (
                            <div key={idx} className={`${styles.badge} ${styles[badge.type]}`}>
                                <span className={styles.badgeLabel}>{badge.label}</span>
                                <span className={styles.badgeValue}>{badge.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* H2H Widget */}
            {h2hStats.total > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaTrophy /> Confronto Direto
                    </h3>

                    {/* Dominance Bar */}
                    <div className={styles.h2hBar}>
                        {h2hStats.homePercent > 0 && (
                            <div
                                className={styles.h2hHome}
                                style={{ width: `${h2hStats.homePercent}%` }}
                            >
                                {h2hStats.homePercent}%
                            </div>
                        )}
                        {h2hStats.drawPercent > 0 && (
                            <div
                                className={styles.h2hDraw}
                                style={{ width: `${h2hStats.drawPercent}%` }}
                            >
                                {h2hStats.drawPercent}%
                            </div>
                        )}
                        {h2hStats.awayPercent > 0 && (
                            <div
                                className={styles.h2hAway}
                                style={{ width: `${h2hStats.awayPercent}%` }}
                            >
                                {h2hStats.awayPercent}%
                            </div>
                        )}
                    </div>

                    <p className={styles.h2hText}>
                        {h2hStats.homeWins > h2hStats.awayWins
                            ? `${matchInfo?.home_team?.name || 'Casa'} tem mais vitórias`
                            : h2hStats.awayWins > h2hStats.homeWins
                                ? `${matchInfo?.away_team?.name || 'Fora'} tem mais vitórias`
                                : 'Equilíbrio no confronto direto'
                        } ({h2hStats.homeWins}V, {h2hStats.draws}E, {h2hStats.awayWins}D em {h2hStats.total} jogos)
                    </p>
                </div>
            )}

            {/* Match History - Home */}
            {history?.home && history.home.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        Jogos Anteriores: {matchInfo?.home_team?.name || 'Casa'}
                    </h3>
                    <div className={styles.matchList}>
                        {history.home.slice(0, 5).map((m, idx) => (
                            <div key={idx} className={styles.matchItem}>
                                <div className={styles.matchInfo}>
                                    <span className={styles.matchDate}>
                                        {m.starting_at ? new Date(m.starting_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : ''}
                                    </span>
                                    <span className={styles.matchName}>{m.name || 'Jogo'}</span>
                                </div>
                                <div className={styles.matchStats}>
                                    {m.stats?.corners > 0 && (
                                        <span className={`${styles.statBadge} ${styles.corners}`}>
                                            {m.stats.corners}
                                        </span>
                                    )}
                                    {m.stats?.cards > 0 && (
                                        <span className={`${styles.statBadge} ${styles.cards}`}>
                                            {m.stats.cards}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trends Table */}
            {(goalAnalysis || cornerAnalysis) && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaFlag /> Tendências
                    </h3>
                    <div className={styles.trendsTable}>
                        <div className={styles.trendsHeader}>
                            <span>{matchInfo?.home_team?.short_name || 'Casa'}</span>
                            <span></span>
                            <span>{matchInfo?.away_team?.short_name || 'Fora'}</span>
                        </div>

                        {/* Goals */}
                        <div className={styles.trendsRow}>
                            <span className={styles.trendsValue}>{goalAnalysis?.home?.over25 || '0'}%</span>
                            <span className={styles.trendsLabel}>Over 2.5 Gols</span>
                            <span className={styles.trendsValue}>{goalAnalysis?.away?.over25 || '0'}%</span>
                        </div>

                        {/* Corners */}
                        <div className={styles.trendsRow}>
                            <span className={styles.trendsValue}>{cornerAnalysis?.home?.avgTotal || '0.0'}</span>
                            <span className={styles.trendsLabel}>Média Cantos</span>
                            <span className={styles.trendsValue}>{cornerAnalysis?.away?.avgTotal || '0.0'}</span>
                        </div>

                        <div className={styles.trendsRow}>
                            <span className={styles.trendsValue}>{cornerAnalysis?.home?.trends?.over85 || '0'}%</span>
                            <span className={styles.trendsLabel}>Over 8.5 Cantos</span>
                            <span className={styles.trendsValue}>{cornerAnalysis?.away?.trends?.over85 || '0'}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
