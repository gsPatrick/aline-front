'use client';
import styles from './StandingsTab.module.css';

export default function StandingsTab({ match }) {
    // Check both locations just in case, but usually it's at root now
    const standings = match?.standings || match?.league?.standings;
    const matchInfo = match?.matchInfo;

    if (!standings || standings.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>🏆 Classificação não disponível</p>
            </div>
        );
    }

    const getFormIcon = (result) => {
        if (result === 'W') return <span className={styles.formWin}>V</span>;
        if (result === 'D') return <span className={styles.formDraw}>E</span>;
        if (result === 'L') return <span className={styles.formLoss}>D</span>;
        return null;
    };

    const isCurrentTeam = (teamId) => {
        return teamId === matchInfo?.home_team?.id || teamId === matchInfo?.away_team?.id;
    };

    const getZoneClass = (position) => {
        if (position <= 4) return styles.zoneChampions;
        if (position <= 6) return styles.zoneEuropa;
        if (position >= standings.length - 2) return styles.zoneRelegation;
        return '';
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.thPos}>#</th>
                            <th className={styles.thTeam}>Time</th>
                            <th className={styles.thStat}>P</th>
                            <th className={styles.thStat}>V</th>
                            <th className={styles.thStat}>E</th>
                            <th className={styles.thStat}>D</th>
                            <th className={styles.thStat}>GM</th>
                            <th className={styles.thStat}>GS</th>
                            <th className={styles.thStat}>SG</th>
                            <th className={styles.thPts}>Pts</th>
                            <th className={styles.thForm}>Forma</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((team, idx) => (
                            <tr
                                key={idx}
                                className={`
                                    ${isCurrentTeam(team.team_id) ? styles.currentTeam : ''}
                                    ${getZoneClass(team.position)}
                                `}
                            >
                                <td className={styles.tdPos}>{team.position}</td>
                                <td className={styles.tdTeam}>
                                    {team.team_logo && (
                                        <img src={team.team_logo} alt={team.team_name} className={styles.teamLogo} />
                                    )}
                                    <span>{team.team_name}</span>
                                </td>
                                <td className={styles.tdStat}>{team.played || 0}</td>
                                <td className={styles.tdStat}>{team.wins || 0}</td>
                                <td className={styles.tdStat}>{team.draws || 0}</td>
                                <td className={styles.tdStat}>{team.losses || 0}</td>
                                <td className={styles.tdStat}>{team.goals_for || 0}</td>
                                <td className={styles.tdStat}>{team.goals_against || 0}</td>
                                <td className={styles.tdStat}>{team.goal_difference || 0}</td>
                                <td className={styles.tdPts}>{team.points || 0}</td>
                                <td className={styles.tdForm}>
                                    <div className={styles.formContainer}>
                                        {team.form?.split('').slice(0, 5).map((result, i) => (
                                            <span key={i}>{getFormIcon(result)}</span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.zoneChampions}`}></span>
                    <span>Champions League</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.zoneEuropa}`}></span>
                    <span>Europa League</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.zoneRelegation}`}></span>
                    <span>Rebaixamento</span>
                </div>
            </div>
        </div>
    );
}
