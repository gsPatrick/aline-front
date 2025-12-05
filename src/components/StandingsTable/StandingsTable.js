'use client';
import Link from 'next/link'; // <--- Importar Link
import styles from './StandingsTable.module.css';

const FormBadge = ({ result }) => {
  let className = styles.formBadge;
  if (result === 'W') className += ` ${styles.win}`;
  else if (result === 'D') className += ` ${styles.draw}`;
  else if (result === 'L') className += ` ${styles.loss}`;

  return <span className={className}>{result}</span>;
};

export default function StandingsTable({ standings }) {
  if (!standings || standings.length === 0) {
    return <div className={styles.empty}>Tabela não disponível.</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.title}>Classificação</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.posCol}>#</th>
              <th className={styles.teamCol}>Clube</th>
              <th>P</th>
              <th>J</th>
              <th>V</th>
              <th>E</th>
              <th>D</th>
              <th>SG</th>
              <th className={styles.formCol}>Últimos 5</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
              <tr key={row.team.id}>
                <td className={styles.posCol}>
                  <span className={`${styles.position} ${row.position <= 4 ? styles.top4 : ''}`}>
                    {row.position}
                  </span>
                </td>
                <td className={styles.teamCol}>
                  {/* LINK ADICIONADO AQUI */}
                  <Link href={`/team/${row.team.id}`} className={styles.teamLink}>
                      <div className={styles.teamWrapper}>
                        {row.team.logo ? (
                          <img src={row.team.logo} alt={row.team.name} className={styles.logo} />
                        ) : (
                          <div className={styles.logoPlaceholder} />
                        )}
                        <span className={styles.teamName}>{row.team.name}</span>
                      </div>
                  </Link>
                </td>
                <td className={styles.points}>{row.points}</td>
                <td>{row.overall?.games_played || row.games_played || 0}</td>
                <td>{row.overall?.won || row.won || 0}</td>
                <td>{row.overall?.draw || row.draw || 0}</td>
                <td>{row.overall?.lost || row.lost || 0}</td>
                <td>{row.overall?.goal_difference || row.goal_difference || 0}</td>
                <td className={styles.formCol}>
                  <div className={styles.formFlex}>
                    {row.form?.map((res, idx) => (
                      <FormBadge key={idx} result={res} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}