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

export default function CornersAnalysis({ homeTeam = "Home", awayTeam = "Away", homeLogo, awayLogo, data: propData, odds }) {
    const [activeTab, setActiveTab] = useState('ft'); // ft, ht, 2ht
    const [calcMin, setCalcMin] = useState(90);
    const [calcCorners, setCalcCorners] = useState(9);

    // Fallback data if propData is missing (though it should be passed)
    const { totalCorners, htCorners, shCorners, intervals, races, calculator } = propData || {};

    // Select rows based on active tab
    let currentTotalRows = [];
    if (activeTab === 'ft') currentTotalRows = totalCorners || [];
    else if (activeTab === 'ht') currentTotalRows = htCorners || [];
    else if (activeTab === '2ht') currentTotalRows = shCorners || [];

    // Slider Lookup Logic
    // Find the row in totalCorners that matches the slider value (approx)
    // E.g. if slider is 9, look for 'Over 8.5'
    const findProbability = (val) => {
        if (!totalCorners) return '-';
        // Simple heuristic: find row with label containing val-0.5
        // e.g. val=9 -> 'Over 8.5'
        const target = val - 0.5;
        const row = totalCorners.find(r => r.label.includes(target.toString()));
        if (row) {
            // Return average of home/away probability? Or just display both?
            // Let's return a string like "H: 60% / A: 50%"
            return `H: ${row.homeM} / A: ${row.awayM}`;
        }
        return '-';
    };

    const sliderProb = findProbability(calcCorners);

    // Handicap Logic
    // Filter for Corner Handicap markets
    const handicapMarkets = odds?.filter(o =>
        (o.market_description?.toLowerCase().includes('corner') && o.market_description?.toLowerCase().includes('handicap')) ||
        (o.market_description === 'Asian Handicap Corners')
    ) || [];

    // Group by handicap value
    // We expect odds to have a 'handicap' or 'total' property, or it might be in the label
    // SportMonks v3 usually has 'handicap' field in the odd object
    const handicapGroups = {};
    handicapMarkets.forEach(odd => {
        const line = odd.handicap || odd.total; // Try to find the line
        if (line) {
            if (!handicapGroups[line]) handicapGroups[line] = { line, home: '-', away: '-' };

            // Determine if it's Home or Away
            // label might be '1', 'Home', or team name
            const label = odd.label?.toLowerCase() || '';
            if (label === '1' || label === 'home' || label.includes(homeTeam.toLowerCase())) {
                handicapGroups[line].home = odd.value;
            } else if (label === '2' || label === 'away' || label.includes(awayTeam.toLowerCase())) {
                handicapGroups[line].away = odd.value;
            }
        }
    });

    const handicapRows = Object.values(handicapGroups).sort((a, b) => parseFloat(a.line) - parseFloat(b.line));

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
                            <button
                                className={`${styles.btn} ${activeTab === 'ft' ? styles.active : ''}`}
                                onClick={() => setActiveTab('ft')}
                            >
                                Terminado
                            </button>
                            <button
                                className={`${styles.btn} ${activeTab === 'ht' ? styles.active : ''}`}
                                onClick={() => setActiveTab('ht')}
                            >
                                1ª Parte
                            </button>
                            <button
                                className={`${styles.btn} ${activeTab === '2ht' ? styles.active : ''}`}
                                onClick={() => setActiveTab('2ht')}
                            >
                                2ª Parte
                            </button>
                        </div>
                    </div>

                    {/* Times */}
                    <div className={styles.teamsRow}>
                        <div className={styles.team}>
                            {/* Logos could be passed as props too, but for now using placeholders or just names */}
                            <span>{homeTeam}</span>
                        </div>
                        <div className={styles.team}>
                            <span>{awayTeam}</span>
                        </div>
                    </div>

                    {/* Médias (Could be dynamic if we had avg data here, for now keeping static or using calculator data) */}
                    <div className={styles.statsTable}>
                        <div className={styles.statRow}>
                            <span>{propData?.home?.avgFor || '-'}</span>
                            <span className={styles.statLabel}>Média a favor</span>
                            <span>{propData?.away?.avgFor || '-'}</span>
                        </div>
                        <div className={styles.statRow}>
                            <span>{propData?.home?.avgAgainst || '-'}</span>
                            <span className={styles.statLabel}>Média contra</span>
                            <span>{propData?.away?.avgAgainst || '-'}</span>
                        </div>
                        <div className={styles.statRow}>
                            <span>{propData?.home?.avgTotal || '-'}</span>
                            <span className={styles.statLabel}>Média total</span>
                            <span>{propData?.away?.avgTotal || '-'}</span>
                        </div>
                    </div>

                    {/* Calculadora */}
                    <div className={styles.calcArea}>
                        <h4>Calculadora de cantos</h4>
                        <div className={styles.sliderRow}>
                            <label>Minutos: {calcMin}</label>
                            <input
                                type="range"
                                min="0"
                                max="90"
                                value={calcMin}
                                onChange={(e) => setCalcMin(e.target.value)}
                                className={styles.slider}
                            />
                        </div>
                        <div className={styles.sliderRow}>
                            <label>Cantos: {calcCorners}</label>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={calcCorners}
                                onChange={(e) => setCalcCorners(e.target.value)}
                                className={styles.slider}
                            />
                        </div>
                        <div className={styles.calcResult}>
                            <span className={styles.blueBadge}>Esperado: {calculator?.expectedTotal || '-'}</span>
                            <span className={styles.blueBadge}>Prob Over {calcCorners}: {sliderProb}</span>
                        </div>
                    </div>

                    {/* Tabela Totais */}
                    <div className={styles.totalTable}>
                        <div className={styles.totalHeader}>
                            <span>Total Cantos</span>
                            <div className={styles.dualHead}><span>Marcados</span><span>Sofridos</span></div>
                            <div className={styles.dualHead}><span>Marcados</span><span>Sofridos</span></div>
                        </div>
                        {currentTotalRows.length > 0 ? currentTotalRows.map((row, i) => (
                            <div key={i} className={styles.totalRow}>
                                <div className={styles.labelCol}>{row.label}</div>
                                <div className={styles.dualVal}>
                                    <PercentBadge val={row.homeM} />
                                    {/* Only show 'Sofridos' if available (FT only usually) */}
                                    {row.homeS && row.homeS !== '-' && <PercentBadge val={row.homeS} />}
                                </div>
                                <div className={styles.dualVal}>
                                    <PercentBadge val={row.awayM} />
                                    {row.awayS && row.awayS !== '-' && <PercentBadge val={row.awayS} />}
                                </div>
                            </div>
                        )) : (
                            <div className={styles.noData}>Sem dados disponíveis</div>
                        )}
                    </div>
                </div>

                {/* Tabela de Intervalos */}
                <div className={styles.card}>
                    <h4 className={styles.cardHeaderSmall}>Cantos Por Intervalo</h4>
                    <div className={styles.teamsSmall}>
                        {homeLogo && <img src={homeLogo} width="20" alt="" onError={(e) => e.target.style.display = 'none'} />} {homeTeam}
                        <span style={{ flex: 1 }}></span>
                        {awayTeam} {awayLogo && <img src={awayLogo} width="20" alt="" onError={(e) => e.target.style.display = 'none'} />}
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
                    {/* Button removed as requested */}
                </div>

                {/* Handicap */}
                <div className={styles.card}>
                    <div className={styles.handicapHeader}>
                        <span>Handicap Cantos</span>
                        <span>Vencer</span>
                        <span>Derrota</span>
                    </div>
                    {handicapRows.length > 0 ? handicapRows.map((row, i) => (
                        <div key={i} className={styles.handicapRow}>
                            <div className={styles.dualVal}>
                                <span className={styles.blueBadge}>{row.home}</span>
                            </div>
                            <span style={{ fontWeight: 'bold' }}>{row.line}</span>
                            <div className={styles.dualVal}>
                                <span className={styles.blueBadge}>{row.away}</span>
                            </div>
                        </div>
                    )) : (
                        <div className={styles.noData} style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                            Dados de Handicap indisponíveis no momento
                        </div>
                    )}
                </div>
            </div>

            {/* SEÇÃO INFERIOR: RACES */}
            <div className={styles.card} style={{ marginTop: '20px' }}>
                <h4 className={styles.cardTitle}>Corridas (Races)</h4>
                <div className={styles.racesTable}>
                    <div className={styles.racesHeader}>
                        <span>Race</span>
                        <span>Casa</span>
                        <span>Fora</span>
                    </div>
                    {races && races.length > 0 ? races.map((row, i) => (
                        <div key={i} className={styles.raceRow}>
                            <span>{row.label}</span>
                            <div className={styles.raceBar}>
                                <div className={styles.raceFill} style={{ width: row.homeW, background: '#00ff88' }}></div>
                                <span className={styles.raceVal}>{row.homeW}</span>
                            </div>
                            <div className={styles.raceBar}>
                                <div className={styles.raceFill} style={{ width: row.awayW, background: '#ff3366' }}></div>
                                <span className={styles.raceVal}>{row.awayW}</span>
                            </div>
                        </div>
                    )) : (
                        <div className={styles.noData}>Sem dados de corridas</div>
                    )}
                </div>
            </div>
        </div>
    );
}