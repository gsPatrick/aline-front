'use client';
import { useState } from 'react';
import { FaFutbol, FaFlag, FaExchangeAlt } from 'react-icons/fa';
import styles from './EventsTab.module.css';

export default function EventsTab({ match }) {
    const [filter, setFilter] = useState('all'); // all, goals, corners, cards, goals_corners

    const events = match?.history?.home?.[0]?.events || [];
    const comments = match?.history?.home?.[0]?.comments || [];

    // Combine events and parse corners from comments
    const allEvents = [...events];

    // Parse corners from comments
    comments.forEach(comment => {
        if (comment.comment?.toLowerCase().includes('canto') ||
            comment.comment?.toLowerCase().includes('corner')) {
            allEvents.push({
                minute: comment.minute,
                type: { code: 'corner', name: 'Canto' },
                comment: comment.comment,
                is_important: comment.is_important
            });
        }
    });

    // Sort by minute
    allEvents.sort((a, b) => (a.minute || 0) - (b.minute || 0));

    const filterEvents = (events) => {
        if (filter === 'all') return events;
        if (filter === 'goals') return events.filter(e => e.type?.code === 'goal');
        if (filter === 'corners') return events.filter(e => e.type?.code === 'corner');
        if (filter === 'cards') return events.filter(e => e.type?.code === 'yellowcard' || e.type?.code === 'redcard');
        if (filter === 'goals_corners') return events.filter(e =>
            e.type?.code === 'goal' || e.type?.code === 'corner'
        );
        return events;
    };

    const filteredEvents = filterEvents(allEvents);

    const getEventIcon = (typeCode) => {
        switch (typeCode) {
            case 'goal': return '⚽';
            case 'corner': return '⛳';
            case 'yellowcard': return '🟨';
            case 'redcard': return '🟥';
            case 'substitution': return <FaExchangeAlt />;
            default: return '•';
        }
    };

    const getEventColor = (typeCode) => {
        switch (typeCode) {
            case 'goal': return styles.eventGoal;
            case 'corner': return styles.eventCorner;
            case 'yellowcard': return styles.eventYellow;
            case 'redcard': return styles.eventRed;
            case 'substitution': return styles.eventSub;
            default: return '';
        }
    };

    if (filteredEvents.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>📋 Nenhum evento disponível</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Filters */}
            <div className={styles.filters}>
                <button
                    className={`${styles.filterPill} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Todos
                </button>
                <button
                    className={`${styles.filterPill} ${filter === 'goals' ? styles.active : ''}`}
                    onClick={() => setFilter('goals')}
                >
                    Golos
                </button>
                <button
                    className={`${styles.filterPill} ${filter === 'corners' ? styles.active : ''}`}
                    onClick={() => setFilter('corners')}
                >
                    Cantos
                </button>
                <button
                    className={`${styles.filterPill} ${filter === 'cards' ? styles.active : ''}`}
                    onClick={() => setFilter('cards')}
                >
                    Cartões
                </button>
                <button
                    className={`${styles.filterPill} ${filter === 'goals_corners' ? styles.active : ''}`}
                    onClick={() => setFilter('goals_corners')}
                >
                    Gols+Cantos
                </button>
            </div>

            {/* Timeline */}
            <div className={styles.timeline}>
                {filteredEvents.map((event, idx) => {
                    const isHome = event.participant_id === match?.matchInfo?.home_team?.id;

                    return (
                        <div
                            key={idx}
                            className={`${styles.timelineItem} ${isHome ? styles.home : styles.away}`}
                        >
                            <div className={styles.minute}>
                                {event.minute}'
                                {event.extra_minute && <span className={styles.extraTime}>+{event.extra_minute}</span>}
                            </div>
                            <div className={styles.axis}>
                                <div className={`${styles.eventIcon} ${getEventColor(event.type?.code)}`}>
                                    {getEventIcon(event.type?.code)}
                                </div>
                            </div>
                            <div className={styles.eventContent}>
                                <span className={styles.eventType}>{event.type?.name || 'Evento'}</span>
                                {event.player_name && (
                                    <span className={styles.eventPlayer}>{event.player_name}</span>
                                )}
                                {event.related_player_name && (
                                    <span className={styles.eventRelated}>→ {event.related_player_name}</span>
                                )}
                                {event.result && (
                                    <span className={styles.eventResult}>{event.result}</span>
                                )}
                                {event.comment && (
                                    <span className={styles.eventComment}>{event.comment}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
