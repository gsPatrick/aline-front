'use client';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from './TopPlayersTable.module.css';

export default function TopPlayersTable({ players }) {
    const [showAll, setShowAll] = useState(false);

    if (!players || players.length === 0) {
        return (
            <div className={styles.card}>
                <h3 className={styles.title}>Top de Jogadores</h3>
                <div className={styles.noData}>
                    <p>Sem dados de jogadores</p>
                </div>
            </div>
        );
    }

    // Sort by rating and take top players
    const sortedPlayers = [...players]
        .filter(p => p.rating && p.rating > 0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));

    const displayPlayers = showAll ? sortedPlayers : sortedPlayers.slice(0, 10);

    // Get rating color based on value
    const getRatingColor = (rating) => {
        if (rating >= 8) return 'excellent';
        if (rating >= 7) return 'good';
        if (rating >= 6) return 'average';
        return 'poor';
    };

    // Get position abbreviation
    const getPosition = (position) => {
        if (!position) return '-';
        const pos = position.toLowerCase();
        if (pos.includes('attack') || pos.includes('forward') || pos.includes('striker')) return 'A';
        if (pos.includes('mid')) return 'M';
        if (pos.includes('defend') || pos.includes('back')) return 'D';
        if (pos.includes('goal')) return 'G';
        return position.charAt(0).toUpperCase();
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Top de Jogadores</h3>

            <div className={styles.table}>
                {displayPlayers.map((player, idx) => (
                    <div key={player.id || idx} className={styles.row}>
                        <span className={styles.number}>{player.jersey_number || idx + 1}</span>
                        <div className={styles.playerInfo}>
                            <span className={styles.name}>{player.name}</span>
                            <span className={styles.position}>({getPosition(player.position)})</span>
                        </div>
                        <span className={`${styles.rating} ${styles[getRatingColor(player.rating)]}`}>
                            {player.rating?.toFixed(2) || '-'}
                        </span>
                    </div>
                ))}
            </div>

            {sortedPlayers.length > 10 && (
                <button
                    className={styles.showMore}
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? 'Mostrar Menos' : 'Mostrar Mais Jogadores'}
                    <FaChevronDown className={showAll ? styles.rotated : ''} />
                </button>
            )}
        </div>
    );
}
