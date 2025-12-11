'use client';
import { useState } from 'react';
import styles from './CardsAnalysis.module.css';

// Badge Percentual Colorido (Reutilizável)
const PercentBadge = ({ val }) => {
    let color = styles.low;
    const num = parseInt(val);
    if (num >= 80) color = styles.high;
    else if (num >= 50) color = styles.med;
    return <span className={`${styles.badge} ${color}`}>{val}%</span>;
};

// Linha de Tabela "Total Cartões" (Over)
const TotalRow = ({ label, homeM, homeS, awayM, awayS }) => (
    <div className={styles.totalRow}>
        <div className={styles.dualVal}>
            <PercentBadge val={homeM} /><PercentBadge val={homeS} />
        </div>
        <span className={styles.totalLabel}>{label}</span>
        <div className={styles.dualVal}>
            <PercentBadge val={awayM} /><PercentBadge val={awayS} />
        </div>
    </div>
);

export default function CardsAnalysis({ homeTeam = "Mirassol", awayTeam = "Flamengo", referee, data: propData }) {

    // MOCK DATA (Fallback)
    const mockData = {
        averages: {
            favor: { home: 1.9, away: 2.8 },
            against: { home: 2.6, away: 3.0 },
            total: { home: 4.5, away: 5.8 }
        },
        totalCards: [
            { label: 'Over 0.5', homeM: '90%', homeS: '90%', awayM: '90%', awayS: '100%' },
            { label: 'Over 1.5', homeM: '60%', homeS: '90%', awayM: '80%', awayS: '90%' },
            { label: 'Over 2.5', homeM: '40%', homeS: '50%', awayM: '70%', awayS: '70%' },
            { label: 'Over 3.5', homeM: '0%', homeS: '30%', awayM: '20%', awayS: '30%' },
        ],
        intervals: [
            { period: "0-15'", pct: "0%", avgFavor: 0, avgContra: 0, total: 1, pctOverall: "50%", avgFavorA: 4, avgContraA: 1, totalA: 4 },
            { period: "16-30'", pct: "40%", avgFavor: 3, avgContra: 3, total: 8, pctOverall: "60%", avgFavorA: 3, avgContraA: 5, totalA: 6 },
            { period: "31-HT", pct: "80%", avgFavor: 5, avgContra: 10, total: 12, pctOverall: "40%", avgFavorA: 0, avgContraA: 7, totalA: 10 },
            { period: "46-60'", pct: "60%", avgFavor: 3, avgContra: 4, total: 6, pctOverall: "60%", avgFavorA: 7, avgContraA: 3, totalA: 11 },
            { period: "61-75'", pct: "60%", avgFavor: 2, avgContra: 4, total: 6, pctOverall: "50%", avgFavorA: 6, avgContraA: 4, totalA: 10 },
            { period: "76-FT", pct: "70%", avgFavor: 6, avgContra: 5, total: 14, pctOverall: "90%", avgFavorA: 10, avgContraA: 8, totalA: 15 },
        ],
        referee: {
            avg: 5.3,
            over05: "100%",
            over15: "100%",
            over25: "90%",
            over35: "80%",
            over45: "50%"
        }
    };

    const data = propData || mockData;

    return (
        <div className={styles.container}>
            <h3 className={styles.mainTitle}>Análise Detalhada</h3>

            <div className={styles.grid}>

                {/* --- COLUNA ESQUERDA: MÉDIAS E TOTAIS --- */}
                <div className={styles.card}>
                    {/* Header Tabs */}
                    <div className={styles.cardHeader}>
                        <span className={styles.tabTitle}>Cartões Análise</span>
                        <div className={styles.tabBtns}>
                            <button className={`${styles.btn} ${styles.active}`}>Terminado</button>
                            <button className={styles.btn}>1ª Parte</button>
                            <button className={styles.btn}>2ª Parte</button>
                        </div>
                    </div>

                    {/* Times */}
                    <div className={styles.teamsRow}>
                        <div className={styles.team}>
                            <img src="https://cdn.sportmonks.com/images/soccer/teams/22/3030.png" alt="" />
                            <span>{homeTeam}</span>
                        </div>
                        <div className={styles.team}>
                            <span>{awayTeam}</span>
                            <img src="https://cdn.sportmonks.com/images/soccer/teams/19/3027.png" alt="" />
                        </div>
                    </div>

                    {/* Tabela Médias */}
                    <div className={styles.averagesTable}>
                        <div className={styles.avgRow}>
                            <span>{data.averages.favor.home}</span><span className={styles.avgLabel}>Média a favor</span><span>{data.averages.favor.away}</span>
                        </div>
                        <div className={styles.avgRow}>
                            <span>{data.averages.against.home}</span><span className={styles.avgLabel}>Média contra</span><span>{data.averages.against.away}</span>
                        </div>
                        <div className={styles.avgRow}>
                            <span>{data.averages.total.home}</span><span className={styles.avgLabel}>Média total</span><span>{data.averages.total.away}</span>
                        </div>
                    </div>

                    {/* Tabela Total Cartões (Over) */}
                    <div className={styles.totalsTable}>
                        <div className={styles.totalsHeader}>
                            <span>Total Cartões</span>
                            <div className={styles.dualHead}><span>Marcados</span><span>Sofridos</span></div>
                            <div className={styles.dualHead}><span>Marcados</span><span>Sofridos</span></div>
                        </div>
                        {data.totalCards.map((row, i) => (
                            <TotalRow
                                key={i}
                                label={row.label}
                                homeM={row.homeM} homeS={row.homeS}
                                awayM={row.awayM} awayS={row.awayS}
                            />
                        ))}
                    </div>
                </div>

                {/* --- COLUNA DIREITA: INTERVALOS E ÁRBITRO --- */}
                <div className={styles.rightCol}>

                    {/* Tabela Intervalos */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.tabTitle}>Cartões amarelos por parte</span>
                        </div>
                        <div className={styles.teamsSmall}>
                            <img src="https://cdn.sportmonks.com/images/soccer/teams/22/3030.png" width="20" /> {homeTeam}
                            <span style={{ flex: 1 }}></span>
                            {awayTeam} <img src="https://cdn.sportmonks.com/images/soccer/teams/19/3027.png" width="20" />
                        </div>

                        <div className={styles.intervalScroll}>
                            <table className={styles.intervalTable}>
                                <thead>
                                    <tr>
                                        <th>Média a favor</th><th>Média contra</th><th>Total</th><th>%</th>
                                        <th>Período</th>
                                        <th>%</th><th>Média a favor</th><th>Média contra</th><th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.intervals.map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.avgFavor}</td><td>{row.avgContra}</td><td>{row.total}</td>
                                            <td><PercentBadge val={row.pct} /></td>
                                            <td className={styles.period}>{row.period}</td>
                                            <td><PercentBadge val={row.pctOverall} /></td>
                                            <td>{row.avgFavorA}</td><td>{row.avgContraA}</td><td>{row.totalA}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Stats Árbitro */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.tabTitle}>Estatísticas do Árbitro</span>
                        </div>
                        <div className={styles.refereeContent}>
                            <div className={styles.refereeRowMain}>
                                <span>Média total</span>
                                <span className={styles.refValBig}>{data.referee.avg}</span>
                            </div>
                            <div className={styles.refereeList}>
                                <div className={styles.refRow}><span>Over 0.5 Cartões Amarelos</span><PercentBadge val={data.referee.over05} /></div>
                                <div className={styles.refRow}><span>Over 1.5 Cartões Amarelos</span><PercentBadge val={data.referee.over15} /></div>
                                <div className={styles.refRow}><span>Over 2.5 Cartões Amarelos</span><PercentBadge val={data.referee.over25} /></div>
                                <div className={styles.refRow}><span>Over 3.5 Cartões Amarelos</span><PercentBadge val={data.referee.over35} /></div>
                                <div className={styles.refRow}><span>Over 4.5 Cartões Amarelos</span><PercentBadge val={data.referee.over45} /></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}