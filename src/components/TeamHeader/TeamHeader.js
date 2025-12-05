'use client';
import { motion } from 'framer-motion';
import styles from './TeamHeader.module.css';

export default function TeamHeader({ team }) {
  if (!team) return null;

  return (
    <motion.div 
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.glowBg}></div>
      
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          {team.image_path ? (
            <img src={team.image_path} alt={team.name} className={styles.logo} />
          ) : (
            <div className={styles.placeholder}>{team.name?.charAt(0)}</div>
          )}
        </div>
        
        <div className={styles.info}>
          <h1 className={styles.name}>{team.name}</h1>
          <div className={styles.meta}>
            <span className={styles.code}>{team.short_code || 'TB'}</span>
            <span className={styles.founded}>Fundado em {team.founded || '-'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}