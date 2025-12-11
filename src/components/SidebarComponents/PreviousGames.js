'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaChartBar } from 'react-icons/fa';
import styles from './PreviousGames.module.css';

// Mock Data baseado na imagem
const mockGames = [
    {
        id: 1, date: '02.12.25', league: 'SA',
        home: { name: 'Vasco da Gama', rank: '11.º', score: 0 },
        away: { name: 'Mirassol', rank: '4.º', score: 2 },
        result: 'V', odd: '2.10', corners: { home: 10, away: 1 }, cards: { home: 2, away: 3 }
    },
    {
        id: 2, date: '29.11.25', league: 'SA',
        home: { name: 'Vitória', rank: '16.º', score: 2 },
        away: { name: 'Mirassol', rank: '4.º', score: 0 },
        result: 'D', odd: '2.37', corners: { home: 3, away: 9 }, cards: { home: 1, away: 1 }
    },
    {
        id: 3, date: '24.11.25', league: 'SA',
        home: { name: 'Mirassol', rank: '4.º', score: 3 },
        away: { name: 'Ceará', rank: '14.º', score: 0 },
        result: 'V', odd: '1.75', corners: { home: 6, away: 12 }, cards: { home: 2, away: 2 }
    },
    // Adicione mais mocks conforme necessário
];

export default function PreviousGames({ teamName = "Mirassol", games = [] }) {
    const [filter, setFilter] = useState('all'); // all, home, away

    // Transform backend data to component format if needed
    // Backend history: { id, starting_at, opponent, score, winner, stats: { corners, cards } }
    const displayGames = games.length > 0 ? games.map(g => {
        // Parse score "2-1"
        const [hScore, aScore] = (g.score || "0-0").split('-').map(Number);

        // Determine result (V/E/D) from perspective of teamName
        // Note: 'g.winner' from backend is 'home', 'away', 'draw'
        // We need to know if 'teamName' was home or away.
        // Backend 'detailedHistory' usually has 'participants' or we can infer.
        // Simplified: Assume 'g.home_team' matches 'teamName'
        const isHome = g.home_team === teamName;
        let result = 'E';
        if (g.winner === 'home') result = isHome ? 'V' : 'D';
        else if (g.winner === 'away') result = isHome ? 'D' : 'V';
        else result = 'E';

        return {
            id: g.id,
            date: new Date(g.date || g.starting_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
            league: 'LIG', // Placeholder or extract from g.league
            home: { name: g.home_team, logo: g.home_logo, rank: '-', score: hScore },
            away: { name: g.away_team, logo: g.away_logo, rank: '-', score: aScore },
            result: result,
            odd: '-',
            corners: {
                home: g.stats?.corners?.home ?? (typeof g.stats?.corners === 'number' ? g.stats.corners : 0),
                away: g.stats?.corners?.away ?? 0
            },
            cards: {
                home: g.stats?.cards?.home ?? (typeof g.stats?.cards === 'number' ? g.stats.cards : 0),
                away: g.stats?.cards?.away ?? 0
            }
        };
    }) : mockGames; // Fallback to mock if empty (or remove fallback to show empty state)

    const getResultClass = (res) => {
        if (res === 'V') return styles.win;
        if (res === 'D') return styles.loss;
        return styles.draw;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Jogos Anteriores</h3>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>Tudo</button>
                    <button className={`${styles.tab} ${filter === 'home' ? styles.active : ''}`} onClick={() => setFilter('home')}>{teamName} - Casa</button>
                    <button className={`${styles.tab} ${filter === 'away' ? styles.active : ''}`} onClick={() => setFilter('away')}>{teamName} - Fora</button>
                </div>
            </div>

            <div className={styles.sectionTitle}>Jogos Anteriores: {teamName}</div>

            <div className={styles.gamesList}>
                {/* Header das Colunas */}
                <div className={styles.colHeader}>
                    <div></div>
                    <div style={{ textAlign: 'center' }}>⚽</div>
                    <div style={{ textAlign: 'center' }}>🚩</div>
                    <div style={{ textAlign: 'center' }}>🟨</div>
                    <div style={{ textAlign: 'center' }}>🟥</div>
                    <div></div>
                </div>

                {displayGames.map((game) => (
                    <Link href={`/match/${game.id}`} key={game.id} className={styles.gameRow} style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>

                        {/* Data e Liga */}
                        <div className={styles.dateCol}>
                            <span className={styles.date}>{game.date}</span>
                            <span className={styles.leagueBadge}>{game.league}</span>
                        </div>

                        {/* Times */}
                        <div className={styles.matchCol}>
                            <div className={styles.teamLine}>
                                <img src={game.home.logo} alt="" style={{ width: 16, height: 16, marginRight: 6, objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                                <span className={styles.teamName}>{game.home.name} <span className={styles.rank}>({game.home.rank})</span></span>
                                {game.result === 'V' && filter === 'home' ? <span className={styles.oddBadge}>{game.odd}</span> : null}
                            </div>
                            <div className={styles.teamLine}>
                                <img src={game.away.logo} alt="" style={{ width: 16, height: 16, marginRight: 6, objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                                <span className={styles.teamName}>{game.away.name} <span className={styles.rank}>({game.away.rank})</span></span>
                                {game.result === 'V' && filter === 'away' ? <span className={styles.oddBadge}>{game.odd}</span> : null}
                            </div>
                        </div>

                        {/* Resultado Badge (V/E/D) */}
                        <div className={styles.resultCol}>
                            <div className={`${styles.resultBadge} ${getResultClass(game.result)}`}>{game.result}</div>
                        </div>

                        {/* Placar */}
                        <div className={styles.statsCol}>
                            <div>{game.home.score}</div>
                            <div>{game.away.score}</div>
                        </div>

                        {/* Cantos */}
                        <div className={styles.statsCol}>
                            <div>{game.corners.home}</div>
                            <div>-</div>
                        </div>

                        {/* Cartões Amarelos */}
                        <div className={styles.statsCol}>
                            <div>{game.cards.home}</div>
                            <div>-</div>
                        </div>

                        {/* Cartões Vermelhos (Mockado 0 para exemplo) */}
                        <div className={styles.statsCol}>
                            <div>0</div>
                            <div>0</div>
                        </div>

                        {/* Ícone Gráfico */}
                        <div className={styles.chartCol}>
                            <FaChartBar />
                        </div>
                    </Link>
                ))}
            </div>

            <button className={styles.showMoreBtn}>Mostrar Mais Jogos</button>
        </div>
    );
}