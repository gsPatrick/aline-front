'use client';
import { useState } from 'react';
import styles from './TeamDashboard.module.css';
import { FaFutbol, FaFlag, FaChartBar, FaCalendarAlt } from 'react-icons/fa';

export default function TeamDashboard({ stats, matches, nextMatch, upcomingMatches, teamInfo }) {
    const [activeTab, setActiveTab] = useState('previous'); // 'previous' or 'next'
    const [statsScope, setStatsScope] = useState('last10'); // 'last10' or 'all'

    // Helper para Form Bubbles
    const getFormBubble = (result) => {
        let className = styles.bubble;
        if (result === 'W') className += ` ${styles.W}`;
        else if (result === 'D') className += ` ${styles.D}`;
        else className += ` ${styles.L}`;
        return <div className={className}>{result}</div>;
    };

    // Helper para Odds (Mock se não vier da API)
    const getOdds = () => {
        if (nextMatch?.odds && nextMatch.odds.length > 0) {
            // Tenta pegar odds de 1x2
            const matchWinner = nextMatch.odds.find(o => o.id === 1 || o.name === "3Way Result");
            if (matchWinner && matchWinner.bookmaker && matchWinner.bookmaker.length > 0) {
                const odds = matchWinner.bookmaker[0].odds;
                return {
                    home: odds.find(o => o.label === "1")?.value || "-",
                    draw: odds.find(o => o.label === "X")?.value || "-",
                    away: odds.find(o => o.label === "2")?.value || "-"
                };
            }
        }
        return { home: "1.95", draw: "3.40", away: "3.80" }; // Fallback/Mock
    };

    const odds = getOdds();

    // --- CÁLCULO DE ESTATÍSTICAS REAIS ---
    const calculateStats = (matchList) => {
        if (!matchList || matchList.length === 0) return {
            avgGoals: 0, wins: 0, draws: 0, losses: 0, goalsConceded: 0, corners: 0, form: [], winsPct: 0, goalsConcededAvg: 0, cornersAvg: 0
        };

        let wins = 0, draws = 0, losses = 0;
        let goalsScored = 0, goalsConceded = 0;
        let cornersTotal = 0;
        let form = [];

        matchList.forEach(m => {
            const isHome = m.home_team.id === teamInfo?.id;
            const myScore = isHome ? m.home_team.score : m.away_team.score;
            const oppScore = isHome ? m.away_team.score : m.home_team.score;

            goalsScored += myScore;
            goalsConceded += oppScore;
            cornersTotal += (m.stats?.corners?.home || 0) + (m.stats?.corners?.away || 0); // Total do jogo

            if (myScore > oppScore) { wins++; form.push('W'); }
            else if (myScore === oppScore) { draws++; form.push('D'); }
            else { losses++; form.push('L'); }
        });

        return {
            avgGoals: (goalsScored / matchList.length).toFixed(1),
            winsPct: Math.round((wins / matchList.length) * 100),
            goalsConcededAvg: (goalsConceded / matchList.length).toFixed(1),
            cornersAvg: (cornersTotal / matchList.length).toFixed(1),
            wins, draws, losses,
            form
        };
    };

    const computedStats = calculateStats(matches);

    // --- AGRUPAMENTO POR COMPETIÇÃO (Forma) ---
    const getCompetitionsForm = () => {
        if (!matches) return [];
        const comps = {};
        matches.forEach(m => {
            const lid = m.league?.id;
            if (!lid) return;
            if (!comps[lid]) comps[lid] = { name: m.league.name, logo: m.league.logo, form: [] };

            const isHome = m.home_team.id === teamInfo?.id;
            const myScore = isHome ? m.home_team.score : m.away_team.score;
            const oppScore = isHome ? m.away_team.score : m.home_team.score;

            if (myScore > oppScore) comps[lid].form.push('W');
            else if (myScore === oppScore) comps[lid].form.push('D');
            else comps[lid].form.push('L');
        });
        return Object.values(comps);
    };

    const competitions = getCompetitionsForm();
    const currentList = activeTab === 'previous' ? matches : upcomingMatches;

    return (
        <div className={styles.dashboardContainer}>

            {/* --- LEFT COLUMN --- */}
            <div className={styles.leftColumn}>

                {/* 1. Next Match Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Próximo Jogo</h3>
                    </div>

                    {nextMatch ? (
                        <div className={styles.nextMatchCard}>
                            <div className={styles.leagueHeader}>
                                <img src={nextMatch.league?.logo} alt="League" className={styles.leagueIcon} />
                                <span>{nextMatch.league?.name}</span>
                            </div>

                            <div className={styles.matchVersus}>
                                <div className={styles.teamInfo}>
                                    <img src={nextMatch.home_team?.logo} alt="Home" className={styles.teamLogo} />
                                    <div className={styles.teamName}>{nextMatch.home_team?.name}</div>
                                </div>

                                <div className={styles.vsInfo}>
                                    <span className={styles.vsText}>VS.</span>
                                    <span className={styles.matchDate}>
                                        {new Date(nextMatch.timestamp * 1000).toLocaleDateString()}
                                    </span>
                                    <span className={styles.matchDate}>
                                        {new Date(nextMatch.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div className={styles.teamInfo}>
                                    <img src={nextMatch.away_team?.logo} alt="Away" className={styles.teamLogo} />
                                    <div className={styles.teamName}>{nextMatch.away_team?.name}</div>
                                </div>
                            </div>

                            <div className={styles.oddsContainer}>
                                <div className={styles.oddBox}>{odds.home}</div>
                                <div className={styles.oddBox}>{odds.draw}</div>
                                <div className={styles.oddBox}>{odds.away}</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#888' }}>Sem jogos agendados</div>
                    )}
                </div>

                {/* 2. Competitions Widget */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Competições</h3>
                    </div>
                    <div className={styles.competitionsList}>
                        {competitions.length > 0 ? competitions.map((comp, idx) => (
                            <div key={idx} className={styles.competitionItem}>
                                <div className={styles.compInfo}>
                                    {comp.logo ? <img src={comp.logo} className={styles.compLogo} alt="" /> : <FaFutbol color="#aaa" />}
                                    <span className={styles.compName}>{comp.name}</span>
                                </div>
                                <div className={styles.formBubbles}>
                                    {comp.form.slice(0, 5).map((r, i) => <div key={i}>{getFormBubble(r)}</div>)}
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>Sem dados de competição</div>
                        )}
                    </div>
                </div>

            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className={styles.rightColumn}>

                {/* 3. Team Stats Summary */}
                <div className={styles.card}>
                    <div className={styles.statsHeader}>
                        {teamInfo?.image_path && <img src={teamInfo.image_path} className={styles.mainTeamLogo} alt="Team" />}
                        <div className={styles.teamTitle}>
                            <h2>{teamInfo?.name || "Time"}</h2>
                            <span>{teamInfo?.country || "País"}</span>
                        </div>

                        <div className={styles.formBubbles} style={{ marginLeft: 'auto' }}>
                            {computedStats.form.slice(0, 5).map((r, i) => <div key={i}>{getFormBubble(r)}</div>)}
                        </div>
                    </div>

                    <div className={styles.statsToggle}>
                        <div
                            className={`${styles.toggleOption} ${statsScope === 'last10' ? styles.active : ''}`}
                            onClick={() => setStatsScope('last10')}
                        >
                            Últimos 10 jogos
                        </div>
                        <div
                            className={`${styles.toggleOption} ${statsScope === 'all' ? styles.active : ''}`}
                            onClick={() => setStatsScope('all')}
                        >
                            Todos os jogos
                        </div>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statBox}>
                            <div className={styles.statValue}>{computedStats.avgGoals}</div>
                            <div className={styles.statLabel}>Média Gols</div>
                        </div>
                        <div className={styles.statBox}>
                            <div className={styles.statValue}>{computedStats.winsPct}%</div>
                            <div className={styles.statLabel}>Vitórias</div>
                        </div>
                        <div className={styles.statBox}>
                            <div className={styles.statValue}>{computedStats.goalsConcededAvg}</div>
                            <div className={styles.statLabel}>Gols Sofridos</div>
                        </div>
                        <div className={styles.statBox}>
                            <div className={styles.statValue}>{computedStats.cornersAvg}</div>
                            <div className={styles.statLabel}>Cantos/Jogo</div>
                        </div>
                    </div>

                    {/* W/D/L Summary Bar */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
                        <div className={`${styles.scoreBadge} ${styles.win}`} style={{ minWidth: '60px' }}>V: {computedStats.wins}</div>
                        <div className={`${styles.scoreBadge} ${styles.draw}`} style={{ minWidth: '60px' }}>E: {computedStats.draws}</div>
                        <div className={`${styles.scoreBadge} ${styles.loss}`} style={{ minWidth: '60px' }}>D: {computedStats.losses}</div>
                    </div>
                </div>

                {/* 4. Matches Table */}
                <div className={styles.card}>
                    <div className={styles.matchesTabs}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'previous' ? styles.active : ''}`}
                            onClick={() => setActiveTab('previous')}
                        >
                            Jogos Anteriores
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'next' ? styles.active : ''}`}
                            onClick={() => setActiveTab('next')}
                        >
                            Próximos Jogos
                        </button>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Oponente</th>
                                    <th>Placar</th>
                                    <th>Cantos</th>
                                    <th>Cartões</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentList && currentList.map((m) => {
                                    const isHome = m.home_team.id === teamInfo?.id;
                                    const score = activeTab === 'previous' ? `${m.home_team.score} - ${m.away_team.score}` : 'vs';

                                    let resultClass = '';
                                    if (activeTab === 'previous') {
                                        if (m.home_team.score > m.away_team.score) resultClass = isHome ? styles.win : styles.loss;
                                        else if (m.away_team.score > m.home_team.score) resultClass = isHome ? styles.loss : styles.win;
                                        else resultClass = styles.draw;
                                    } else {
                                        resultClass = styles.draw; // Neutro para próximos jogos
                                    }

                                    return (
                                        <tr key={m.id}>
                                            <td>{new Date(m.timestamp * 1000).toLocaleDateString()}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <img src={isHome ? m.away_team.logo : m.home_team.logo} width="20" alt="" />
                                                    {isHome ? m.away_team.name : m.home_team.name}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`${styles.scoreBadge} ${resultClass}`}>{score}</span>
                                            </td>
                                            <td>
                                                <div className={styles.statCell}>
                                                    <FaFlag className={styles.statIcon} />
                                                    {activeTab === 'previous' ? (m.stats?.corners?.home + m.stats?.corners?.away || '-') : '-'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.statCell}>
                                                    <div style={{ width: '10px', height: '14px', background: '#ffcc00', borderRadius: '2px' }}></div>
                                                    {activeTab === 'previous' ? (m.stats?.yellow_cards?.home + m.stats?.yellow_cards?.away || '-') : '-'}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {(!currentList || currentList.length === 0) && (
                                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhum jogo encontrado.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
