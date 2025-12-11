'use client';
import { useState } from 'react';
import styles from './SubViews.module.css'; // CSS Reutilizável para Nível 3
import { FaFutbol, FaFlag, FaSquare } from 'react-icons/fa';

export default function EventsView({ match }) {
    const [filter, setFilter] = useState('all');

    const filters = [
        { id: 'all', label: 'Todos' },
        { id: 'goals', label: 'Golos' },
        { id: 'corners', label: 'Cantos' },
        { id: 'goals_corners', label: 'Golos + Cantos' },
        { id: 'cards', label: 'Cartões' }
    ];

    // Lógica de filtro (adaptada do seu código anterior)
    const allEvents = match?.timeline || [];
    // OBS: Assumindo que match.timeline já tem os eventos processados.

    const filteredEvents = allEvents.filter(ev => {
        if (filter === 'all') return true;
        if (filter === 'goals') return ev.type === 'goal';
        if (filter === 'corners') return ev.type === 'corner';
        if (filter === 'cards') return ev.type === 'yellowcard' || ev.type === 'redcard';
        if (filter === 'goals_corners') return ev.type === 'goal' || ev.type === 'corner';
        return true;
    });

    return (
        <div className={styles.subContainer}>
            {/* Navegação Nível 3 (Pílulas) */}
            <div className={styles.filterBar}>
                {filters.map(f => (
                    <button
                        key={f.id}
                        className={`${styles.filterPill} ${filter === f.id ? styles.pillActive : ''}`}
                        onClick={() => setFilter(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista Vertical de Eventos */}
            <div className={styles.timelineList}>
                {filteredEvents.map((event, idx) => (
                    <div key={idx} className={styles.timelineRow}>
                        <div className={styles.timeCol}>{event.minute}'</div>
                        <div className={styles.iconCol}>
                            {event.type === 'goal' && <FaFutbol className={styles.iconGreen} />}
                            {event.type === 'corner' && <FaFlag className={styles.iconBlue} />}
                            {event.type === 'yellowcard' && <FaSquare className={styles.iconYellow} />}
                        </div>
                        <div className={styles.infoCol}>
                            <span className={styles.playerName}>{event.player_name || event.team_name}</span>
                            <span className={styles.eventType}>{event.result}</span>
                        </div>
                    </div>
                ))}
                {filteredEvents.length === 0 && <div className={styles.empty}>Sem eventos.</div>}
            </div>
        </div>
    );
}