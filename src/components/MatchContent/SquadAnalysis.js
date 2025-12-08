'use client';
import { useState } from 'react';
import { FaUsers, FaStar, FaFutbol, FaHandsHelping } from 'react-icons/fa';
import styles from './SquadAnalysis.module.css';

export default function SquadAnalysis({ homeSquad, awaySquad, homeTeamName, awayTeamName }) {
    const [activeTeam, setActiveTeam] = useState('home');

    if (!homeSquad && !awaySquad) {
        return (
            <div className={styles.emptyState}>
                <FaUsers className={styles.emptyIcon} />
                <p>Dados do elenco não disponíveis</p>
            </div>
        );
    }

    const currentSquad = activeTeam === 'home' ? homeSquad : awaySquad;
    const currentTeamName = activeTeam === 'home' ? homeTeamName : awayTeamName;

    if (!currentSquad || !currentSquad.hasData) {
        return (
            <div className={styles.container}>
                <div className={styles.teamToggle}>
                    <button
                        className={`${styles.toggleBtn} ${activeTeam === 'home' ? styles.active : ''}`}
                        onClick={() => setActiveTeam('home')}
                    >
                        {homeTeamName}
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${activeTeam === 'away' ? styles.active : ''}`}
                        onClick={() => setActiveTeam('away')}
                    >
                        {awayTeamName}
                    </button>
                </div>
                <div className={styles.noDataCard}>
                    <FaUsers className={styles.noDataIcon} />
                    <p>Dados do elenco não disponíveis para {currentTeamName}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.teamToggle}>
                <button
                    className={`${styles.toggleBtn} ${activeTeam === 'home' ? styles.active : ''}`}
                    onClick={() => setActiveTeam('home')}
                >
                    {homeTeamName}
                </button>
                <button
                    className={`${styles.toggleBtn} ${activeTeam === 'away' ? styles.active : ''}`}
                    onClick={() => setActiveTeam('away')}
                >
                    {awayTeamName}
                </button>
            </div>

            <div className={styles.squadHeader}>
                <h3 className={styles.squadTitle}>
                    <FaUsers className={styles.titleIcon} />
                    Elenco - {currentTeamName}
                </h3>
                <div className={styles.squadCount}>
                    {currentSquad.players?.length || 0} jogadores
                </div>
            </div>

            <div className={styles.playersGrid}>
                {currentSquad.players?.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
}

function PlayerCard({ player }) {
    const getRatingColor = (rating) => {
        const r = parseFloat(rating);
        if (r >= 7.5) return '#00ff88';
        if (r >= 6.0) return '#ffaa00';
        return '#ff3366';
    };

    const rating = player.rating ? parseFloat(player.rating) : null;

    return (
        <div className={styles.playerCard}>
            <div className={styles.playerImageContainer}>
                <img
                    src={player.photo || '/api/placeholder/80/80'}
                    alt={player.name}
                    className={styles.playerImage}
                    onError={(e) => e.target.src = '/api/placeholder/80/80'}
                />
                {rating && (
                    <div
                        className={styles.ratingBadge}
                        style={{ background: getRatingColor(rating) }}
                    >
                        <FaStar className={styles.ratingIcon} />
                        {rating.toFixed(1)}
                    </div>
                )}
            </div>

            <div className={styles.playerInfo}>
                <div className={styles.playerName}>{player.name}</div>
                <div className={styles.playerPosition}>{player.position || 'Jogador'}</div>
            </div>

            <div className={styles.playerStats}>
                {player.goals > 0 && (
                    <div className={styles.statBadge}>
                        <FaFutbol className={styles.statIcon} />
                        <span>{player.goals}</span>
                    </div>
                )}
                {player.assists > 0 && (
                    <div className={`${styles.statBadge} ${styles.assists}`}>
                        <FaHandsHelping className={styles.statIcon} />
                        <span>{player.assists}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
