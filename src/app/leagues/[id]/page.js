'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react'; // Add imports
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useLeagueDetails } from '@/hooks/useLeagueDetails';
import { leagueService } from '@/lib/api'; // Import service
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import {
    LeagueStandingsTable,
    TeamStatisticsTable,
    LeagueGeneralStats,
    LeagueFixtures,
    TeamOfWeek
} from '@/components/LeaguePage';
import styles from './page.module.css';

export default function LeagueDetailsPage() {
    const params = useParams();
    const leagueId = params?.id;
    const { data, loading, error } = useLeagueDetails(leagueId);

    // State for round filter
    const [selectedRoundId, setSelectedRoundId] = useState(null);
    const [fixtures, setFixtures] = useState([]);
    const [loadingFixtures, setLoadingFixtures] = useState(false);

    // Initial load effect
    useEffect(() => {
        if (data && data.currentRoundId) {
            setSelectedRoundId(data.currentRoundId);
            setFixtures(data.currentRound || []);
        }
    }, [data]);

    const handleRoundChange = async (roundId) => {
        try {
            setSelectedRoundId(roundId);
            setLoadingFixtures(true);
            const newFixtures = await leagueService.getRoundFixtures(leagueId, roundId);
            setFixtures(newFixtures || []);
        } catch (err) {
            console.error("Error fetching round fixtures:", err);
        } finally {
            setLoadingFixtures(false);
        }
    };

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

    const { leagueInfo, standings, currentRound, rounds, topPlayers, teamOfWeek, leagueStats, teamStatsTable } = data;

    // Prepare standings data for new component
    const standingsData = standings?.map(team => ({
        id: team.team_id,
        name: team.team_name,
        logo: team.team_logo,
        points: team.points,
        won: team.stats?.w || 0,
        draw: team.stats?.d || 0,
        lost: team.stats?.l || 0,
        goals_for: parseInt(team.stats?.goals?.split(':')[0] || 0),
        goals_against: parseInt(team.stats?.goals?.split(':')[1] || 0),
        form: team.form,
        home: team.home,
        away: team.away,
    })) || [];

    // Map TOTW players - API returns array directly or {players: []} as fallback
    let teamOfWeekPlayers = [];
    const totwData = Array.isArray(teamOfWeek) ? teamOfWeek : teamOfWeek?.players || [];

    if (totwData.length > 0) {
        teamOfWeekPlayers = totwData.map(item => ({
            player_name: item.player?.common_name || item.player?.name || item.player_name,
            team_logo: item.team?.image_path || item.team_logo,
            team_name: item.team?.name || item.team_name,
            rating: item.rating,
            jersey_number: item.formation_position || item.player?.jersey_number || 0,
            position: item.formation_position,
            image_path: item.player?.image_path,
            type: 'totw'
        }));
    } else {
        // Fallback to Top Players if TOTW not available
        teamOfWeekPlayers = topPlayers?.ratings?.map(p => ({
            player_name: p.player_name,
            team_logo: p.team_logo,
            team_name: p.team_name,
            rating: p.rating,
            jersey_number: 0
        })).slice(0, 11) || [];
    }

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <div className={styles.contentLayout}>
                <Sidebar />
                <main className={styles.mainContent}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={styles.container}
                    >
                        {/* League Header */}
                        <header className={styles.leagueHeader}>
                            {leagueInfo?.logo && (
                                <img src={leagueInfo.logo} alt={leagueInfo.name} className={styles.leagueLogo} />
                            )}
                            <div className={styles.leagueHeaderInfo}>
                                <h1 className={styles.leagueName}>{leagueInfo?.name}</h1>
                                <div className={styles.leagueMeta}>
                                    {leagueInfo?.country_flag && (
                                        <img src={leagueInfo.country_flag} alt="" className={styles.countryFlag} />
                                    )}
                                    <span>{leagueInfo?.country}</span>
                                    <span className={styles.separator}>•</span>
                                    <span>{leagueInfo?.season}</span>
                                </div>
                            </div>
                        </header>

                        {/* Two Column Layout */}
                        <div className={styles.twoColumnLayout}>
                            {/* Left Sidebar */}
                            <div className={styles.leftColumn}>
                                {/* Fixtures */}
                                <LeagueFixtures
                                    fixtures={fixtures}
                                    rounds={rounds || []}
                                    selectedRoundId={selectedRoundId}
                                    onRoundChange={handleRoundChange}
                                    loading={loadingFixtures}
                                />

                                {/* Team of the Week */}
                                <TeamOfWeek
                                    players={teamOfWeekPlayers}
                                    round={currentRound?.name || 'Jornada Atual'}
                                />

                                {/* Top Players - Only showing scorers now as pure ratings might be redundant with TOTW */}
                                {topPlayers && (
                                    <div className={styles.topPlayersSection}>
                                        <h3 className={styles.sideTitle}>JOGADORES EM DESTAQUE</h3>
                                        <div className={styles.topPlayersGrid}>
                                            <div className={styles.topPlayersList}>
                                                <span className={styles.listTitle}>Top Golos</span>
                                                {topPlayers.scorers?.slice(0, 5).map((p, i) => (
                                                    <div key={i} className={styles.topPlayerItem}>
                                                        <span className={styles.rank}>{i + 1}.</span>
                                                        {p.team_logo && <img src={p.team_logo} alt="" className={styles.miniLogo} />}
                                                        <span className={styles.pName}>{p.player_name}</span>
                                                        <span className={styles.pStat}>{p.goals}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Main Content */}
                            <div className={styles.rightColumn}>
                                {/* Standings Table */}
                                <LeagueStandingsTable standings={standingsData} />

                                {/* League General Stats */}
                                <LeagueGeneralStats
                                    stats={leagueStats || {}}
                                    teams={standingsData}
                                    loading={!leagueStats}
                                />

                                {/* Team Statistics Table */}
                                <TeamStatisticsTable
                                    teams={teamStatsTable?.map(t => ({
                                        id: t.team_id,
                                        name: t.team,
                                        logo: t.team_logo,
                                        stats: {
                                            over05ht: t.over05ht || 0,
                                            over05ft: t.over05ft || 0,
                                            over15ft: t.over15ft || 0,
                                            over25ft: t.over25ft || 0,
                                            btts: t.btts || 0,
                                            cleanSheet: t.cleanSheet || 0,
                                            failedToScore: t.failedToScore || 0,
                                            avgFor: t.avgGoals,
                                            avgAgainst: t.avgAgainst,
                                            avgTotal: t.avgTotal,
                                            // Corner stats
                                            over75corners: t.over75corners || 0,
                                            over85corners: t.over85corners || 0,
                                            over95corners: t.over95corners || 0,
                                            over105corners: t.over105corners || 0,
                                            avgCorners: t.avgCorners || 0,
                                        },
                                        homeStats: t.homeStats || {},
                                        awayStats: t.awayStats || {}
                                    })) || []}
                                />
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}