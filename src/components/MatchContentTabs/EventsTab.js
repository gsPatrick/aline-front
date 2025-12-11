'use client';
import { useState } from 'react';
import { FaFutbol, FaFlag, FaSquare, FaExchangeAlt } from 'react-icons/fa';
import styles from './EventsTab.module.css';

// DADOS MOCKADOS IGUAIS À IMAGEM
const mockEvents = [
    { id: 1, minute: 65, type: 'goal', team: 'home', player: 'Cristian Renato', result: '3-2' }, // Assumindo resultado acumulado
    { id: 2, minute: 59, type: 'goal', team: 'away', player: 'Guilherme Gomes', result: '2-2' },
    { type: 'interval', score: '2-2' }, // Marcador especial
    { id: 3, minute: 41, type: 'goal', team: 'home', player: 'Alesson', result: '2-1' },
    { id: 4, minute: 31, type: 'goal', team: 'away', player: 'Guilherme Gomes', result: '1-1' },
    { id: 5, minute: 13, type: 'goal', team: 'home', player: 'Chico Kim', result: '1-0' },
    { id: 6, minute: 8, type: 'goal', team: 'away', player: 'Telles', result: '0-1' },
];

export default function EventsTab({ match }) {
    const [activeFilter, setActiveFilter] = useState('all'); // Default to 'all' to show goals/cards immediately

    const filters = [
        { id: 'all', label: 'Todos' },
        { id: 'goals', label: 'Golos' },
        { id: 'corners', label: 'Cantos' },
        { id: 'goals_corners', label: 'Golos + Cantos' },
        { id: 'cards', label: 'Cartões' },
    ];

    // Helper to format player name
    const getPlayerName = (event) => {
        return event.player_name || event.player?.common_name || event.player?.name || "Desconhecido";
    };

    // Helper to get result string
    const getResult = (event) => {
        return event.result || "";
    };

    const getFilteredEvents = () => {
        const events = match.events || [];

        // Map API types to internal types
        // API Types: 'Goal', 'Yellowcard', 'Redcard', 'Substitution', 'Corner'
        // Need to be case-insensitive usually.

        let filtered = events.map(e => {
            const typeName = e.type?.name || e.type || "";
            const t = String(typeName).toLowerCase();
            let type = 'unknown';

            if (t.includes('goal') && !t.includes('missed') && !t.includes('saved')) type = 'goal';
            else if (t.includes('yellowcard') || t.includes('yellow card')) type = 'yellowcard';
            else if (t.includes('redcard') || t.includes('red card')) type = 'redcard';
            else if (t.includes('corner')) type = 'corner';
            else if (t.includes('substitution')) type = 'sub';

            // Determine team with loose check
            const isHome = e.participant_id == match.homeTeam?.id;

            return {
                id: e.id,
                minute: e.minute,
                type: type,
                team: isHome ? 'home' : 'away',
                player: getPlayerName(e),
                result: getResult(e),
                participant_id: e.participant_id
            };
        });

        // Filter based on active tab
        if (activeFilter === 'goals') {
            filtered = filtered.filter(e => e.type === 'goal');
        } else if (activeFilter === 'corners') {
            filtered = filtered.filter(e => e.type === 'corner');
        } else if (activeFilter === 'cards') {
            filtered = filtered.filter(e => e.type === 'yellowcard' || e.type === 'redcard');
        } else if (activeFilter === 'goals_corners') {
            filtered = filtered.filter(e => e.type === 'goal' || e.type === 'corner');
        }

        // Sort by minute descending (latest first)
        return filtered.sort((a, b) => b.minute - a.minute);
    };

    const eventsToRender = getFilteredEvents();

    const getIcon = (type) => {
        switch (type) {
            case 'goal': return <FaFutbol />;
            case 'corner': return <FaFlag />;
            case 'yellowcard': return <FaSquare style={{ color: '#ffc107' }} />;
            case 'redcard': return <FaSquare style={{ color: '#ff3547' }} />;
            case 'sub': return <FaExchangeAlt />;
            default: return <FaFutbol />; // Fallback
        }
    };

    const info = match.matchInfo || {};

    // Check if we have stats but no events (typical for Corners in some leagues)
    const hasCornerStats = (match.analysis?.detailedStats?.corners?.home + match.analysis?.detailedStats?.corners?.away) > 0;
    const isCornerFilter = activeFilter === 'corners';

    return (
        <div className={styles.container}>

            {/* 1. Filtros (Pills) */}
            <div className={styles.filtersWrapper}>
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* 2. Cabeçalho do Resultado (Mirassol vs Flamengo) */}
            <div className={styles.matchStatusHeader}>
                <div className={styles.teamSide}>
                    {match?.homeTeam?.logo && <img src={match.homeTeam.logo} alt="Home" className={styles.logo} />}
                    <span className={styles.teamName}>{match?.homeTeam?.name || 'Home'}</span>
                </div>

                <div className={styles.scoreCenter}>
                    <span className={styles.statusLabel}>{info.state === 'FT' ? 'Terminado' : (info.state === 'LIVE' ? 'Ao Vivo' : info.state)}</span>
                    <span className={styles.finalScore}>{info.score || 'VS'}</span>
                </div>

                <div className={styles.teamSideRight}>
                    <span className={styles.teamName}>{match?.awayTeam?.name || 'Away'}</span>
                    {match?.awayTeam?.logo && <img src={match.awayTeam.logo} alt="Away" className={styles.logo} />}
                </div>
            </div>

            {/* 3. Timeline Lista */}
            <div className={styles.timelineList}>
                {eventsToRender.map((event, idx) => {
                    // Handling for event with participant_id (Standard)
                    const isHome = event.participant_id == match.homeTeam?.id;
                    const isAway = event.participant_id == match.awayTeam?.id;

                    // Fallback for comment-based events (no ID)
                    // If no ID, we center it or try to parse text? 
                    // For now, if no ID, render centered "Neutral" style or just assume Home if it's the only option?
                    // Actually, centered row is best for "Unknown Team" events.
                    const isNeutral = !isHome && !isAway;

                    return (
                        <div key={event.id || idx} className={styles.eventRow}>
                            {/* Lado Casa */}
                            <div className={`${styles.side} ${styles.homeSide}`}>
                                {isHome && (
                                    <>
                                        <span className={styles.minute}>{event.minute}'</span>
                                        <span className={`${styles.icon} ${styles.iconHome}`}>
                                            {getIcon(event.type)}
                                        </span>
                                        <span className={styles.player}>{event.player}</span>
                                    </>
                                )}
                            </div>

                            {/* Center/Neutral Event (e.g. Comment Corner) */}
                            {isNeutral && (
                                <div className={styles.neutralSide}>
                                    <span className={styles.minute}>{event.minute}'</span>
                                    {getIcon(event.type)}
                                    <span>{event.comment || 'Evento'}</span>
                                </div>
                            )}

                            {/* Lado Fora */}
                            <div className={`${styles.side} ${styles.awaySide}`}>
                                {isAway && (
                                    <>
                                        <span className={styles.player}>{event.player}</span>
                                        <span className={`${styles.icon} ${styles.iconAway}`}>
                                            {getIcon(event.type)}
                                        </span>
                                        <span className={styles.minute}>{event.minute}'</span>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}

                {eventsToRender.length === 0 && (
                    <div className={styles.emptyState}>
                        {isCornerFilter && hasCornerStats
                            ? "A cronologia de cantos não está disponível para este jogo (apenas estatísticas totais)."
                            : "Nenhum evento encontrado para este filtro."}
                    </div>
                )}
            </div>
        </div>
    );
}