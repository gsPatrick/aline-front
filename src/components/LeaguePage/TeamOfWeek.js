'use client';
import styles from './TeamOfWeek.module.css';

// Player position on field - with team logo
const PlayerCard = ({ player }) => {
    if (!player) return null;

    const name = player.player_name || player.name || 'Jogador';
    const teamLogo = player.team_logo || player.teamLogo || player.logo;
    const rating = player.rating || player.average_rating;
    const number = player.jersey_number || player.number || '';

    return (
        <div className={styles.playerCard}>
            {/* Team Logo */}
            <div className={styles.teamLogo}>
                {teamLogo ? (
                    <img src={teamLogo} alt="" className={styles.teamLogoImg} />
                ) : (
                    <div className={styles.teamLogoPlaceholder}>⚽</div>
                )}
            </div>

            {/* Player Info */}
            <div className={styles.playerInfo}>
                <span className={styles.playerNumber}>{number}.</span>
                <span className={styles.playerName}>{name}</span>
            </div>

            {/* Rating */}
            <div className={styles.rating}>
                <span className={styles.star}>★</span>
                <span className={styles.ratingValue}>
                    {typeof rating === 'number' ? rating.toFixed(2) : rating || '-'}
                </span>
            </div>
        </div>
    );
};

export default function TeamOfWeek({ players = [], round = 'Jornada 15' }) {
    // If no players, show placeholder
    if (!players || players.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>EQUIPA DA JORNADA</h3>
                    <span className={styles.round}>{round}</span>
                </div>
                <div className={styles.empty}>
                    Dados da equipa da jornada não disponíveis
                </div>
            </div>
        );
    }

    // Use first 11 players in 4-3-3 formation
    const allPlayers = players.slice(0, 11);

    // Split into formation rows
    const gk = allPlayers[0];
    const defenders = allPlayers.slice(1, 5);
    const midfielders = allPlayers.slice(5, 8);
    const forwards = allPlayers.slice(8, 11);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>EQUIPA DA JORNADA</h3>
                <span className={styles.round}>{round}</span>
            </div>

            <div className={styles.field}>
                {/* Forwards Row */}
                <div className={styles.row}>
                    {forwards.map((player, i) => (
                        <PlayerCard key={`fwd-${i}`} player={player} />
                    ))}
                </div>

                {/* Midfielders Row */}
                <div className={styles.row}>
                    {midfielders.map((player, i) => (
                        <PlayerCard key={`mid-${i}`} player={player} />
                    ))}
                </div>

                {/* Defenders Row */}
                <div className={styles.row}>
                    {defenders.map((player, i) => (
                        <PlayerCard key={`def-${i}`} player={player} />
                    ))}
                </div>

                {/* Goalkeeper Row */}
                <div className={styles.row}>
                    {gk && <PlayerCard key="gk" player={gk} />}
                </div>
            </div>
        </div>
    );
}
