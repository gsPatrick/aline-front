'use client';
import { FaFutbol, FaFlag, FaSquare } from 'react-icons/fa';
import styles from './H2HStats.module.css';

export default function H2HStats({ homeTeam, awayTeam, h2hData }) {
    // Mock de dados caso não venha da API para visualização exata da imagem
    const mockStats = {
        totalGames: 1,
        homeWins: 0,
        draws: 0,
        awayWins: 1,
        goals: { home: 1, away: 2 },
        corners: { home: 10, away: 11 },
        yellowCards: { home: 1, away: 1 },
        redCards: { home: 0, away: 0 }
    };

    let stats = mockStats;

    if (h2hData) {
        // Map backend data to component structure
        stats = {
            totalGames: h2hData.summary?.total || 0,
            homeWins: h2hData.summary?.home_wins || 0,
            draws: h2hData.summary?.draws || 0,
            awayWins: h2hData.summary?.away_wins || 0,
            goals: h2hData.aggregates?.goals || { home: 0, away: 0 },
            corners: h2hData.aggregates?.corners || { home: 0, away: 0 },
            yellowCards: h2hData.aggregates?.yellowCards || { home: 0, away: 0 },
            redCards: h2hData.aggregates?.redCards || { home: 0, away: 0 }
        };
    }

    const total = stats.totalGames || (stats.homeWins + stats.draws + stats.awayWins);
    // Calcula porcentagens para a barra (Exemplo da imagem usa 100% vermelho para Flamengo)
    const homePct = total > 0 ? (stats.homeWins / total) * 100 : 0;
    const drawPct = total > 0 ? (stats.draws / total) * 100 : 0;
    const awayPct = total > 0 ? (stats.awayWins / total) * 100 : 0;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Confronto Direto</h3>

            <div className={styles.card}>
                <div className={styles.teamsRow}>
                    <span>{homeTeam?.name || 'Casa'}</span>
                    <span>{awayTeam?.name || 'Fora'}</span>
                </div>

                {/* Barra de Progresso */}
                <div className={styles.progressBar}>
                    {homePct > 0 && <div className={styles.barHome} style={{ width: `${homePct}%` }}>{homePct}%</div>}
                    {drawPct > 0 && <div className={styles.barDraw} style={{ width: `${drawPct}%` }}></div>}
                    {awayPct > 0 && <div className={styles.barAway} style={{ width: `${awayPct}%` }}>{awayPct}%</div>}
                </div>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statRow}>
                        <span>{stats.goals.home} Golos FT</span>
                        <FaFutbol className={styles.icon} />
                        <span>{stats.goals.away} Golos FT</span>
                    </div>
                    <div className={styles.statRow}>
                        <span>{stats.corners.home} FT Cantos</span>
                        <FaFlag className={styles.icon} />
                        <span>{stats.corners.away} FT Cantos</span>
                    </div>
                    <div className={styles.statRow}>
                        <span>{stats.yellowCards.home} Cartões amarelos</span>
                        <div className={styles.yellowCardIcon}></div>
                        <span>{stats.yellowCards.away} Cartões amarelos</span>
                    </div>
                    <div className={styles.statRow}>
                        <span>{stats.redCards.home} Cartão vermelho</span>
                        <div className={styles.redCardIcon}></div>
                        <span>{stats.redCards.away} Cartão vermelho</span>
                    </div>
                </div>

                <p className={styles.summaryText}>
                    {stats.awayWins > stats.homeWins
                        ? `${awayTeam?.name} tem mais vitórias contra ${homeTeam?.name}`
                        : `${homeTeam?.name} tem mais vitórias contra ${awayTeam?.name}`}
                    {' '}em confronto direto, com um total de {stats.homeWins} vitórias, {stats.draws} empates e {stats.awayWins} derrotas nos últimos {total} jogos.
                </p>
            </div>
        </div>
    );
}