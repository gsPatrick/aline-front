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

export default function CardsAnalysis({ homeTeam = "Time Casa", awayTeam = "Time Fora", homeLogo, awayLogo, referee, data: propData }) {
    const [activeTab, setActiveTab] = useState('ft'); // 'ft', 'ht', '2ht'

    // MOCK DATA (Fallback)
    const mockData = {
        averages: {
            favor: { home: 1.9, away: 2.8 },
            against: { home: 2.6, away: 3.0 },
            total: { home: 4.5, away: 5.8 }
        },
        totalCards: [
            { label: 'Over 0.5', homeM: '90', homeS: '-', awayM: '100', awayS: '-' },
            { label: 'Over 1.5', homeM: '60', homeS: '-', awayM: '80', awayS: '-' },
            { label: 'Over 2.5', homeM: '40', homeS: '-', awayM: '70', awayS: '-' },
            { label: 'Over 3.5', homeM: '20', homeS: '-', awayM: '50', awayS: '-' },
        ],
        htCards: [
            { label: 'Over 0.5', homeM: '70', homeS: '-', awayM: '80', awayS: '-' },
            { label: 'Over 1.5', homeM: '40', homeS: '-', awayM: '50', awayS: '-' },
        ],
        shCards: [
            { label: 'Over 0.5', homeM: '80', homeS: '-', awayM: '90', awayS: '-' },
            { label: 'Over 1.5', homeM: '50', homeS: '-', awayM: '60', awayS: '-' },
        ],
        intervals: [
            { period: "0-15'", pct: "0", avgFavor: 0, avgContra: 0, total: 0, pctOverall: "50", avgFavorA: 5, avgContraA: 0, totalA: 5 },
            { period: "16-30", pct: "40", avgFavor: 7, avgContra: 0, total: 7, pctOverall: "40", avgFavorA: 0, avgContraA: 0, totalA: 5 },
            { period: "31-HT", pct: "60", avgFavor: 8, avgContra: 0, total: 8, pctOverall: "60", avgFavorA: 0, avgContraA: 0, totalA: 11 },
            { period: "46-60", pct: "60", avgFavor: 7, avgContra: 0, total: 7, pctOverall: "60", avgFavorA: 0, avgContraA: 0, totalA: 8 },
            { period: "61-75", pct: "50", avgFavor: 9, avgContra: 0, total: 9, pctOverall: "40", avgFavorA: 0, avgContraA: 0, totalA: 8 },
            { period: "76-FT'", pct: "80", avgFavor: 24, avgContra: 0, total: 24, pctOverall: "90", avgFavorA: 0, avgContraA: 0, totalA: 22 },
        ],
        referee: {
            avg: 5.3,
            over05: "100",
            over15: "100",
            over25: "90",
            over35: "80",
            over45: "50"
        }
    };

    const data = propData || mockData;

    // Select total cards based on active tab
    let currentTotalRows = data.totalCards || [];
    if (activeTab === 'ht' && data.htCards) currentTotalRows = data.htCards;
    else if (activeTab === '2ht' && data.shCards) currentTotalRows = data.shCards;

    // DEBUG: Log what data is available
    if (typeof window !== 'undefined') {
        console.log('[CardsAnalysis] Active tab:', activeTab);
        console.log('[CardsAnalysis] Data available:', {
            totalCards: data.totalCards?.length || 0,
            htCards: data.htCards?.length || 0,
            shCards: data.shCards?.length || 0,
            currentRows: currentTotalRows.length
        });
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.mainTitle}>Análise Detalhada</h3>

            {/* CARD 1: MÉDIAS E TOTAIS */}
            <div className={styles.card}>
                {/* Header Tabs */}
                <div className={styles.cardHeader}>
                    <span className={styles.tabTitle}>Cartões Análise</span>
                    <div className={styles.tabBtns}>
                        <button
                            className={`${styles.btn} ${activeTab === 'ft' ? styles.active : ''}`}
                            onClick={() => setActiveTab('ft')}
                        >Terminado</button>
                        <button
                            className={`${styles.btn} ${activeTab === 'ht' ? styles.active : ''}`}
                            onClick={() => setActiveTab('ht')}
                        >1ª Parte</button>
                        <button
                            className={`${styles.btn} ${activeTab === '2ht' ? styles.active : ''}`}
                            onClick={() => setActiveTab('2ht')}
                        >2ª Parte</button>
                    </div>
                </div>

                {/* Times */}
                <div className={styles.teamsRow}>
                    <div className={styles.team}>
                        {homeLogo && <img src={homeLogo} alt="" onError={(e) => e.target.style.display = 'none'} />}
                        <span>{homeTeam}</span>
                    </div>
                    <div className={styles.team}>
                        <span>{awayTeam}</span>
                        {awayLogo && <img src={awayLogo} alt="" onError={(e) => e.target.style.display = 'none'} />}
                    </div>
                </div>

                {/* Tabela Médias */}
                <div className={styles.averagesTable}>
                    <div className={styles.avgRow}>
                        <span>{data.averages?.favor?.home || '-'}</span>
                        <span className={styles.avgLabel}>Média a favor</span>
                        <span>{data.averages?.favor?.away || '-'}</span>
                    </div>
                    <div className={styles.avgRow}>
                        <span>{data.averages?.against?.home || '-'}</span>
                        <span className={styles.avgLabel}>Média contra</span>
                        <span>{data.averages?.against?.away || '-'}</span>
                    </div>
                    <div className={styles.avgRow}>
                        <span>{data.averages?.total?.home || '-'}</span>
                        <span className={styles.avgLabel}>Média total</span>
                        <span>{data.averages?.total?.away || '-'}</span>
                    </div>
                </div>

                {/* Tabela Total Cartões (Over) */}
                <div className={styles.totalsTable}>
                    <div className={styles.totalsHeader}>
                        <span>Total Cartões</span>
                        <div className={styles.dualHead}><span>Marcados</span><span>Sofridos</span></div>
                        <div className={styles.dualHead}><span>Marcados</span><span>Sofridos</span></div>
                    </div>
                    {currentTotalRows.length > 0 ? currentTotalRows.map((row, i) => (
                        <TotalRow
                            key={i}
                            label={row.label}
                            homeM={row.homeM} homeS={row.homeS}
                            awayM={row.awayM} awayS={row.awayS}
                        />
                    )) : (
                        <div className={styles.noData}>Sem dados disponíveis</div>
                    )}
                </div>
            </div>

            {/* CARD 2: INTERVALOS */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.tabTitle}>Cartões Amarelos Por Parte</span>
                </div>
                <div className={styles.teamsSmall}>
                    {homeLogo && <img src={homeLogo} width="20" alt="" onError={(e) => e.target.style.display = 'none'} />} {homeTeam}
                    <span style={{ flex: 1 }}></span>
                    {awayTeam} {awayLogo && <img src={awayLogo} width="20" alt="" onError={(e) => e.target.style.display = 'none'} />}
                </div>

                <div className={styles.intervalScroll}>
                    <table className={styles.intervalTable}>
                        <thead>
                            <tr>
                                <th>Média a Favor</th><th>Média Contra</th><th>Total</th><th>%</th>
                                <th>Período</th>
                                <th>%</th><th>Média a Favor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.intervals || []).map((row, i) => (
                                <tr key={i}>
                                    <td>{row.avgFavor}</td><td>{row.avgContra}</td><td>{row.total}</td>
                                    <td><PercentBadge val={row.pct} /></td>
                                    <td className={styles.period}>{row.period}</td>
                                    <td><PercentBadge val={row.pctOverall} /></td>
                                    <td>{row.avgFavorA}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CARD 3: ESTATÍSTICAS DO ÁRBITRO */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.tabTitle}>Estatísticas do Árbitro</span>
                </div>
                <div className={styles.refereeContent}>
                    <div className={styles.refereeRowMain}>
                        <span>Média total</span>
                        <span className={styles.refValBig}>{data.referee?.avg || referee?.avgCards || '-'}</span>
                    </div>
                    <div className={styles.refereeList}>
                        <div className={styles.refRow}><span>Over 0.5 Cartões Amarelos</span><PercentBadge val={data.referee?.over05 || referee?.over05 || '-'} /></div>
                        <div className={styles.refRow}><span>Over 1.5 Cartões Amarelos</span><PercentBadge val={data.referee?.over15 || referee?.over15 || '-'} /></div>
                        <div className={styles.refRow}><span>Over 2.5 Cartões Amarelos</span><PercentBadge val={data.referee?.over25 || referee?.over25 || '-'} /></div>
                        <div className={styles.refRow}><span>Over 3.5 Cartões Amarelos</span><PercentBadge val={data.referee?.over35 || referee?.over35 || '-'} /></div>
                        <div className={styles.refRow}><span>Over 4.5 Cartões Amarelos</span><PercentBadge val={data.referee?.over45 || referee?.over45 || '-'} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}