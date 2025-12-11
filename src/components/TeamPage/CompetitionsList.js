'use client';
import styles from './CompetitionsList.module.css';

export default function CompetitionsList({ competitions, teamId }) {
    if (!competitions || competitions.length === 0) {
        return (
            <div className={styles.card}>
                <h3 className={styles.title}>Competições</h3>
                <div className={styles.noData}>
                    <p>Sem competições disponíveis</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Competições</h3>

            <div className={styles.list}>
                {competitions.map((comp, idx) => (
                    <div key={comp.id || idx} className={styles.competitionRow}>
                        <div className={styles.leagueInfo}>
                            <div className={styles.logoWrapper}>
                                {comp.logo ? (
                                    <img src={comp.logo} alt={comp.name} className={styles.leagueLogo} />
                                ) : (
                                    <div className={styles.logoPlaceholder} />
                                )}
                            </div>
                            <span className={styles.leagueName}>{comp.name}</span>
                        </div>

                        <div className={styles.formBadges}>
                            {(comp.form || []).slice(0, 5).map((result, i) => (
                                <span
                                    key={i}
                                    className={`${styles.badge} ${styles[`badge${result}`]}`}
                                >
                                    {result}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
