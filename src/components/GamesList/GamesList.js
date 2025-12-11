'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import styles from './GamesList.module.css';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { useDailyMatches } from '@/hooks/useDailyMatches';

// Match Row Component
const MatchRow = ({ game }) => {
    const isLive = game.status?.id === 2 || ['LIVE', 'HT', 'ET', 'PEN', '1T', '2T'].includes(game.status?.short);
    const startTime = game.timestamp
        ? new Date(game.timestamp * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : "--:--";

    const home = game.home_team || {};
    const away = game.away_team || {};

    return (
        <div className={styles.matchRow}>
            {/* Teams Column */}
            <div className={styles.teamsCol}>
                <Link href={`/team/${home.id}`} className={styles.teamLine}>
                    {home.logo && <img src={home.logo} alt="" className={styles.teamLogo} />}
                    <span className={styles.teamName}>{home.name || "Time Casa"}</span>
                </Link>
                <Link href={`/team/${away.id}`} className={styles.teamLine}>
                    {away.logo && <img src={away.logo} alt="" className={styles.teamLogo} />}
                    <span className={styles.teamName}>{away.name || "Time Fora"}</span>
                </Link>
            </div>

            {/* Score or Time */}
            <div className={styles.scoreCol}>
                {isLive ? (
                    <div className={styles.liveScore}>
                        <span className={styles.score}>{home.score ?? 0}</span>
                        <span className={styles.scoreSep}>-</span>
                        <span className={styles.score}>{away.score ?? 0}</span>
                    </div>
                ) : (
                    <span className={styles.matchTime}>{startTime}</span>
                )}
            </div>

            {/* Actions */}
            <div className={styles.actionsCol}>
                <Link href={`/match/${game.id}`} className={styles.viewBtn}>
                    <FaEye />
                    <span>Ver Jogo</span>
                </Link>
            </div>
        </div>
    );
};

// Main Component
export default function GamesList({ type = 'live', selectedDate = null }) {
    const liveData = useLiveMatches();
    const dailyData = useDailyMatches(selectedDate);

    const { matches, loading, error } = type === 'live' ? liveData : dailyData;
    const [openLeagues, setOpenLeagues] = useState({});

    // Group matches by league
    const matchesByLeague = useMemo(() => {
        if (!Array.isArray(matches)) return [];

        return matches.map(leagueGroup => ({
            id: leagueGroup.league_id,
            name: leagueGroup.league_name,
            logo: leagueGroup.league_logo,
            country: leagueGroup.country_name,
            flag: leagueGroup.country_flag,
            games: leagueGroup.fixtures || []
        }));
    }, [matches]);

    // Open all leagues by default
    useEffect(() => {
        if (matchesByLeague.length > 0 && Object.keys(openLeagues).length === 0) {
            const initial = {};
            matchesByLeague.forEach(l => initial[l.id] = true);
            setOpenLeagues(initial);
        }
    }, [matchesByLeague]);

    const toggleLeague = (id) => {
        setOpenLeagues(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <div className={styles.spinner} />
                <span>Carregando jogos...</span>
            </div>
        );
    }

    if (error) {
        return <div className={styles.errorState}>Erro ao carregar jogos.</div>;
    }

    if (matchesByLeague.length === 0) {
        return (
            <div className={styles.emptyState}>
                {type === 'live'
                    ? 'Nenhum jogo ao vivo no momento.'
                    : 'Nenhum jogo encontrado para esta data.'}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {matchesByLeague.map((league) => (
                <div key={league.id} className={styles.leagueGroup}>
                    {/* League Header */}
                    <div
                        className={styles.leagueHeader}
                        onClick={() => toggleLeague(league.id)}
                    >
                        <div className={styles.leagueInfo}>
                            {league.logo ? (
                                <img src={league.logo} alt="" className={styles.leagueLogo} />
                            ) : league.flag ? (
                                <img src={league.flag} alt="" className={styles.leagueLogo} />
                            ) : (
                                <span className={styles.leaguePlaceholder}>⚽</span>
                            )}
                            <span className={styles.leagueName}>{league.name}</span>
                            {league.country && (
                                <span className={styles.countryBadge}>{league.country}</span>
                            )}
                        </div>
                        <div className={styles.headerRight}>
                            <span className={styles.matchCount}>{league.games.length} jogos</span>
                            {openLeagues[league.id] ? <IoChevronUp /> : <IoChevronDown />}
                        </div>
                    </div>

                    {/* Matches */}
                    <AnimatePresence>
                        {openLeagues[league.id] && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className={styles.matchesList}
                            >
                                {league.games.map((game) => (
                                    <MatchRow key={game.id} game={game} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}