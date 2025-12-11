'use client';
import { useState } from 'react';
import styles from './SubViews.module.css';

export default function StandingsView({ match }) {
    const [view, setView] = useState('all'); // all, home, away

    const standings = match?.analysis?.standings || []; // Array de times

    // Filtra ou ordena baseado na view (a API geralmente manda tabelas separadas, 
    // mas aqui vou simular filtragem se for lista única, ou você busca do objeto correto)
    // Supondo que `standings` seja um array com dados gerais. 
    // Se a API retornar { all: [], home: [], away: [] }, use isso.

    const currentData = standings; // Simplificação. Implemente lógica de troca de dados aqui.

    return (
        <div className={styles.subContainer}>
            <div className={styles.filterBar}>
                <button className={`${styles.filterPill} ${view === 'all' ? styles.pillActive : ''}`} onClick={() => setView('all')}>Todos</button>
                <button className={`${styles.filterPill} ${view === 'home' ? styles.pillActive : ''}`} onClick={() => setView('home')}>Casa</button>
                <button className={`${styles.filterPill} ${view === 'away' ? styles.pillActive : ''}`} onClick={() => setView('away')}>Fora</button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Equipa</th>
                        <th>P</th>
                        <th>J</th>
                        <th>V</th>
                        <th>E</th>
                        <th>D</th>
                        <th>GM-GS</th>
                        <th>Forma</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row, i) => (
                        <tr key={i} className={row.team_id === match?.homeTeam?.id || row.team_id === match?.awayTeam?.id ? styles.highlightRow : ''}>
                            <td>{row.position}</td>
                            <td className={styles.teamCell}>
                                <img src={row.team_logo} width={20} alt="" /> {row.team_name}
                            </td>
                            <td>{row.points}</td>
                            <td>{row.games_played}</td>
                            <td>{row.won}</td>
                            <td>{row.draw}</td>
                            <td>{row.lost}</td>
                            <td>{row.goal_diff}</td>
                            <td>
                                <div className={styles.formBubbles}>
                                    {row.form?.split('').map((r, k) => (
                                        <span key={k} className={`${styles.bubble} ${styles[r]}`}>{r}</span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}