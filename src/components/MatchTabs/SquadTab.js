'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFutbol, FaHandsHelping, FaStar } from 'react-icons/fa';
import styles from './SquadTab.module.css';

export default function SquadTab({ homeSquad, awaySquad, homeTeamName, awayTeamName }) {
    const [activeTeam, setActiveTeam] = useState('home');

    const currentSquad = activeTeam === 'home' ? homeSquad : awaySquad;
    const currentTeamName = activeTeam === 'home' ? homeTeamName : awayTeamName;

    if (!currentSquad || currentSquad.length === 0) {
        return <div className={styles.emptyState}>Escalação não disponível</div>;
    }

    const getRatingColor = (rating) => {
        const r = parseFloat(rating);
        if (r >= 7.0) return styles.ratingHigh;
        if (r >= 6.0) return styles.ratingMedium;
        return styles.ratingLow;
    };

    return (
        <div className={styles.container}>
            {/* Team Toggle */}
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

            {/* Squad Grid */}
            <motion.div
                key={activeTeam}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={styles.squadGrid}
            >
                {currentSquad.map((player, idx) => (
                    <motion.div
                        key={player.id || idx}
                        className={styles.playerCard}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        {/* Player Photo */}
                        <div className={styles.photoContainer}>
                            <img
                                src={player.image_path || player.photo || '/api/placeholder/100/100'}
                                alt={player.name}
                                className={styles.playerPhoto}
                                onError={(e) => e.target.src = '/api/placeholder/100/100'}
                            />
                            {player.rating && (
                                <div className={`${styles.ratingBadge} ${getRatingColor(player.rating)}`}>
                                    {parseFloat(player.rating).toFixed(1)}
                                </div>
                            )}
                        </div>

                        {/* Player Info */}
                        <div className={styles.playerInfo}>
                            <div className={styles.playerName}>
                                {player.name || player.common_name || 'Unknown'}
                            </div>
                            <div className={styles.playerPosition}>
                                {player.position?.name || player.position || 'N/A'}
                            </div>
                        </div>

                        {/* Player Stats */}
                        <div className={styles.playerStats}>
                            {player.goals > 0 && (
                                <div className={styles.statBadge}>
                                    <FaFutbol className={styles.statIcon} />
                                    {player.goals}
                                </div>
                            )}
                            {player.assists > 0 && (
                                <div className={styles.statBadge}>
                                    <FaHandsHelping className={styles.statIcon} />
                                    {player.assists}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
