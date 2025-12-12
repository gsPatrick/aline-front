'use client';
import styles from './totw.module.css';

/**
 * TOTWPlayerCard - Individual player in TOTW
 */
export function TOTWPlayerCard({ player, size = 'medium' }) {
    if (!player) return null;

    return (
        <div className={`${styles.playerCard} ${styles[size]}`}>
            <div className={styles.playerImage}>
                {player.image ? (
                    <img src={player.image} alt={player.name} />
                ) : (
                    <div className={styles.placeholder}>👤</div>
                )}
                <div className={styles.ratingBadge}>
                    {player.rating?.toFixed(1) || '—'}
                </div>
            </div>
            <div className={styles.playerInfo}>
                <div className={styles.playerName}>{player.name}</div>
                <div className={styles.playerPosition}>{player.position}</div>
                {player.team && (
                    <div className={styles.playerTeam}>
                        {player.team.logo && <img src={player.team.logo} alt="" />}
                        <span>{player.team.name}</span>
                    </div>
                )}
            </div>
            {(player.goals > 0 || player.assists > 0) && (
                <div className={styles.playerStats}>
                    {player.goals > 0 && (
                        <span className={styles.goals}>⚽ {player.goals}</span>
                    )}
                    {player.assists > 0 && (
                        <span className={styles.assists}>🅰️ {player.assists}</span>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * TOTWDisplay - Full Team of the Week display
 */
export function TOTWDisplay({ totw, loading = false }) {
    if (loading) {
        return (
            <div className={styles.totwDisplay}>
                <div className={styles.header}>
                    <span className={styles.icon}>⭐</span>
                    <h3>Time da Semana</h3>
                </div>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <span>Carregando...</span>
                </div>
            </div>
        );
    }

    if (!totw || !totw.players?.length) {
        return (
            <div className={styles.totwDisplay}>
                <div className={styles.header}>
                    <span className={styles.icon}>⭐</span>
                    <h3>Time da Semana</h3>
                </div>
                <div className={styles.empty}>
                    <span className={styles.emptyIcon}>🏆</span>
                    <span>TOTW não disponível</span>
                </div>
            </div>
        );
    }

    const { byPosition = {}, players = [], week, formation } = totw;

    return (
        <div className={styles.totwDisplay}>
            <div className={styles.header}>
                <span className={styles.icon}>⭐</span>
                <h3>Time da Semana</h3>
                {week && <span className={styles.week}>{week}</span>}
            </div>

            {formation && (
                <div className={styles.formation}>Formação: {formation}</div>
            )}

            {/* Formation Display */}
            <div className={styles.pitch}>
                {/* Forwards */}
                <div className={`${styles.row} ${styles.forwards}`}>
                    {(byPosition.forwards || players.filter(p =>
                        p.position?.toLowerCase().includes('forward') ||
                        p.position?.toLowerCase().includes('striker')
                    )).map((player, idx) => (
                        <TOTWPlayerCard key={idx} player={player} size="small" />
                    ))}
                </div>

                {/* Midfielders */}
                <div className={`${styles.row} ${styles.midfielders}`}>
                    {(byPosition.midfielders || players.filter(p =>
                        p.position?.toLowerCase().includes('mid')
                    )).map((player, idx) => (
                        <TOTWPlayerCard key={idx} player={player} size="small" />
                    ))}
                </div>

                {/* Defenders */}
                <div className={`${styles.row} ${styles.defenders}`}>
                    {(byPosition.defenders || players.filter(p =>
                        p.position?.toLowerCase().includes('def') ||
                        p.position?.toLowerCase().includes('back')
                    )).map((player, idx) => (
                        <TOTWPlayerCard key={idx} player={player} size="small" />
                    ))}
                </div>

                {/* Goalkeeper */}
                <div className={`${styles.row} ${styles.goalkeeper}`}>
                    {(byPosition.goalkeeper || players.filter(p =>
                        p.position?.toLowerCase().includes('goal') ||
                        p.position?.toLowerCase().includes('gk')
                    )).map((player, idx) => (
                        <TOTWPlayerCard key={idx} player={player} size="small" />
                    ))}
                </div>
            </div>

            {/* Player List Alternative */}
            <div className={styles.playerList}>
                {players.slice(0, 11).map((player, idx) => (
                    <TOTWPlayerCard key={idx} player={player} size="medium" />
                ))}
            </div>
        </div>
    );
}

/**
 * TOTWCompact - Compact version for sidebars
 */
export function TOTWCompact({ totw }) {
    if (!totw || !totw.players?.length) return null;

    const topPlayers = totw.players.slice(0, 3);

    return (
        <div className={styles.compact}>
            <div className={styles.compactHeader}>
                <span>⭐</span>
                <span>Destaques da Rodada</span>
            </div>
            <div className={styles.compactPlayers}>
                {topPlayers.map((player, idx) => (
                    <div key={idx} className={styles.compactPlayer}>
                        <div className={styles.compactRating}>{player.rating?.toFixed(1)}</div>
                        <div className={styles.compactInfo}>
                            <span className={styles.compactName}>{player.name}</span>
                            <span className={styles.compactTeam}>{player.team?.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default { TOTWPlayerCard, TOTWDisplay, TOTWCompact };
