'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './MatchHeader.module.css';

export default function MatchHeader({ match }) {
  if (!match) return null;

  const league = match.league || {};
  const home = match.home_team || match.teams?.home || {};
  const away = match.away_team || match.teams?.away || {};
  const status = match.status || {};
  const isLive = status.id === 2 || ['LIVE', 'HT', 'ET', 'PEN'].includes(status.short);

  // --- COUNTDOWN TIMER ---
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (isLive || status.short === 'FT') return;

    const targetDate = new Date(match.timestamp * 1000).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [match.timestamp, isLive, status.short]);

  // Formata número com zero à esquerda
  const f = (n) => String(n).padStart(2, '0');

  return (
    <motion.div
      className={styles.headerContainer}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.bgGlow}></div>

      {/* Topo: Liga e Local */}
      <div className={styles.metaInfo}>
        <div className={styles.leagueInfo}>
          {league.logo && <img src={league.logo} alt="" className={styles.leagueIcon} />}
          <span className={styles.leagueName}>{league.name}</span>
        </div>
        <span className={styles.venueName}>{match.venue || 'Estádio não informado'}</span>
      </div>

      <div className={styles.mainContent}>
        {/* HOME TEAM */}
        <div className={styles.teamContainer}>
          <div className={styles.logoWrapper}>
            {home.logo ? <img src={home.logo} alt={home.name} /> : <div className={styles.placeholder}>{home.name?.[0]}</div>}
          </div>
          <h2 className={styles.teamName}>{home.name}</h2>
          <span className={styles.positionBadge}>3.º</span> {/* Mock Position */}
        </div>

        {/* CENTER: SCORE OR TIMER */}
        <div className={styles.centerInfo}>
          {isLive || status.short === 'FT' ? (
            <div className={styles.scoreBoard}>
              <span className={styles.score}>{home.score ?? 0}</span>
              <span className={styles.divider}>:</span>
              <span className={styles.score}>{away.score ?? 0}</span>
              {isLive && <span className={styles.liveIndicator}>LIVE {match.minute}'</span>}
            </div>
          ) : (
            <div className={styles.countdown}>
              <div className={styles.timeBox}>
                <span className={styles.timeVal}>{f(timeLeft.days)}</span>
                <span className={styles.timeLabel}>DIAS</span>
              </div>
              <div className={styles.timeBox}>
                <span className={styles.timeVal}>{f(timeLeft.hours)}</span>
                <span className={styles.timeLabel}>HORAS</span>
              </div>
              <div className={styles.timeBox}>
                <span className={styles.timeVal}>{f(timeLeft.minutes)}</span>
                <span className={styles.timeLabel}>MINS</span>
              </div>
              <div className={styles.timeBox}>
                <span className={styles.timeVal}>{f(timeLeft.seconds)}</span>
                <span className={styles.timeLabel}>SEGS</span>
              </div>
            </div>
          )}
        </div>

        {/* AWAY TEAM */}
        <div className={styles.teamContainer}>
          <div className={styles.logoWrapper}>
            {away.logo ? <img src={away.logo} alt={away.name} /> : <div className={styles.placeholder}>{away.name?.[0]}</div>}
          </div>
          <h2 className={styles.teamName}>{away.name}</h2>
          <span className={styles.positionBadge}>1.º</span> {/* Mock Position */}
        </div>
      </div>
    </motion.div>
  );
}