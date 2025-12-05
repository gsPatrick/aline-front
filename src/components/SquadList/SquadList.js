'use client';
import styles from './SquadList.module.css';
import { FaUserAlt, FaStar } from 'react-icons/fa';
import { GiArmband } from 'react-icons/gi'; // Para o capitão

const PlayerCard = ({ player }) => (
  <div className={styles.card}>
    {/* Badge de Capitão */}
    {player.is_captain && (
      <div className={styles.captainBadge} title="Capitão">
        <span className={styles.captainText}>C</span>
      </div>
    )}

    <div className={styles.numberBadge}>{player.number || '-'}</div>
    
    <div className={styles.photoWrapper}>
      {player.photo ? (
        <img src={player.photo} alt={player.name} className={styles.photo} />
      ) : (
        <FaUserAlt className={styles.placeholderIcon} />
      )}
    </div>
    
    <div className={styles.info}>
      <h4 className={styles.name}>{player.name}</h4>
      
      <div className={styles.meta}>
        <span className={styles.position}>{player.position_name}</span>
        {player.nationality_flag && (
          <img src={player.nationality_flag} alt="nac" className={styles.flag} title={player.country} />
        )}
      </div>
      
      <div className={styles.statsGrid}>
        {/* Jogos */}
        <div className={styles.statItem} title="Partidas Jogadas">
          <span className={styles.statValue}>{player.stats?.matches || 0}</span>
          <span className={styles.statLabel}>JOGOS</span>
        </div>

        {/* Gols */}
        <div className={styles.statItem} title="Gols Marcados">
          <span className={`${styles.statValue} ${styles.accent}`}>{player.stats?.goals || 0}</span>
          <span className={styles.statLabel}>GOLS</span>
        </div>

        {/* Assistências */}
        <div className={styles.statItem} title="Assistências">
          <span className={styles.statValue}>{player.stats?.assists || 0}</span>
          <span className={styles.statLabel}>ASSIS</span>
        </div>

        {/* Nota (Rating) */}
        <div className={`${styles.statItem} ${styles.ratingBox}`} title="Nota Média">
          <span className={styles.ratingValue}>{player.stats?.rating || '-'}</span>
        </div>
      </div>
    </div>
  </div>
);

export default function SquadList({ squad }) {
  if (!squad || !Array.isArray(squad) || squad.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Dados do elenco indisponíveis no momento.</p>
      </div>
    );
  }

  // Mapeamento de Posições
  const positions = {
    24: { label: 'Goleiros', order: 1 },
    25: { label: 'Defensores', order: 2 },
    26: { label: 'Meio-Campistas', order: 3 },
    27: { label: 'Atacantes', order: 4 },
    99: { label: 'Outros', order: 5 }
  };

  // Agrupa jogadores por posição e ORDENA POR JOGOS (Titulares primeiro)
  const groupedSquad = squad.reduce((acc, player) => {
    const posId = player.position_id || 99;
    if (!acc[posId]) acc[posId] = [];
    acc[posId].push(player);
    return acc;
  }, {});

  // Ordena as posições (Goleiro -> Ataque)
  const sortedPosKeys = Object.keys(groupedSquad).sort((a, b) => {
    const orderA = positions[a]?.order || 99;
    const orderB = positions[b]?.order || 99;
    return orderA - orderB;
  });

  return (
    <div className={styles.container}>
      {sortedPosKeys.map((posId) => {
        // Dentro da posição, ordena por quem jogou mais (matches)
        // Isso resolve a questão de "Titular/Reserva" visualmente
        const playersInPos = groupedSquad[posId].sort((a, b) => 
          (b.stats?.matches || 0) - (a.stats?.matches || 0)
        );

        return (
          <div key={posId} className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {positions[posId]?.label || 'Outros'} 
              <span className={styles.count}>({playersInPos.length})</span>
            </h3>
            
            <div className={styles.grid}>
              {playersInPos.map((p) => (
                <PlayerCard key={`${p.id}-${p.position_id}`} player={p} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
