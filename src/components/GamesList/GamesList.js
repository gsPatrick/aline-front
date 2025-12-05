'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IoChevronDown, IoStatsChart } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import styles from './GamesList.module.css';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { useDailyMatches } from '@/hooks/useDailyMatches'; // Importe o novo hook

import BookmakerFilter from '@/components/BookmakerFilter/BookmakerFilter';
import OddsWidget from '@/components/OddsWidget/OddsWidget';

// ... (O componente GameRow permanece IDÊNTICO ao que você já tem) ...
const GameRow = ({ game, selectedBookmaker }) => {
    // MANTENHA O CÓDIGO DO GAMEROW AQUI IGUAL AO ANTERIOR
    // Copie o GameRow do meu envio anterior para economizar espaço na resposta
    // ...
    const isLive = game.status?.id === 2 || ['LIVE', 'HT', 'ET', 'PEN', '1T', '2T'].includes(game.status?.short);
    const minuteDisplay = game.status?.short?.includes("'") ? game.status.short : (game.minute ? `${game.minute}'` : (game.status?.short === 'HT' ? 'INT' : '-'));
    const startTime = game.timestamp ? new Date(game.timestamp * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : "HOJE";
    const timeDisplay = isLive ? minuteDisplay : startTime;
    const home = game.home_team || {};
    const away = game.away_team || {};
    const pressureHome = game.pressure?.home || 0;
    const pressureAway = game.pressure?.away || 0;
    const totalPressure = pressureHome + pressureAway;
    const pressurePercent = totalPressure > 0 ? (pressureHome / totalPressure) * 100 : 50;
    let displayOdds = game.odds;

    return (
        <motion.div
            className={styles.gameRow}
            whileHover={{ scale: 1.01, borderColor: 'var(--color-primary)' }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <div className={styles.timeCol}>
                {isLive ? (
                    <span className={styles.livePill}><span className={styles.liveDot}></span>{timeDisplay}</span>
                ) : (
                    <span className={styles.scheduledTime}>{timeDisplay}</span>
                )}
            </div>
            <div className={styles.matchCol}>
                <div className={styles.teamRow}>
                    <Link href={`/team/${home.id}`} className={styles.teamLink}>
                        <div className={styles.teamInfo}>
                            {home.logo ? <img src={home.logo} className={styles.teamLogoSmall} /> : <span className={styles.logoPlaceholderSmall}>{home.name?.charAt(0)}</span>}
                            <span className={styles.teamName}>{home.name || "Casa"}</span>
                        </div>
                    </Link>
                    <div className={`${styles.scoreValue} ${isLive ? styles.scoreLive : ''}`}>{home.score ?? 0}</div>
                </div>

                <div className={styles.teamRow}>
                    <Link href={`/team/${away.id}`} className={styles.teamLink}>
                        <div className={styles.teamInfo}>
                            {away.logo ? <img src={away.logo} className={styles.teamLogoSmall} /> : <span className={styles.logoPlaceholderSmall}>{away.name?.charAt(0)}</span>}
                            <span className={styles.teamName}>{away.name || "Visitante"}</span>
                        </div>
                    </Link>
                    <div className={`${styles.scoreValue} ${isLive ? styles.scoreLive : ''}`}>{away.score ?? 0}</div>
                </div>
            </div>
            <div className={styles.statsCol}>
                <div className={styles.pressureWidget}>
                    <div className={styles.pressureLabel}>Pressão</div>
                    <div className={styles.pressureBarBg}><div className={styles.pressureFill} style={{ width: `${pressurePercent}%` }} /></div>
                </div>
            </div>
            <div className={styles.oddsCol}>
                <OddsWidget odds={displayOdds} />
            </div>
            <div className={styles.actionsCol}>
                <Link href={`/match/${game.id}`}>
                    <button className={styles.actionBtn}><IoStatsChart /></button>
                </Link>
            </div>
        </motion.div>
    );
};

// ADICIONE A PROP "type" AQUI
export default function GamesList({ type = 'live' }) {
    // Lógica condicional de hook
    const liveData = useLiveMatches();
    const dailyData = useDailyMatches();

    const { matches, loading, error } = type === 'live' ? liveData : dailyData;

    const [selectedBookmaker, setSelectedBookmaker] = useState(2);

    const matchesByLeague = useMemo(() => {
        const groups = {};
        if (!Array.isArray(matches)) return [];

        matches.forEach(match => {
            const leagueId = match.league?.id || "world";
            const leagueName = match.league?.name || "Outros Jogos";
            const leagueFlag = match.league?.logo || null;
            const country = match.league?.country || "";

            if (!groups[leagueId]) {
                groups[leagueId] = {
                    id: leagueId,
                    name: leagueName,
                    country: country,
                    flag: leagueFlag,
                    games: []
                };
            }
            groups[leagueId].games.push(match);
        });
        return Object.values(groups);
    }, [matches]);

    const [openLeagues, setOpenLeagues] = useState({});

    useMemo(() => {
        if (Object.keys(openLeagues).length === 0 && matchesByLeague.length > 0) {
            const initialOpen = {};
            matchesByLeague.forEach(l => initialOpen[l.id] = true);
            setOpenLeagues(initialOpen);
        }
    }, [matchesByLeague]);

    const toggleLeague = (id) => {
        setOpenLeagues(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.logoLoader}>
                <div className={styles.loaderRing}></div>
                <img src="/logo.png" alt="Carregando..." className={styles.logoImg} />
            </div>
            <span>Carregando jogos {type === 'live' ? 'ao vivo' : 'do dia'}...</span>
        </div>
    );

    if (error) return <div className={styles.errorContainer}>Erro ao carregar dados.</div>;

    if (matches.length === 0) return (
        <div className={styles.emptyContainer}>
            {type === 'live' ? 'Nenhum jogo ao vivo no momento.' : 'Nenhum jogo encontrado para hoje.'}
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className={styles.gamesContainer}>

            <BookmakerFilter
                selected={selectedBookmaker}
                onSelect={setSelectedBookmaker}
            />

            {matchesByLeague.map((league) => (
                <motion.div
                    key={league.id}
                    className={styles.leagueGroup}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <header className={styles.leagueHeader} onClick={() => toggleLeague(league.id)}>
                        <div className={styles.leagueInfo}>
                            {league.flag ? (
                                <img src={league.flag} alt={league.name} className={styles.leagueFlagImg} />
                            ) : (
                                <span className={styles.leaguePlaceholderIcon}>🏆</span>
                            )}
                            <div className={styles.leagueTexts}>
                                <h2 className={styles.leagueName}>{league.name}</h2>
                                {league.country && <span className={styles.countryName}>{league.country}</span>}
                            </div>
                        </div>
                        <IoChevronDown className={`${styles.chevron} ${openLeagues[league.id] ? styles.open : ''}`} />
                    </header>

                    <AnimatePresence>
                        {openLeagues[league.id] && (
                            <motion.div
                                className={styles.gameList}
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                            >
                                {league.games.map((game) => (
                                    <motion.div key={game.id} variants={itemVariants}>
                                        <GameRow
                                            game={game}
                                            selectedBookmaker={selectedBookmaker}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    )
}