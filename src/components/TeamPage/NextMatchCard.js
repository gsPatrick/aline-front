'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChartBar, FaBell, FaStar, FaClock } from 'react-icons/fa';
import styles from './NextMatchCard.module.css';

export default function NextMatchCard({ match, teamId }) {
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        if (!match) return;

        const matchDate = match.starting_at ? new Date(match.starting_at) : new Date(match.timestamp * 1000);

        const updateCountdown = () => {
            const now = new Date();
            const diff = matchDate.getTime() - now.getTime();

            if (diff <= 0) {
                setCountdown('Jogo em andamento');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) {
                setCountdown(`${days}d ${hours}h ${minutes}m`);
            } else if (hours > 0) {
                setCountdown(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setCountdown(`${minutes}m ${seconds}s`);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [match]);

    if (!match) {
        return (
            <div className={styles.card}>
                <h3 className={styles.title}>Próximo Jogo</h3>
                <div className={styles.content}>
                    <div className={styles.noData}>
                        <FaClock className={styles.noDataIcon} />
                        <p>Sem jogos agendados</p>
                    </div>
                </div>
            </div>
        );
    }

    const dateObj = match.starting_at ? new Date(match.starting_at) : new Date(match.timestamp * 1000);
    const dateStr = dateObj.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
    const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <h3 className={styles.title}>Próximo Jogo</h3>
                <div className={styles.countdown}>
                    <FaClock className={styles.clockIcon} />
                    <span>{countdown}</span>
                </div>
            </div>

            <div className={styles.content}>
                {/* League Header */}
                <div className={styles.leagueRow}>
                    {match.league?.logo && (
                        <img src={match.league.logo} alt="" className={styles.leagueLogo} />
                    )}
                    <span className={styles.leagueName}>{match.league?.name || 'Liga'}</span>
                    <div className={styles.actions}>
                        <button className={styles.actionBtn} title="Alerta">
                            <FaBell />
                        </button>
                    </div>
                </div>

                {/* Match Preview */}
                <Link href={`/match/${match.id}`} className={styles.matchLink}>
                    <div className={styles.matchPreview}>
                        {/* Home Team */}
                        <div className={styles.teamBox}>
                            {match.home_team?.logo ? (
                                <img src={match.home_team.logo} alt={match.home_team.name} className={styles.teamLogo} />
                            ) : (
                                <div className={styles.logoPlaceholder} />
                            )}
                            <span className={styles.teamName}>{match.home_team?.name}</span>
                        </div>

                        {/* VS Section */}
                        <div className={styles.vsSection}>
                            <span className={styles.vs}>VS</span>
                            <span className={styles.date}>{dateStr}</span>
                            <span className={styles.time}>{timeStr}</span>
                        </div>

                        {/* Away Team */}
                        <div className={styles.teamBox}>
                            {match.away_team?.logo ? (
                                <img src={match.away_team.logo} alt={match.away_team.name} className={styles.teamLogo} />
                            ) : (
                                <div className={styles.logoPlaceholder} />
                            )}
                            <span className={styles.teamName}>{match.away_team?.name}</span>
                        </div>
                    </div>
                </Link>

                {/* Venue */}
                {match.venue?.name && (
                    <div className={styles.venue}>
                        📍 {match.venue.name}
                    </div>
                )}
            </div>
        </div>
    );
}
