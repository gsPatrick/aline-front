'use client';
import styles from './OddsWidget.module.css';
import { FaLock } from 'react-icons/fa';

export default function OddsWidget({ odds }) {
  // Se não houver dados de odds, exibe estado vazio/bloqueado
  if (!odds || !odds.home || !odds.away) {
    return (
      <div className={styles.containerLocked}>
        <FaLock className={styles.lockIcon} />
        <span>-</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Casa (1) */}
      <div className={styles.oddBox} title="Vitória Casa">
        <span className={styles.label}>1</span>
        <span className={styles.value}>{odds.home?.value || '-'}</span>
        {/* Barra de probabilidade visual (opcional) */}
        {odds.home?.prob && (
           <div className={styles.probBar} style={{ height: `${parseFloat(odds.home.prob)}%` }} />
        )}
      </div>

      {/* Empate (X) */}
      <div className={styles.oddBox} title="Empate">
        <span className={styles.label}>X</span>
        <span className={styles.value}>{odds.draw?.value || '-'}</span>
      </div>

      {/* Fora (2) */}
      <div className={styles.oddBox} title="Vitória Visitante">
        <span className={styles.label}>2</span>
        <span className={styles.value}>{odds.away?.value || '-'}</span>
        {odds.away?.prob && (
           <div className={styles.probBar} style={{ height: `${parseFloat(odds.away.prob)}%` }} />
        )}
      </div>
    </div>
  );
}