'use client';
import { useState } from 'react';
import { FaFutbol, FaCrosshairs, FaChartBar, FaClock, FaFlag, FaRunning, FaTable } from 'react-icons/fa';
import styles from './GoalsAnalysis.module.css';

// --- COMPONENTES VISUAIS INTERNOS ---

// Barra "Pílula" (Verde vs Vermelho)
const StatPillRow = ({ label, homeVal, awayVal }) => (
    <div className={styles.pillRow}>
        <div className={styles.pillHome}>{homeVal}</div>
        <span className={styles.pillLabel}>{label}</span>
        <div className={styles.pillAway}>{awayVal}</div>
    </div>
);

// Card de Placar (Ex: 1-1 22%)
const ScoreCard = ({ score, prob, type = 'prob' }) => (
    <div className={styles.scoreCard}>
        <span className={styles.scoreTitle}>{score}</span>
        <div className={`${styles.scoreBadge} ${styles[type]}`}>{prob}%</div>
    </div>
);

// Tabela Genérica de Intervalos (Para Gols e Remates)
const IntervalTable = ({ title, data, homeName, awayName }) => (
    <div className={styles.intervalCard}>
        <div className={styles.tableHeaderRow}>
            {title && <h4 className={styles.tableTitle}>{title}</h4>}
            <div className={styles.teamLogos}>
                <span className={styles.teamSmall}>{homeName}</span>
                <span className={styles.teamSmall}>{awayName}</span>
            </div>
        </div>
        <div className={styles.tableScroll}>
            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Marcados</th><th>Sofridos</th><th>Total</th><th>%</th>
                        <th>Período</th>
                        <th>%</th><th>Marcados</th><th>Sofridos</th><th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            <td>{row.home.scored}</td>
                            <td>{row.home.conceded}</td>
                            <td>{row.home.total}</td>
                            <td><span className={`${styles.percentBadge} ${parseFloat(row.home.pct) > 50 ? styles.high : ''}`}>{row.home.pct}%</span></td>
                            <td className={styles.periodCell}>
                                {row.period}
                                <span className={styles.periodBadge}>{row.periodPct}%</span>
                            </td>
                            <td><span className={`${styles.percentBadge} ${parseFloat(row.away.pct) > 50 ? styles.high : ''}`}>{row.away.pct}%</span></td>
                            <td>{row.away.scored}</td>
                            <td>{row.away.conceded}</td>
                            <td>{row.away.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default function GoalsAnalysis({ homeTeam = "Mirassol", awayTeam = "Flamengo", data: propData }) {

    // DADOS MOCKADOS (Fallback)
    const mockData = {
        general: {
            scored: { home: 2.2, away: 1.5 },
            conceded: { home: 0.6, away: 0.9 },
            avgTotal: { home: 2.8, away: 2.4 },
            btts: { home: 60, away: 50 }
        },
        xg: {
            favor: { home: 1.32, away: 1.04 },
            against: { home: 0.88, away: 0.89 },
            totalFavor: 2.36,
            totalAgainst: 1.77,
            trend: "Under"
        },
        scorePredictions: {
            probable: [
                { score: '1-1', prob: 22 }, { score: '0-0', prob: 13 }, { score: '1-0', prob: 12 }, { score: '2-0', prob: 10 }
            ],
            possible: [
                { score: '2-1', prob: 10 }, { score: '2-2', prob: 9 }, { score: 'avg', prob: 7 }, { score: '0-1', prob: 6 }, { score: '3-0', prob: 6 }
            ],
            unlikely: [
                { score: '0-2', prob: 3 }, { score: '3-2', prob: 3 }, { score: '3-3', prob: 2 }
            ]
        },
        firstToScore: [
            { label: "Primeiro a Marcar", home: "70%", away: "20%" },
            { label: "Primeiro a Marcar E ganhou no fim", home: "100%", away: "100%" },
            { label: "Primeiro a Marcar E empatado no final", home: "0%", away: "0%" },
            { label: "Primeiro a Marcar E perdido no final", home: "0%", away: "0%" },
            { label: "Primeiro a marcar e depois sofrer", home: "43%", away: "0%" },
            { label: "Primeiro a sofrer", home: "20%", away: "70%" },
            { label: "Primeiro a sofrer e depois marcar", home: "100%", away: "57%" },
            { label: "Reviravoltas conseguidas", home: "0%", away: "29%" },
            { label: "Marca em ambas as partes", home: "50%", away: "30%" },
            { label: "Marca golo?", home: "80%", away: "65%" },
        ],
        pillStats: [
            { label: "Média Remates", home: "23.80", away: "26.30" },
            { label: "Média Remates Favor", home: "13.10", away: "14.50" },
            { label: "Média Remates Contra", home: "10.70", away: "11.80" },
            { label: "Taxa Conversão", home: "17%", away: "10%" },
            { label: "Remates por Golo", home: "5.95", away: "9.67" },
            { label: "Média Remates à Baliza", home: "8.70", away: "7.50" },
            { label: "Média Remates Fora", home: "15.10", away: "18.80" },
            { label: "Média Fora-de-jogo", home: "2", away: "1.10" },
            { label: "Média Pontapé Livre", home: "14", away: "13.60" },
        ],
        intervals: {
            goals: [
                { period: "0-15'", periodPct: 30, home: { scored: 4, conceded: 1, total: 5, pct: 50 }, away: { scored: 1, conceded: 3, total: 4, pct: 40 } },
                { period: "16-30'", periodPct: 10, home: { scored: 4, conceded: 2, total: 6, pct: 50 }, away: { scored: 0, conceded: 1, total: 1, pct: 10 } },
                { period: "31-HT", periodPct: 50, home: { scored: 6, conceded: 1, total: 7, pct: 50 }, away: { scored: 2, conceded: 3, total: 5, pct: 40 } },
                { period: "46-60'", periodPct: 10, home: { scored: 2, conceded: 1, total: 3, pct: 30 }, away: { scored: 1, conceded: 1, total: 2, pct: 20 } },
                { period: "61-75'", periodPct: 40, home: { scored: 4, conceded: 0, total: 4, pct: 40 }, away: { scored: 6, conceded: 0, total: 6, pct: 60 } },
                { period: "76-FT", periodPct: 60, home: { scored: 2, conceded: 1, total: 3, pct: 30 }, away: { scored: 5, conceded: 1, total: 6, pct: 50 } },
            ],
            shotsTotal: [
                { period: "0-15'", periodPct: 60, home: { scored: 0.6, conceded: 0.7, total: 1.3, pct: 80 }, away: { scored: 0.4, conceded: 0.6, total: 1.0, pct: 70 } },
                { period: "16-30'", periodPct: 70, home: { scored: 1.0, conceded: 0.6, total: 1.6, pct: 80 }, away: { scored: 0.5, conceded: 0.8, total: 1.3, pct: 60 } },
                { period: "31-HT", periodPct: 60, home: { scored: 1.1, conceded: 0.9, total: 2.0, pct: 90 }, away: { scored: 0.7, conceded: 0.3, total: 1.0, pct: 50 } },
                { period: "46-60'", periodPct: 60, home: { scored: 0.5, conceded: 0.5, total: 1.0, pct: 60 }, away: { scored: 0.6, conceded: 0.4, total: 1.0, pct: 50 } },
                { period: "61-75'", periodPct: 80, home: { scored: 1.3, conceded: 0.4, total: 1.7, pct: 90 }, away: { scored: 0.9, conceded: 0.4, total: 1.3, pct: 70 } },
                { period: "76-FT", periodPct: 90, home: { scored: 0.8, conceded: 0.3, total: 1.1, pct: 70 }, away: { scored: 1.1, conceded: 0.8, total: 1.9, pct: 80 } },
            ]
        }
    };

    const data = propData || mockData;

    return (
        <div className={styles.container}>

            {/* 1. SEÇÃO PRINCIPAL (MÉDIAS e XG) */}
            <div className={styles.topGrid}>
                {/* Médias */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}><FaFutbol /> Análise Detalhada</h3>
                    <div className={styles.averagesGrid}>
                        <div className={styles.teamCol}>
                            <img src="https://cdn.sportmonks.com/images/soccer/teams/22/3030.png" className={styles.miniLogo} />
                            <span>{homeTeam}</span>
                            <div className={styles.statItem}><span>Média Gols</span><strong>{data.general.scored.home}</strong></div>
                            <div className={styles.statItem}><span>Sofridos</span><strong>{data.general.conceded.home}</strong></div>
                            <div className={styles.statItem}><span>BTTS</span><strong className={styles.highlight}>{data.general.btts.home}%</strong></div>
                        </div>
                        <div className={styles.teamCol}>
                            <img src="https://cdn.sportmonks.com/images/soccer/teams/19/3027.png" className={styles.miniLogo} />
                            <span>{awayTeam}</span>
                            <div className={styles.statItem}><span>Média Gols</span><strong>{data.general.scored.away}</strong></div>
                            <div className={styles.statItem}><span>Sofridos</span><strong>{data.general.conceded.away}</strong></div>
                            <div className={styles.statItem}><span>BTTS</span><strong className={styles.highlight}>{data.general.btts.away}%</strong></div>
                        </div>
                    </div>
                </div>

                {/* Tabela Gols Por Intervalo (Imagem 1) */}
                <IntervalTable
                    title="Golos Por Intervalo"
                    data={data.intervals.goals}
                    homeName={homeTeam}
                    awayName={awayTeam}
                />
            </div>

            {/* 2. PREVISÃO DE RESULTADO (IMAGEM 2) - NOVO! */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Previsão de Resultado</h3>
                <p className={styles.subText}>
                    {data.scorePredictions?.probable?.length > 0
                        ? `Os resultados mais prováveis são: ${data.scorePredictions.probable.map(p => `${p.score} (${p.prob}%)`).join(', ')}.`
                        : 'Sem previsões de resultado disponíveis.'}
                </p>

                <div className={styles.scoreSection}>
                    <h4>Resultados mais prováveis</h4>
                    <div className={styles.scoreGrid}>
                        {(data.scorePredictions?.probable || []).map((item, i) => (
                            <ScoreCard key={i} score={item.score} prob={item.prob} type="high" />
                        ))}
                    </div>
                </div>
                <div className={styles.scoreSection}>
                    <h4>Resultados possíveis</h4>
                    <div className={styles.scoreGrid}>
                        {(data.scorePredictions?.possible || []).map((item, i) => (
                            <ScoreCard key={i} score={item.score} prob={item.prob} type="med" />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. PRIMEIRO A MARCAR (IMAGEM 3) */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Primeiro a marcar e...?</h3>
                <div className={styles.pillsContainer}>
                    {data.firstToScore.map((item, i) => (
                        <StatPillRow key={i} label={item.label} homeVal={item.home} awayVal={item.away} />
                    ))}
                </div>
            </div>

            {/* 4. ANÁLISE XG (IMAGEM 4) */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}><FaCrosshairs /> Análise do xG</h3>
                <div className={styles.xgGrid}>
                    <div className={styles.xgRow}>
                        <span className={styles.xgLabel}>Ataque (xG Favor)</span>
                        <div className={styles.xgBarContainer}>
                            <span className={styles.xgVal}>{data.xg.favor.home}</span>
                            <div className={styles.xgTrack}><div className={styles.xgFillHome} style={{ width: `${(data.xg.favor.home / 2) * 100}%` }}></div></div>
                            <div className={styles.xgTrack}><div className={styles.xgFillAway} style={{ width: `${(data.xg.favor.away / 2) * 100}%` }}></div></div>
                            <span className={styles.xgVal}>{data.xg.favor.away}</span>
                        </div>
                    </div>
                    <div className={styles.xgRow}>
                        <span className={styles.xgLabel}>Defesa (xG Contra)</span>
                        <div className={styles.xgBarContainer}>
                            <span className={styles.xgVal}>{data.xg.against.home}</span>
                            <div className={styles.xgTrack}><div className={styles.xgFillHomeDef} style={{ width: `${(data.xg.against.home / 2) * 100}%` }}></div></div>
                            <div className={styles.xgTrack}><div className={styles.xgFillAwayDef} style={{ width: `${(data.xg.against.away / 2) * 100}%` }}></div></div>
                            <span className={styles.xgVal}>{data.xg.against.away}</span>
                        </div>
                    </div>
                    <div className={styles.xgSummary}>
                        <div>xG Favor Total: <strong className={styles.highlight}>{data.xg.totalFavor}</strong></div>
                        <div className={styles.trendBox}>Tendência: {data.xg.trend}</div>
                    </div>
                </div>
            </div>

            {/* 5. ESTATÍSTICAS GERAIS (PÍLULAS) (IMAGEM 5, 6, 8) */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Outras Estatísticas (Remates, Offsides, Livres)</h3>
                <div className={styles.pillsGrid}>
                    {data.pillStats.map((item, i) => (
                        <StatPillRow key={i} label={item.label} homeVal={item.home} awayVal={item.away} />
                    ))}
                </div>
            </div>

            {/* 6. TABELAS DETALHADAS DE REMATES POR INTERVALO (IMAGEM 7) - NOVO! */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}><FaTable /> Detalhes por Intervalo</h3>
                <IntervalTable
                    title="Remates Totais Intervalo"
                    data={data.intervals.shotsTotal}
                    homeName={homeTeam}
                    awayName={awayTeam}
                />
                {/* Aqui você repetiria IntervalTable para 'Remates à Baliza' e 'Remates Fora' se tiver os dados */}
            </div>

        </div>
    );
}