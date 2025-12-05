// components/H2HHeader/H2HHeader.js
import styles from './H2HHeader.module.css';

// Dados de exemplo
const teamsData = {
  teamA: { name: 'Hamburger SV' },
  teamB: { name: 'St. Pauli' },
};

export default function H2HHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.team}>
        <div className={styles.logoPlaceholder}></div>
        <h1 className={styles.teamName}>{teamsData.teamA.name}</h1>
      </div>
      <div className={styles.separator}>VS</div>
      <div className={styles.team}>
        <div className={styles.logoPlaceholder}></div>
        <h1 className={styles.teamName}>{teamsData.teamB.name}</h1>
      </div>
    </div>
  );
}