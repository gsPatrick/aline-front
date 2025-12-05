// components/StatsComparison/StatsComparison.js
import styles from './StatsComparison.module.css';

// Dados de exemplo (médias dos últimos jogos)
const statsData = [
  { label: 'Gols Marcados / Jogo', teamA: 2.1, teamB: 1.5 },
  { label: 'Gols Sofridos / Jogo', teamA: 0.8, teamB: 1.2 },
  { label: 'Escanteios / Jogo', teamA: 6.8, teamB: 4.9 },
  { label: 'Cartões Amarelos / Jogo', teamA: 1.9, teamB: 2.5 },
  { label: 'Chutes / Jogo', teamA: 14.2, teamB: 11.8 },
];

const StatRow = ({ stat }) => {
  const total = stat.teamA + stat.teamB;
  const teamAPercentage = (stat.teamA / total) * 100;

  return (
    <div className={styles.statRow}>
      <span className={styles.statValue}>{stat.teamA}</span>
      <div className={styles.statBarContainer}>
        <div className={styles.statLabel}>{stat.label}</div>
        <div className={styles.statBar}>
          <div className={styles.teamABar} style={{ width: `${teamAPercentage}%` }}></div>
        </div>
      </div>
      <span className={styles.statValue}>{stat.teamB}</span>
    </div>
  );
};

export default function StatsComparison() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Médias Comparativas</h2>
      <div className={styles.statsGrid}>
        {statsData.map((stat, index) => <StatRow key={index} stat={stat} />)}
      </div>
    </div>
  );
}