'use client';
import styles from './LineupsTab.module.css';

export default function LineupsTab({ match }) {
    const lineups = match?.lineups;

    if (!lineups || !lineups.home || !lineups.away) {
        return (
            <div className={styles.emptyState}>
                <p>⚠️ Escalação não disponível para este jogo</p>
                <span className={styles.hint}>As escalações são divulgadas próximo ao horário da partida</span>
            </div>
        );
    }

    const getPlayerRatingColor = (rating) => {
        const r = parseFloat(rating || 0);
        if (r >= 7.0) return styles.ratingGreen;
        if (r >= 6.0) return styles.ratingYellow;
        return styles.ratingRed;
    };

    const renderTeamLineup = (team, isHome) => {
        if (!team.players || team.players.length === 0) return null;

        return (
            <div className={styles.teamLineup}>
                <h4 className={styles.teamTitle}>{team.name}</h4>
                <div className={styles.formation}>
                    <span className={styles.formationText}>{team.formation || '4-4-2'}</span>
                </div>

                <div className={styles.playerGrid}>
                    {team.players.map((player, idx) => (
                        <div key={idx} className={styles.playerCard}>
                            <div className={styles.playerAvatar}>
                                {player.image_path ? (
                                    <img src={player.image_path} alt={player.name} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        {player.jersey_number || idx + 1}
                                    </div>
                                )}
                            </div>
                            <div className={styles.playerInfo}>
                                <span className={styles.playerNumber}>#{player.jersey_number || idx + 1}</span>
                                <span className={styles.playerName}>{player.name || 'Jogador'}</span>
                                {player.rating && (
                                    <span className={`${styles.playerRating} ${getPlayerRatingColor(player.rating)}`}>
                                        {parseFloat(player.rating).toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <div className={styles.playerIcons}>
                                {player.goals > 0 && <span className={styles.iconGoal}>⚽ {player.goals}</span>}
                                {player.assists > 0 && <span className={styles.iconAssist}>🎯 {player.assists}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.field}>
                <div className={styles.fieldHalf}>
                    {renderTeamLineup(lineups.home, true)}
                </div>
                <div className={styles.fieldHalf}>
                    {renderTeamLineup(lineups.away, false)}
                </div>
            </div>
        </div>
    );
}
