'use client';
import { useState } from 'react';
import styles from './StandingsTab.module.css';

export default function StandingsTab({ standings, homeId, awayId }) {
    const [filter, setFilter] = useState('all');

    if (!standings || standings.length === 0) {
        return <div className={styles.container}><p style={{ color: '#ccc', textAlign: 'center' }}>Classificação não disponível</p></div>;
    }

    const getPosColor = (pos) => {
        if (pos <= 4) return styles.zoneLibertadores;
        if (pos <= 6) return styles.zoneQualifiers;
        if (pos <= 12) return styles.zoneSulamericana;
        if (pos >= 17) return styles.zoneRelegation;
        return '';
    };

    const getRowClass = (id) => {
        // Compara o ID do time da linha com os IDs passados via props
        if (Number(id) === Number(homeId)) return styles.rowHome; // Verde
        if (Number(id) === Number(awayId)) return styles.rowAway; // Vermelho
        return '';
    };

    const getFormClass = (r) => {
        if (r === 'V' || r === 'W') return styles.win;
        if (r === 'E' || r === 'D' && r !== 'D') return styles.draw; // D as Draw vs Defeat logic, assuming 'E' for Empate
        if (r === 'D' || r === 'L') return styles.loss;
        return '';
    };

    // Get stats based on filter
    const getStats = (row) => {
        if (filter === 'home') {
            return {
                j: row.home_j || 0,
                v: row.home_v || 0,
                e: row.home_e || 0,
                d: row.home_d || 0,
                goals: row.home_goals || '0-0'
            };
        } else if (filter === 'away') {
            return {
                j: row.away_j || 0,
                v: row.away_v || 0,
                e: row.away_e || 0,
                d: row.away_d || 0,
                goals: row.away_goals || '0-0'
            };
        }
        // Default: all
        return {
            j: row.j || 0,
            v: row.v || 0,
            e: row.e || 0,
            d: row.d || 0,
            goals: row.goals || '0-0'
        };
    };

    return (
        <div className={styles.container}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.filters}>
                    <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>Todos</button>
                    <button className={`${styles.filterBtn} ${filter === 'home' ? styles.active : ''}`} onClick={() => setFilter('home')}>Casa</button>
                    <button className={`${styles.filterBtn} ${filter === 'away' ? styles.active : ''}`} onClick={() => setFilter('away')}>Fora</button>
                </div>
                <div className={styles.breadcrumb}>
                    Brazil &gt; Brazil Serie A &gt; Regular Season
                </div>
            </div>

            {/* Tabela */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.thMain}>Main</th>
                            <th>P</th>
                            <th>J</th>
                            <th>V</th>
                            <th>E</th>
                            <th>D</th>
                            <th>GM-GS</th>
                            <th className={styles.thForm}>Forma</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((row) => {
                            const stats = getStats(row);
                            return (
                                <tr key={row.id} className={getRowClass(row.id)}>
                                    <td className={styles.tdMain}>
                                        <span className={`${styles.posBadge} ${getPosColor(row.pos)}`}>{row.pos}</span>
                                        <div className={styles.teamWrapper}>
                                            <img
                                                src={row.team_logo}
                                                className={styles.teamLogo}
                                                alt=""
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                            <span className={styles.teamName}>{row.team_name}</span>
                                        </div>
                                    </td>
                                    <td className={styles.tdPoints}>{row.p}</td>
                                    <td>{stats.j}</td>
                                    <td>{stats.v}</td>
                                    <td>{stats.e}</td>
                                    <td>{stats.d}</td>
                                    <td>{stats.goals}</td>
                                    <td className={styles.tdForm}>
                                        <div className={styles.formFlex}>
                                            {/* Handle both string "WWDL" and array ["W","W","D","L"] */}
                                            {(Array.isArray(row.form) ? row.form : (row.form || "").split('')).slice(0, 5).map((res, idx) => (
                                                <span key={idx} className={`${styles.formBox} ${getFormClass(res)}`}>{res}</span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Legenda (Mantido igual) */}
            <div className={styles.legend}>
                <div className={styles.legendItem}><span className={`${styles.dot} ${styles.zoneLibertadores}`}></span> Conmebol Libertadores</div>
                <div className={styles.legendItem}><span className={`${styles.dot} ${styles.zoneQualifiers}`}></span> Conmebol Libertadores Qualifiers</div>
                <div className={styles.legendItem}><span className={`${styles.dot} ${styles.zoneSulamericana}`}></span> Conmebol Sudamericana</div>
                <div className={styles.legendItem}><span className={`${styles.dot} ${styles.zoneRelegation}`}></span> Relegation</div>
            </div>
        </div>
    );
}