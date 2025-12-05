'use client';
import styles from './PlayerStatsTable.module.css';
import { FaCheck, FaTimes, FaAngleRight } from 'react-icons/fa';

// Mock Data Complexo
const playersData = [
  {
    id: 1,
    name: "Erling Haaland",
    team: "Man City",
    nextMatch: "vs Chelsea (H)",
    avg: 3.8,
    last5: [true, true, false, true, true], // True = Bateu a linha, False = Não
    projection: "High"
  },
  {
    id: 2,
    name: "Mohamed Salah",
    team: "Liverpool",
    nextMatch: "vs Arsenal (A)",
    avg: 2.9,
    last5: [true, false, true, true, false],
    projection: "Medium"
  },
  {
    id: 3,
    name: "Vinicius Jr.",
    team: "Real Madrid",
    nextMatch: "vs Sevilla (H)",
    avg: 2.5,
    last5: [false, true, true, true, true],
    projection: "High"
  },
  {
    id: 4,
    name: "Bruno Fernandes",
    team: "Man Utd",
    nextMatch: "vs Luton (A)",
    avg: 2.1,
    last5: [false, false, true, false, true],
    projection: "Low"
  },
];

// Componente visual para os últimos 5 jogos
const FormGuide = ({ results }) => (
  <div className={styles.formGuide}>
    {results.map((hit, i) => (
      <div 
        key={i} 
        className={`${styles.formBar} ${hit ? styles.hit : styles.miss}`} 
        title={hit ? "Bateu a linha" : "Não bateu"}
      >
        {hit ? <FaCheck size={8} /> : <FaTimes size={8} />}
      </div>
    ))}
  </div>
);

export default function PlayerStatsTable() {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <h3>Resultados Encontrados <span className={styles.count}>(4)</span></h3>
        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={`${styles.dot} ${styles.green}`}></span> Over</span>
          <span className={styles.legendItem}><span className={`${styles.dot} ${styles.red}`}></span> Under</span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Jogador / Time</th>
              <th>Próx. Jogo</th>
              <th>Média</th>
              <th>Últimos 5</th>
              <th>Probabilidade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {playersData.map((player) => (
              <tr key={player.id}>
                <td>
                  <div className={styles.playerInfo}>
                    <div className={styles.avatarPlaceholder} />
                    <div className={styles.meta}>
                      <span className={styles.name}>{player.name}</span>
                      <span className={styles.team}>{player.team}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.matchTag}>{player.nextMatch}</span>
                </td>
                <td>
                  <span className={styles.avgValue}>{player.avg}</span>
                </td>
                <td>
                  <FormGuide results={player.last5} />
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[player.projection.toLowerCase()]}`}>
                    {player.projection}
                  </span>
                </td>
                <td>
                  <button className={styles.detailsBtn}><FaAngleRight /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}