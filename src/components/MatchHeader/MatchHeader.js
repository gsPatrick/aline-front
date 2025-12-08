'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt, FaCloudSun } from 'react-icons/fa';
import styles from './MatchHeader.module.css';

export default function MatchHeader({ match }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const matchInfo = match?.matchInfo;
  if (!matchInfo) return null;

  const { state, minute, starting_at_timestamp, home_team, away_team, league, venue, weather } = matchInfo;

  // Countdown para partidas NS
  useEffect(() => {
    if (state !== 'NS' || !starting_at_timestamp) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const matchTime = starting_at_timestamp * 1000; // Converter Unix timestamp
      const distance = matchTime - now;

      if (distance < 0) {
        setTimeLeft('Iniciando...');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state, starting_at_timestamp]);

  // Atualizar relógio para partidas LIVE
  useEffect(() => {
    if (state !== 'LIVE') return;
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [state]);

  const renderMatchStatus = () => {
    if (state === 'NS') {
      return (
        <div className={styles.countdown}>
          <FaClock className={styles.clockIcon} />
          <span className={styles.countdownText}>{timeLeft || 'Calculando...'}</span>
        </div>
      );
    }

    if (state === 'LIVE' || state === 'HT') {
      return (
        <motion.div
          className={styles.liveIndicator}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className={styles.liveDot}></span>
          <span className={styles.liveText}>
            {state === 'HT' ? 'INTERVALO' : `${minute}'`}
          </span>
        </motion.div>
      );
    }

    if (state === 'FT') {
      return (
        <div className={styles.finished}>
          <span className={styles.finishedText}>TERMINADO</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.container}>
      {/* League Info */}
      <div className={styles.leagueBar}>
        {league?.logo && (
          <img src={league.logo} alt={league.name} className={styles.leagueLogo} />
        )}
        <span className={styles.leagueName}>{league?.name || 'Liga Desconhecida'}</span>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        {/* Home Team */}
        <div className={styles.team}>
          <img
            src={home_team?.logo || '/placeholder-team.png'}
            alt={home_team?.name || 'Casa'}
            className={styles.teamLogo}
            onError={(e) => { e.target.src = '/placeholder-team.png'; }}
          />
          <h2 className={styles.teamName}>{home_team?.name || 'Casa'}</h2>
          <span className={styles.teamShort}>{home_team?.short_name || 'HOME'}</span>
        </div>

        {/* Match Status */}
        <div className={styles.matchStatus}>
          {renderMatchStatus()}

          {/* Score (only for LIVE/HT/FT) */}
          {(state === 'LIVE' || state === 'HT' || state === 'FT') && (
            <div className={styles.score}>
              <span className={styles.scoreNumber}>
                {match?.basicInfo?.teams?.homeScore || 0}
              </span>
              <span className={styles.scoreSeparator}>-</span>
              <span className={styles.scoreNumber}>
                {match?.basicInfo?.teams?.awayScore || 0}
              </span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className={styles.team}>
          <img
            src={away_team?.logo || '/placeholder-team.png'}
            alt={away_team?.name || 'Fora'}
            className={styles.teamLogo}
            onError={(e) => { e.target.src = '/placeholder-team.png'; }}
          />
          <h2 className={styles.teamName}>{away_team?.name || 'Fora'}</h2>
          <span className={styles.teamShort}>{away_team?.short_name || 'AWAY'}</span>
        </div>
      </div>

      {/* Match Details */}
      <div className={styles.matchDetails}>
        {venue?.name && (
          <div className={styles.detailItem}>
            <FaMapMarkerAlt className={styles.detailIcon} />
            <span>{venue.name}</span>
          </div>
        )}
        {weather && (
          <div className={styles.detailItem}>
            <FaCloudSun className={styles.detailIcon} />
            <span>{weather}</span>
          </div>
        )}
      </div>
    </div>
  );
}