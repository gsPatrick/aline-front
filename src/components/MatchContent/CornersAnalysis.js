'use client';
import { useState } from 'react';
import styles from './CornersAnalysis.module.css';

// Badge Percentual Colorido
const PercentBadge = ({ val }) => {
    let color = styles.low;
    const num = parseInt(val);
    if (num >= 70) color = styles.high;
    else if (num >= 50) color = styles.med;
    return <span className={`${styles.badge} ${color}`}>{val}%</span>;
};

export default function CornersAnalysis({ homeTeam = "Mirassol", awayTeam = "Flamengo" }) {

    // Dados Mockados Idênticos à Imagem
    const totalCorners = [
        { label: 'Over 2.5', homeM: '100%', homeS: '60%', awayM: '70%', awayS: '90%' },
        { label: 'Over 3.5', homeM: '90%', homeS: '60%', awayM: '60%', awayS: '50%' },
        { label: 'Over 4.5', homeM: '70%', homeS: '50%', awayM: '50%', awayS: '30%' },
        { label: 'Over 5.5', homeM: '60%', homeS: '40%', awayM: '30%', awayS: '10%' },
        { label: 'Over 6.5', homeM: '50%', homeS: '40%', awayM: '30%', awayS: '10%' },
    ];

    const intervals = [
        { period: "0-10'", pctH: 60, pctA: 60, hM: 0.9, hS: 0.5, aM: 0.3, aS: 0.7, fav: 0.6, cont: 0.6, med: 60 },
        { period: "11-20'", pctH: 70, pctA: 90, hM: 0.9, hS: 0.2, aM: 0.5, aS: 0.9, fav: 0.7, cont: 0.55, med: 80 },
        { period: "37-HT", pctH: 80, pctA: 70, hM: 1.2, hS: 0.9, aM: 0.3, aS: 0.5, fav: 0.75, cont: 0.7, med: 75 },
        { period: "75-FT", pctH: 100, pctA: 80, hM: 1.2, hS: 1.6, aM: 0.6, aS: 0.9, fav: 0.9, cont: 1.25, med: 90 },
        { period: "80-FT", pctH: 100, pctA: 80, hM: 0.9, hS: 1.2, aM: 0.4, aS: 0.9, fav: 0.65, cont: 1.05, med: 90 },
        { period: "87-FT", pctH: 70, pctA: 50, hM: 0.7, hS: 0.7, aM: 0.3, aS: 0.7, fav: 0.5, cont: 0.7, med: 60 },
    ];

    const races = [
        { label: 'Race 3', homeW: '80%', homeL: '20%', awayW: '40%', awayL: '60%' },
        { label: 'Race 5', homeW: '60%', homeL: '30%', awayW: '50%', awayL: '20%' },
        { label: 'Race 7', homeW: '50%', homeL: '30%', awayW: '30%', awayL: '10%' },
        { label: 'Race 9', homeW: '20%', homeL: '20%', awayW: '20%', awayL: '10%' },
    ];

    return (
        <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Análise Detalhada</h3>

            <div className={styles.gridTop}>

                {/* COLUNA ESQUERDA: RESUMO & TOTAIS */}
                <div className={styles.card}>
                    {/* Header Interno */}
                    <div className={styles.tabsHeader}>
                        <span className={styles.tabTitle}>Cantos Análise</span>
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

                    {/* Médias */}
                    <div className={styles.statsTable}>
                        <div className={styles.statRow}><span>6.5</span><span className={styles.statLabel}>Média a favor</span><span>5.2</span></div>
                        <div className={styles.statRow}><span>5.5</span><span className={styles.statLabel}>Média contra</span><span>4.5</span></div>
                        <div className={styles.statRow}><span>12</span><span className={styles.statLabel}>Média total</span><span>9.7</span></div>
                    </div>

                    {/* Calculadora */}
                    <div className={styles.calcArea}>
                        <h4>Calculadora de cantos</h4>
                        <div className={styles.sliderRow}><label>Minutos</label><div className={styles.slider}></div><span>0</span></div>
                        <div className={styles.sliderRow}><label>Cantos</label><div className={styles.slider}></div><span>0</span></div>
                        <div className={styles.calcResult}>
                            <span className={styles.blueBadge}>Previsão HT: 5</span>
                            <span className={styles.blueBadge}>Previsão FT: 10.85</span>
                        </div>
                    </div>

                    {/* Tabela Totais */}
                    <div className={styles.totalTable}>
                        <div className={styles.totalHeader}>
                            <span>Total Cantos</span>
                            <div className={styles.dualHead}><span>Marcados</span><span>Sofridos</span></div>
                            <div className={styles.dualHead}><span>Marcados</span><span>Sofridos</span></div>
                        </div>
                        {totalCorners.map((row, i) => (
                            <div key={i} className={styles.totalRow}>
                                <div className={styles.dualVal}><PercentBadge val={row.homeM} /><PercentBadge val={row.homeS} /></div>
                                <span className={styles.rowLabel}>{row.label}</span>
                                <div className={styles.dualVal}><PercentBadge val={row.awayM} /><PercentBadge val={row.awayS} /></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUNA DIREITA: INTERVALOS & HANDICAP */}
                <div className={styles.rightContent}>
                    {/* Tabela de Intervalos */}
                    <div className={styles.card}>
                        <h4 className={styles.cardHeaderSmall}>Cantos Por Intervalo</h4>
                        <div className={styles.teamsSmall}>
                            <img src="https://cdn.sportmonks.com/images/soccer/teams/22/3030.png" width="20" /> {homeTeam}
                            <span style={{ flex: 1 }}></span>
                            {awayTeam} <img src="https://cdn.sportmonks.com/images/soccer/teams/19/3027.png" width="20" />
                        </div>
                        <div className={styles.intervalScroll}>
                            <table className={styles.intervalTable}>
                                <thead>
                                    <tr>
                                        <th>Marcados</th><th>Sofridos</th><th>%</th><th>Período</th><th>%</th><th>Marcados</th><th>Sofridos</th><th>Favor</th><th>Contra</th><th>Média</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {intervals.map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.hM}</td><td>{row.hS}</td><td><PercentBadge val={row.pctH + '%'} /></td>
                                            <td className={styles.period}>{row.period}</td>
                                            <td><PercentBadge val={row.pctA + '%'} /></td><td>{row.aM}</td><td>{row.aS}</td>
                                            <td>{row.fav}</td><td>{row.cont}</td><td><PercentBadge val={row.med + '%'} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className={styles.moreBtn}>Mostrar Mais Estatísticas</button>
                    </div>

                    {/* Handicap (Mock Visual) */}
                    <div className={styles.card}>
                        <div className={styles.handicapHeader}>
                            <span>Handicap Cantos</span>
                            <span>Vencer Derrota</span>
                        </div>
                        {/* Exemplo de uma linha para visual */}
                        <div className={styles.handicapRow}>
                            <div className={styles.dualVal}><PercentBadge val="40%" /><PercentBadge val="60%" /></div>
                            <span>-2.5</span>
                            <div className={styles.dualVal}><PercentBadge val="30%" /><PercentBadge val="70%" /></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEÇÃO INFERIOR: RACES */}
            <div className={styles.card}>
                <div className={styles.racesTitle}>Races</div>
                <div className={styles.teamsRow}>
                    <div className={styles.team}><img src="https://cdn.sportmonks.com/images/soccer/teams/22/3030.png" width="20" /> {homeTeam}</div>
                    <span>vs</span>
                    <div className={styles.team}>{awayTeam} <img src="https://cdn.sportmonks.com/images/soccer/teams/19/3027.png" width="20" /></div>
                </div>
                <div className={styles.raceList}>
                    <div className={styles.raceHeaderRow}>
                        <div className={styles.dualLabel}><span>Vitórias</span><span>Derrotas</span></div>
                        <div></div>
                        <div className={styles.dualLabel}><span>Vitórias</span><span>Derrotas</span></div>
                    </div>
                    {races.map((r, i) => (
                        <div key={i} className={styles.raceRow}>
                            <div className={styles.dualVal}><PercentBadge val={r.homeW} /><PercentBadge val={r.homeL} /></div>
                            <span className={styles.raceLabel}>{r.label}</span>
                            <div className={styles.dualVal}><PercentBadge val={r.awayW} /><PercentBadge val={r.awayL} /></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}