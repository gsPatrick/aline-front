'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCircle, FaFutbol, FaFlag } from 'react-icons/fa';
import styles from './LiveMatchCard.module.css';

export default function LiveMatchCard({ match, teamId }) {
    const [pulse, setPulse] = useState(false);

    // Pulse animation for live indicator
    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(prev => !prev);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!match) return null;

    // Check if match is actually live
    const liveStatuses = ['LIVE', 'HT', '1H', '2H', 'ET', 'BT', 'PT'];
    const status = match.status?.short || match.state?.short || '';

    if (!liveStatuses.includes(status)) return null;

    const homeScore = match.home_team?.score ?? 0;
    const awayScore = match.away_team?.score ?? 0;
    const isHome = Number(match.home_team?.id) === Number(teamId);

    // Get current minute
    const minute = match.minute || match.time?.minute || '?';

    // Get stats
    const homeCorners = match.corners?.home ?? match.statistics?.find(s => s.type === 'Corners' && s.team === 'home')?.value ?? 0;
    const awayCorners = match.corners?.away ?? match.statistics?.find(s => s.type === 'Corners' && s.team === 'away')?.value ?? 0;

    return (
        <div className={styles.card}>
            {/* Live Header */}
            <div className={styles.header}>
                <div className={styles.liveIndicator}>
                    <FaCircle className={`${styles.liveDot} ${pulse ? styles.pulse : ''}`} />
                    <span className={styles.liveText}>AO VIVO</span>
                </div>
                <span className={styles.minute}>{minute}'</span>
            </div>

            {/* Match Content */}
            <Link href={`/match/${match.id}`} className={styles.matchLink}>
                <div className={styles.matchContent}>
                    {/* Home Team */}
                    <div className={styles.teamSide}>
                        {match.home_team?.logo && (
                            <img src={match.home_team.logo} alt="" className={styles.teamLogo} />
                        )}
                        <span className={`${styles.teamName} ${isHome ? styles.highlighted : ''}`}>
                            {match.home_team?.name}
                        </span>
                    </div>

                    {/* Score */}
                    <div className={styles.scoreBox}>
                        <span className={styles.score}>{homeScore}</span>
                        <span className={styles.scoreDash}>-</span>
                        <span className={styles.score}>{awayScore}</span>
                    </div>

                    {/* Away Team */}
                    <div className={styles.teamSide}>
                        {match.away_team?.logo && (
                            <img src={match.away_team.logo} alt="" className={styles.teamLogo} />
                        )}
                        <span className={`${styles.teamName} ${!isHome ? styles.highlighted : ''}`}>
                            {match.away_team?.name}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Quick Stats */}
            <div className={styles.quickStats}>
                <div className={styles.statItem}>
                    <FaFutbol className={styles.statIcon} />
                    <span>{homeScore} - {awayScore}</span>
                </div>
                <div className={styles.statItem}>
                    <FaFlag className={styles.statIcon} />
                    <span>{homeCorners} - {awayCorners}</span>
                </div>
                {match.league?.name && (
                    <span className={styles.leagueBadge}>{match.league.name}</span>
                )}
            </div>
        </div>
    );
}
