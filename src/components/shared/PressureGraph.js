'use client';
import { useState, useMemo } from 'react';
import { FaFutbol, FaExchangeAlt } from 'react-icons/fa';
import { GiCardPlay } from 'react-icons/gi';
import styles from './PressureGraph.module.css';

export default function PressureGraph({
    timeline = [],
    events = [],
    homeTeam,
    awayTeam,
    period = 'fulltime', // fulltime, ht, st
    maxMinute = 90
}) {
    // Filter timeline based on period
    const filteredTimeline = useMemo(() => {
        if (!timeline || timeline.length === 0) return [];

        let startMin = 0;
        let endMin = 90;

        if (period === 'ht') {
            endMin = 45;
        } else if (period === 'st') {
            startMin = 46;
        }

        return timeline.filter(t => t.minute >= startMin && t.minute <= Math.min(endMin, maxMinute));
    }, [timeline, period, maxMinute]);

    // Filter events based on period
    const filteredEvents = useMemo(() => {
        if (!events || events.length === 0) return [];

        let startMin = 0;
        let endMin = 90;

        if (period === 'ht') {
            endMin = 45;
        } else if (period === 'st') {
            startMin = 46;
        }

        return events.filter(e => {
            const min = e.minute || 0;
            return min >= startMin && min <= Math.min(endMin, maxMinute);
        });
    }, [events, period, maxMinute]);

    // Get event icon and position
    const getEventIcon = (event) => {
        const type = event.type?.name?.toLowerCase() || '';

        if (type.includes('goal')) {
            return <FaFutbol className={styles.eventIcon} />;
        }
        if (type.includes('card')) {
            return <GiCardPlay className={`${styles.eventIcon} ${type.includes('yellow') ? styles.yellowCard : styles.redCard}`} />;
        }
        if (type.includes('substitution')) {
            return <FaExchangeAlt className={styles.eventIcon} />;
        }
        return null;
    };

    // Calculate pressure bars
    const renderBars = () => {
        if (filteredTimeline.length === 0) {
            return <div className={styles.noData}>Dados de pressão não disponíveis</div>;
        }

        const maxPressure = Math.max(
            ...filteredTimeline.map(t => Math.max(t.home?.pressure || 0, t.away?.pressure || 0)),
            1
        );

        return filteredTimeline.map((point, idx) => {
            const homePressure = point.home?.pressure || 0;
            const awayPressure = point.away?.pressure || 0;

            // Normalize to percentage (0-50% for each side)
            const homeHeight = (homePressure / maxPressure) * 45;
            const awayHeight = (awayPressure / maxPressure) * 45;

            return (
                <div key={point.minute} className={styles.barContainer}>
                    {/* Home bar (above center) */}
                    <div
                        className={`${styles.bar} ${styles.homeBar}`}
                        style={{ height: `${homeHeight}%` }}
                        title={`${homeTeam?.name || 'Casa'}: ${homePressure}`}
                    />
                    {/* Away bar (below center) */}
                    <div
                        className={`${styles.bar} ${styles.awayBar}`}
                        style={{ height: `${awayHeight}%` }}
                        title={`${awayTeam?.name || 'Fora'}: ${awayPressure}`}
                    />
                </div>
            );
        });
    };

    // Render event markers
    const renderEvents = () => {
        const startMin = period === 'st' ? 46 : 0;
        const totalMin = period === 'ht' ? 45 : (period === 'st' ? 45 : 90);

        return filteredEvents.map((event, idx) => {
            const icon = getEventIcon(event);
            if (!icon) return null;

            const minute = event.minute || 0;
            const position = ((minute - startMin) / totalMin) * 100;
            const isHome = event.participant_id === homeTeam?.id;

            return (
                <div
                    key={`${event.id || idx}`}
                    className={`${styles.eventMarker} ${isHome ? styles.eventHome : styles.eventAway}`}
                    style={{ left: `${position}%` }}
                    title={`${minute}' - ${event.type?.name || 'Evento'}`}
                >
                    {icon}
                </div>
            );
        });
    };

    // Render minute labels
    const renderLabels = () => {
        const startMin = period === 'st' ? 45 : 0;
        const endMin = period === 'ht' ? 45 : 90;
        const step = 15;

        const labels = [];
        for (let m = startMin; m <= endMin; m += step) {
            labels.push(
                <span key={m} className={styles.minuteLabel}>{m}</span>
            );
        }
        return labels;
    };

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>Gráfico de Pressão</h4>

            {/* Events row (above) */}
            <div className={styles.eventsRow}>
                {renderEvents()}
            </div>

            {/* Pressure bars */}
            <div className={styles.graphArea}>
                <div className={styles.barsWrapper}>
                    {renderBars()}
                </div>
                <div className={styles.centerLine} />
            </div>

            {/* Minute labels */}
            <div className={styles.labelsRow}>
                {renderLabels()}
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendColor} ${styles.homeColor}`} />
                    <span>{homeTeam?.name || 'Casa'}</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendColor} ${styles.awayColor}`} />
                    <span>{awayTeam?.name || 'Fora'}</span>
                </div>
            </div>
        </div>
    );
}
