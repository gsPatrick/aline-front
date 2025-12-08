'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useLeagueDetails } from '@/hooks/useLeagueDetails';
import { FaSpinner, FaExclamationTriangle, FaTrophy, FaShieldAlt, FaStar, FaFrown } from 'react-icons/fa';
import styles from './page.module.css';

export default function LeagueDetailsPage() {
    const params = useParams();
    const leagueId = params?.id;
    const { data, loading, error } = useLeagueDetails(leagueId);

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.contentLayout}>
                    <Sidebar />
                    <main className={styles.mainContent}>
                        <div className={styles.loadingScreen}>
                            <FaSpinner className={styles.spinner} />
                            <p>Carregando detalhes da liga...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.contentLayout}>
                    <Sidebar />
                    <main className={styles.mainContent}>
                        <div className={styles.errorScreen}>
                            <FaExclamationTriangle size={48} className={styles.errorIcon} />
                            <h1>Liga não encontrada</h1>
                            <p>{error || 'Verifique o ID da liga'}</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const { leagueInfo, leagueInsights, currentRound, standings, topPlayers, teamStatsTable } = data;

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <div className={styles.contentLayout}>
                <Sidebar />
                <main className={styles.mainContent}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={styles.container}
                    >
                        {/* League Header */}
                        <header className={styles.leagueHeader}>
                            <img src={leagueInfo.logo} alt={leagueInfo.name} className={styles.leagueLogo} />
                            <div className={styles.leagueHeaderInfo}>
                                <h1 className={styles.leagueName}>{leagueInfo.name}</h1>
                                <div className={styles.leagueMeta}>
                                    <img src={leagueInfo.country_flag} alt={leagueInfo.country} className={styles.countryFlag} />
                                    <span>{leagueInfo.country}</span>
                                    <span className={styles.separator}>•</span>
                                    <span>{leagueInfo.season}</span>
                                </div>
                            </div>
                        </header>

                        {/* League Insights Cards */}
                        {leagueInsights && (
                            <div className={styles.insightsGrid}>
                                <InsightCard
                                    icon={FaTrophy}
                                    title="Melhor Ataque"
                                    team={leagueInsights.bestAttack.team}
                                    value={`${leagueInsights.bestAttack.value} gols`}
                                    color="green"
                                />
                                <InsightCard
                                    icon={FaShieldAlt}
                                    title="Melhor Defesa"
                                    team={leagueInsights.bestDefense.team}
                                    value={`${leagueInsights.bestDefense.value} gols sofridos`}
                                    color="blue"
                                />
                                <InsightCard
                                    icon={FaStar}
                                    title="Mais Vitórias"
                                    team={leagueInsights.mostWins.team}
                                    value={`${leagueInsights.mostWins.value} vitórias`}
                                    color="green"
                                />
                                <InsightCard
                                    icon={FaFrown}
                                    title="Mais Derrotas"
                                    team={leagueInsights.mostLosses.team}
                                    value={`${leagueInsights.mostLosses.value} derrotas`}
                                    color="red"
                                />
                            </div>
                        )}

                        {/* Current Round Fixtures */}
                        {currentRound && currentRound.fixtures && currentRound.fixtures.length > 0 && (
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>{currentRound.name}</h2>
                                <div className={styles.fixturesGrid}>
                                    {currentRound.fixtures.map(fixture => (
                                        <FixtureCard key={fixture.id} fixture={fixture} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Standings Table */}
                        {standings && standings.length > 0 && (
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Classificação</h2>
                                <StandingsTable standings={standings} />
                            </section>
                        )}

                        {/* Top Players */}
                        {topPlayers && (
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Destaques</h2>
                                <div className={styles.topPlayersGrid}>
                                    <TopPlayersList title="Artilheiros" players={topPlayers.scorers} stat="goals" />
                                    <TopPlayersList title="Assistências" players={topPlayers.assists} stat="assists" />
                                    <TopPlayersList title="Avaliação" players={topPlayers.ratings} stat="rating" />
                                </div>
                            </section>
                        )}

                        {/* Team Stats Table */}
                        {teamStatsTable && teamStatsTable.length > 0 && (
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Estatísticas Detalhadas</h2>
                                <TeamStatsTable stats={teamStatsTable} />
                            </section>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}

// Insight Card Component
function InsightCard({ icon: Icon, title, team, value, color }) {
    const colorClass = color === 'green' ? styles.cardGreen : color === 'blue' ? styles.cardBlue : styles.cardRed;

    return (
        <div className={`${styles.insightCard} ${colorClass}`}>
            <Icon className={styles.insightIcon} />
            <div className={styles.insightContent}>
                <span className={styles.insightTitle}>{title}</span>
                <span className={styles.insightTeam}>{team}</span>
                <span className={styles.insightValue}>{value}</span>
            </div>
        </div>
    );
}

// Fixture Card Component
function FixtureCard({ fixture }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'LIVE': return styles.statusLive;
            case 'HT': return styles.statusHT;
            case 'FT': return styles.statusFT;
            default: return styles.statusNS;
        }
    };

    return (
        <Link href={`/match/${fixture.id}`} className={styles.fixtureCard}>
            <div className={styles.fixtureTeams}>
                <div className={styles.fixtureTeam}>
                    <img src={fixture.home_team.logo} alt={fixture.home_team.name} className={styles.teamLogo} />
                    <span className={styles.teamName}>{fixture.home_team.name}</span>
                </div>
                <div className={styles.fixtureScore}>
                    <span className={styles.score}>{fixture.score || 'vs'}</span>
                    <span className={`${styles.status} ${getStatusColor(fixture.status)}`}>{fixture.status}</span>
                </div>
                <div className={styles.fixtureTeam}>
                    <span className={styles.teamName}>{fixture.away_team.name}</span>
                    <img src={fixture.away_team.logo} alt={fixture.away_team.name} className={styles.teamLogo} />
                </div>
            </div>
            <div className={styles.fixtureTime}>
                {new Date(fixture.starting_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </div>
        </Link>
    );
}

// Standings Table Component
function StandingsTable({ standings }) {
    const getStatusColor = (status) => {
        if (status?.includes('Champions League')) return styles.zoneChampions;
        if (status?.includes('Europa League')) return styles.zoneEuropa;
        if (status?.includes('Relegation')) return styles.zoneRelegation;
        return '';
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.standingsTable}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Time</th>
                        <th>P</th>
                        <th>J</th>
                        <th>V</th>
                        <th>E</th>
                        <th>D</th>
                        <th>GP</th>
                        <th>GC</th>
                        <th>SG</th>
                        <th>Pts</th>
                        <th>Forma</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map(team => {
                        const [gf, gc] = team.stats.goals.split(':');
                        const sg = parseInt(gf) - parseInt(gc);

                        return (
                            <tr key={team.position} className={getStatusColor(team.status)}>
                                <td className={styles.position}>{team.position}</td>
                                <td className={styles.teamCell}>
                                    <img src={team.team_logo} alt={team.team_name} className={styles.teamLogoSmall} />
                                    <span>{team.team_name}</span>
                                </td>
                                <td>{team.stats.p}</td>
                                <td>{team.stats.p}</td>
                                <td>{team.stats.w}</td>
                                <td>{team.stats.d}</td>
                                <td>{team.stats.l}</td>
                                <td>{gf}</td>
                                <td>{gc}</td>
                                <td>{sg > 0 ? `+${sg}` : sg}</td>
                                <td className={styles.points}>{team.points}</td>
                                <td><FormIndicator form={team.form} /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// Form Indicator Component
function FormIndicator({ form }) {
    if (!form) return null;

    const results = form.split('-');

    return (
        <div className={styles.formContainer}>
            {results.map((result, i) => (
                <span key={i} className={`${styles.formBadge} ${styles[`form${result}`]}`}>
                    {result}
                </span>
            ))}
        </div>
    );
}

// Top Players List Component
function TopPlayersList({ title, players, stat }) {
    if (!players || players.length === 0) return null;

    return (
        <div className={styles.topPlayersCard}>
            <h3 className={styles.topPlayersTitle}>{title}</h3>
            <div className={styles.playersList}>
                {players.map((player, idx) => (
                    <div key={idx} className={styles.playerItem}>
                        <div className={styles.playerRank}>{idx + 1}</div>
                        <img src={player.team_logo} alt={player.team_name} className={styles.playerTeamLogo} />
                        <div className={styles.playerInfo}>
                            <span className={styles.playerName}>{player.player_name}</span>
                            <span className={styles.playerTeam}>{player.team_name}</span>
                        </div>
                        <span className={styles.playerStat}>{player[stat]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Team Stats Table Component
function TeamStatsTable({ stats }) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.statsTable}>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Over 0.5 HT</th>
                        <th>Over 2.5 FT</th>
                        <th>BTTS</th>
                        <th>Média Gols</th>
                        <th>Média Cantos</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((team, idx) => (
                        <tr key={idx}>
                            <td className={styles.teamCell}>
                                <img src={team.team_logo} alt={team.team} className={styles.teamLogoSmall} />
                                <span>{team.team}</span>
                            </td>
                            <td>{team.over05HT}%</td>
                            <td>{team.over25FT}%</td>
                            <td>{team.btts}%</td>
                            <td>{team.avgGoals}</td>
                            <td>{team.avgCorners}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}