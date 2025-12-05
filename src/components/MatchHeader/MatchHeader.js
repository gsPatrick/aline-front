'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './MatchHeader.module.css';

export default function MatchHeader({ match }) {
  if (!match) return null;

  // Garante o acesso aos dados, independente se vier de 'teams' ou direto na raiz (dependendo do endpoint usado)
  const league = match.league || {};
  const home = match.home_team || match.teams?.home || {};
  const away = match.away_team || match.teams?.away || {};
  const status = match.status || {};

  // Verifica se o jogo está ao vivo para exibir o ponto pulsante e o minuto
  // IDs típicos Sportmonks: 2 = LIVE. Strings: LIVE, HT (Intervalo), ET (Prorrogação), PEN (Pênaltis)
  const isLive = status.id === 2 || ['LIVE', 'HT', 'ET', 'PEN'].includes(status.short);

  // Lógica de exibição do tempo:
  // Se tiver a propriedade 'minute' na raiz (comum em livescore), usa ela.
  // Caso contrário, usa o status curto (ex: FT, NS, INT).
  const timeDisplay = isLive && match.minute 
    ? `${match.minute}'` 
    : (status.short || 'NS');

  return (
    <motion.div 
      className={styles.headerContainer}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Fundo com efeito de brilho */}
      <div className={styles.bgGlow}></div>

      {/* Informações da Liga (Clicável) */}
      <div className={styles.metaInfo}>
        {league.id ? (
          <Link href={`/leagues/${league.id}`} className={styles.leagueLink}>
            <span className={styles.leagueName}>{league.name || 'Liga Desconhecida'}</span>
          </Link>
        ) : (
          <span className={styles.leagueName}>{league.name || 'Liga'}</span>
        )}
        
        <span className={styles.separator}>•</span>
        <span className={styles.venueName}>{league.country || 'Mundo'}</span>
      </div>

      {/* Placar e Times */}
      <div className={styles.scoreboard}>
        
        {/* Time da Casa (Clicável) */}
        <Link href={`/team/${home.id}`} className={`${styles.team} ${styles.home}`}>
          <div className={styles.logoPlaceholder}>
             {home.logo ? (
                <img src={home.logo} alt={home.name} className={styles.teamLogo} />
             ) : (
                <span className={styles.logoText}>{home.name?.charAt(0)}</span>
             )}
          </div>
          <h1 className={styles.teamName}>{home.name}</h1>
        </Link>

        {/* Centro do Placar (Score + Tempo) */}
        <div className={styles.scoreCenter}>
          <div className={styles.scoreDisplay}>
            <span className={styles.goals}>{home.score ?? 0}</span>
            <span className={styles.colon}>:</span>
            <span className={styles.goals}>{away.score ?? 0}</span>
          </div>
          
          <div className={styles.timerBadge}>
            {isLive && <span className={styles.liveDot}></span>}
            <span className={styles.time}>{timeDisplay}</span>
          </div>
        </div>

        {/* Time Visitante (Clicável) */}
        <Link href={`/team/${away.id}`} className={`${styles.team} ${styles.away}`}>
          <div className={styles.logoPlaceholder}>
            {away.logo ? (
                <img src={away.logo} alt={away.name} className={styles.teamLogo} />
             ) : (
                <span className={styles.logoText}>{away.name?.charAt(0)}</span>
             )}
          </div>
          <h1 className={styles.teamName}>{away.name}</h1>
        </Link>

      </div>
    </motion.div>
  );
}