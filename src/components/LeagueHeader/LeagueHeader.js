'use client';
import { motion } from 'framer-motion';
import styles from './LeagueHeader.module.css';

export default function LeagueHeader({ league }) {
  if (!league) return null;

  return (
    <motion.div 
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.glowBg}></div>
      
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          {league.logo ? (
             <img src={league.logo} alt={league.name} className={styles.logoImage} />
          ) : (
             <div className={styles.logoPlaceholder}>{league.name?.charAt(0)}</div>
          )}
        </div>
        
        <div className={styles.info}>
          <h1 className={styles.title}>{league.name}</h1>
          <div className={styles.meta}>
            <span className={styles.country}>
                {/* Tenta pegar nome do país direto ou via objeto country */}
                {league.country?.name || league.country || 'Internacional'}
            </span>
            <span className={styles.dot}>•</span>
            {/* Se tiver season, exibe o nome (ex: 2023/2024) */}
            <span className={styles.season}>
                {league.season?.name || league.currentSeason?.data?.name || 'Temporada Atual'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}