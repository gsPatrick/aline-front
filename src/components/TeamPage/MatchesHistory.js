'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaFutbol, FaFlag, FaSquare, FaHome, FaPlane, FaChevronDown } from 'react-icons/fa';
import styles from './MatchesHistory.module.css';

export default function MatchesHistory({ matches, teamId, title = "Jogos" }) {
    const [activeTab, setActiveTab] = useState('previous'); // 'previous' | 'upcoming'
    const [sortOrder, setSortOrder] = useState('recent'); // 'recent' | 'oldest'
    const [countFilter, setCountFilter] = useState('10'); // '10' | 'all'
    const [locationFilter, setLocationFilter] = useState('all'); // 'all' | 'home' | 'away'
    const [leagueFilter, setLeagueFilter] = useState('all'); // 'all' | leagueId
    const [showLeagueDropdown, setShowLeagueDropdown] = useState(false);

    if (!matches || (matches.previous?.length === 0 && matches.upcoming?.length === 0)) {
        return (
            <div className={styles.card}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.noData}>
                    <p>Sem jogos disponíveis</p>
                </div>
            </div>
        );
    }

    const previousMatches = matches.previous || [];
    const upcomingMatches = matches.upcoming || [];
    const teamIdNum = Number(teamId);

    // Extract unique leagues
    const allMatches = [...previousMatches, ...upcomingMatches];
    const leaguesMap = {};
    allMatches.forEach(m => {
        if (m.league?.id && m.league?.name) {
            leaguesMap[m.league.id] = {
                id: m.league.id,
                name: m.league.name,
                logo: m.league.logo
            };
        }
    });
    const leagues = Object.values(leaguesMap);

    // Get source list based on active tab
    const sourceMatches = activeTab === 'previous' ? previousMatches : upcomingMatches;

    // Apply filters step by step
    let filteredMatches = [...sourceMatches];

    // 1. Filter by league
    if (leagueFilter !== 'all') {
        filteredMatches = filteredMatches.filter(match =>
            String(match.league?.id) === String(leagueFilter)
        );
    }

    // 2. Filter by location (home/away)
    if (locationFilter !== 'all') {
        filteredMatches = filteredMatches.filter(match => {
            const isHome = Number(match.home_team?.id) === teamIdNum || match.isHome === true;
            return locationFilter === 'home' ? isHome : !isHome;
        });
    }

    // 3. Sort (only for previous matches)
    if (activeTab === 'previous') {
        if (sortOrder === 'oldest') {
            filteredMatches = [...filteredMatches].reverse();
        }

        // 4. Apply count filter (only for previous matches)
        if (countFilter === '10') {
            filteredMatches = filteredMatches.slice(0, 10);
        }
    }

    const selectedLeague = leagues.find(l => String(l.id) === String(leagueFilter));

    const getResult = (match) => {
        // Use result directly if available
        if (match.result) return match.result;

        const isHome = Number(match.home_team?.id) === teamIdNum;
        const homeScore = match.home_team?.score ?? 0;
        const awayScore = match.away_team?.score ?? 0;

        if (homeScore === awayScore) return 'E';
        if (isHome) return homeScore > awayScore ? 'V' : 'D';
        return awayScore > homeScore ? 'V' : 'D';
    };

    const formatDate = (match) => {
        const date = match.date || match.starting_at;
        const timestamp = date ? new Date(date) : new Date(match.timestamp * 1000);
        return timestamp.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    const getMatchStats = (match) => {
        const isHome = Number(match.home_team?.id) === teamIdNum || match.isHome === true;
        const homeCorners = match.corners?.home ?? 0;
        const awayCorners = match.corners?.away ?? 0;

        return {
            goals: isHome ? (match.home_team?.score ?? 0) : (match.away_team?.score ?? 0),
            goalsConceded: isHome ? (match.away_team?.score ?? 0) : (match.home_team?.score ?? 0),
            cornersTotal: match.corners?.total ?? (homeCorners + awayCorners),
            cornersTeam: isHome ? homeCorners : awayCorners,
            yellowCards: match.cards?.yellow?.[isHome ? 'home' : 'away'] ?? 0,
            redCards: match.cards?.red?.[isHome ? 'home' : 'away'] ?? 0
        };
    };

    const totalMatches = activeTab === 'previous'
        ? (locationFilter !== 'all'
            ? sourceMatches.filter(m => {
                const isHome = Number(m.home_team?.id) === teamIdNum || m.isHome === true;
                return locationFilter === 'home' ? isHome : !isHome;
            }).length
            : sourceMatches.length)
        : sourceMatches.length;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'previous' ? styles.active : ''}`}
                        onClick={() => setActiveTab('previous')}
                    >
                        Jogos Anteriores
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'upcoming' ? styles.active : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Próximos Jogos
                    </button>
                </div>
            </div>

            {/* Filter Row */}
            <div className={styles.filterRow}>
                {/* League Filter Dropdown */}
                {leagues.length > 1 && (
                    <div className={styles.leagueDropdown}>
                        <button
                            className={styles.dropdownTrigger}
                            onClick={() => setShowLeagueDropdown(!showLeagueDropdown)}
                        >
                            {selectedLeague ? (
                                <>
                                    {selectedLeague.logo && (
                                        <img src={selectedLeague.logo} alt="" className={styles.dropdownLogo} />
                                    )}
                                    <span>{selectedLeague.name}</span>
                                </>
                            ) : (
                                <span>Todas as Ligas</span>
                            )}
                            <FaChevronDown className={styles.dropdownIcon} />
                        </button>

                        {showLeagueDropdown && (
                            <div className={styles.dropdownMenu}>
                                <button
                                    className={`${styles.dropdownItem} ${leagueFilter === 'all' ? styles.active : ''}`}
                                    onClick={() => { setLeagueFilter('all'); setShowLeagueDropdown(false); }}
                                >
                                    Todas as Ligas
                                </button>
                                {leagues.map(league => (
                                    <button
                                        key={league.id}
                                        className={`${styles.dropdownItem} ${String(leagueFilter) === String(league.id) ? styles.active : ''}`}
                                        onClick={() => { setLeagueFilter(league.id); setShowLeagueDropdown(false); }}
                                    >
                                        {league.logo && (
                                            <img src={league.logo} alt="" className={styles.dropdownLogo} />
                                        )}
                                        <span>{league.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Count Filter - Only for previous matches */}
                {activeTab === 'previous' && (
                    <div className={styles.filterGroup}>
                        <button
                            className={`${styles.filterBtn} ${countFilter === '10' ? styles.active : ''}`}
                            onClick={() => setCountFilter('10')}
                        >
                            Últimos 10
                        </button>
                        <button
                            className={`${styles.filterBtn} ${countFilter === 'all' ? styles.active : ''}`}
                            onClick={() => setCountFilter('all')}
                        >
                            Todos
                        </button>
                    </div>
                )}

                {/* Location Filter - Always visible */}
                <div className={styles.filterGroup}>
                    <button
                        className={`${styles.filterBtn} ${locationFilter === 'all' ? styles.active : ''}`}
                        onClick={() => setLocationFilter('all')}
                    >
                        Geral
                    </button>
                    <button
                        className={`${styles.filterBtn} ${styles.homeBtn} ${locationFilter === 'home' ? styles.active : ''}`}
                        onClick={() => setLocationFilter('home')}
                    >
                        <FaHome /> Casa
                    </button>
                    <button
                        className={`${styles.filterBtn} ${styles.awayBtn} ${locationFilter === 'away' ? styles.active : ''}`}
                        onClick={() => setLocationFilter('away')}
                    >
                        <FaPlane /> Fora
                    </button>
                </div>

                {/* Sort Buttons - Only for previous matches */}
                {activeTab === 'previous' && (
                    <div className={styles.filterGroup}>
                        <button
                            className={`${styles.sortBtn} ${sortOrder === 'oldest' ? styles.active : ''}`}
                            onClick={() => setSortOrder('oldest')}
                        >
                            Mais antigo
                        </button>
                        <button
                            className={`${styles.sortBtn} ${sortOrder === 'recent' ? styles.active : ''}`}
                            onClick={() => setSortOrder('recent')}
                        >
                            Mais recente
                        </button>
                    </div>
                )}
            </div>

            {/* Table Header */}
            <div className={styles.tableHeader}>
                <div className={styles.colGame}>JOGO</div>
                <div className={styles.colResult}></div>
                <div className={styles.colStat} title="Gols"><FaFutbol /></div>
                <div className={styles.colStat} title="Cantos"><FaFlag /></div>
                <div className={styles.colStat} title="Cartões Amarelos"><FaSquare className={styles.yellowCard} /></div>
                <div className={styles.colStat} title="Cartões Vermelhos"><FaSquare className={styles.redCard} /></div>
            </div>

            {/* Match List */}
            <div className={styles.matchList}>
                {filteredMatches.length === 0 ? (
                    <div className={styles.noMatches}>
                        Nenhum jogo encontrado com os filtros selecionados
                    </div>
                ) : (
                    filteredMatches.map((match) => {
                        const result = activeTab === 'previous' ? getResult(match) : null;
                        const stats = activeTab === 'previous' ? getMatchStats(match) : null;
                        const isHome = Number(match.home_team?.id) === teamIdNum || match.isHome === true;

                        return (
                            <Link href={`/match/${match.id}`} key={match.id} className={styles.matchLink}>
                                <div className={styles.matchRow}>
                                    {/* Date and League */}
                                    <div className={styles.matchInfo}>
                                        <span className={styles.date}>{formatDate(match)}</span>
                                        <div className={styles.badgeRow}>
                                            <span className={`${styles.locationBadge} ${isHome ? styles.homeBadge : styles.awayBadge}`}>
                                                {isHome ? 'Cas' : 'For'}
                                            </span>
                                            {match.league?.logo && (
                                                <img src={match.league.logo} alt="" className={styles.leagueLogo} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Teams with Logos */}
                                    <div className={styles.teamsCol}>
                                        <div className={styles.teamRow}>
                                            {match.home_team?.logo && (
                                                <img src={match.home_team.logo} alt="" className={styles.teamLogo} />
                                            )}
                                            <span className={`${styles.teamName} ${Number(match.home_team?.id) === teamIdNum ? styles.highlighted : ''}`}>
                                                {match.home_team?.name}
                                            </span>
                                        </div>
                                        <div className={styles.teamRow}>
                                            {match.away_team?.logo && (
                                                <img src={match.away_team.logo} alt="" className={styles.teamLogo} />
                                            )}
                                            <span className={`${styles.teamName} ${Number(match.away_team?.id) === teamIdNum ? styles.highlighted : ''}`}>
                                                {match.away_team?.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Result Badge */}
                                    <div className={styles.colResult}>
                                        {result && (
                                            <span className={`${styles.resultBadge} ${styles[`result${result}`]}`}>
                                                {result}
                                            </span>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    {stats ? (
                                        <>
                                            <div className={styles.colStat}>
                                                <span className={styles.statMain}>{stats.goals}</span>
                                                <span className={styles.statSub}>({stats.goalsConceded})</span>
                                            </div>
                                            <div className={styles.colStat}>
                                                <span className={styles.statMain}>{stats.cornersTeam}</span>
                                                <span className={styles.statSub}>({stats.cornersTotal - stats.cornersTeam})</span>
                                            </div>
                                            <div className={styles.colStat}>
                                                <span className={styles.statValue}>{stats.yellowCards}</span>
                                            </div>
                                            <div className={styles.colStat}>
                                                <span className={styles.statValue}>{stats.redCards}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={styles.colStat}>-</div>
                                            <div className={styles.colStat}>-</div>
                                            <div className={styles.colStat}>-</div>
                                            <div className={styles.colStat}>-</div>
                                        </>
                                    )}
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Match Count */}
            <div className={styles.matchCount}>
                Exibindo {filteredMatches.length} de {totalMatches} jogos
            </div>
        </div>
    );
}
