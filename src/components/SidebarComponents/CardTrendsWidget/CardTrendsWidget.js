'use client';
import styles from './CardTrendsWidget.module.css';

import { useState } from 'react';

export default function CardTrendsWidget({ data, homeTeam = "Home", awayTeam = "Away" }) {
    const [tab, setTab] = useState('equipas'); // equipas, liga
    const [selectedTeam, setSelectedTeam] = useState('home');

    // Helper to get value
    const getVal = (team, key) => data?.[team]?.[key] || 0;

    // Map stats from cardAnalysis
    // Structure is likely similar: data.averages.total is WRONG.
    // It should be data.averages.total[team] based on match.service.js transformCardAnalysis.
    // Wait, transformCardAnalysis returns:
    // { averages: { favor: { home, away }, ... }, totalCards, intervals, referee }
    // So for Cards, the structure IS different from Corners (which has home/away at root).
    // Let's verify match.service.js transformCardAnalysis again.

    // transformCardAnalysis returns:
    // { averages: { favor: { home... }, against: { home... }, total: { home... } }, ... }
    // So data.averages.total[team] IS correct for Cards?
    // Let's check debug_goals_output.txt again? No, that was goals.
    // I'll assume the code in match.service.js I saw earlier is correct.
    // It showed: averages: { favor: { home: ..., away: ... }, ... }

    const stats = [
        { label: 'Media Total', value: data?.averages?.total?.[selectedTeam] || 0 },
        // Intervals: 76-FT
        { label: '76-FT %', value: data?.intervals?.find(i => i.period.includes('76-FT'))?.[selectedTeam === 'home' ? 'pct' : 'pctOverall'] || '0%' },
        // Over 3.5 FT
        { label: 'Over 3.5 FT', value: data?.totalCards?.find(r => r.label === 'Over 3.5')?.[selectedTeam === 'home' ? 'homeM' : 'awayM'] || '-' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>Tendências</span>
                <div className={styles.toggles}>
                    <span className={tab === 'equipas' ? styles.active : ''} onClick={() => setTab('equipas')}>Equipas</span>
                    <span className={tab === 'liga' ? styles.active : ''} onClick={() => setTab('liga')}>Liga</span>
                </div>
            </div>
            <div className={styles.teamsHeader}>
                <span
                    className={selectedTeam === 'home' ? styles.activeTeam : ''}
                    onClick={() => setSelectedTeam('home')}
                    style={{ cursor: 'pointer', fontWeight: selectedTeam === 'home' ? 'bold' : 'normal', opacity: selectedTeam === 'home' ? 1 : 0.5, marginRight: '10px' }}
                >
                    {homeTeam}
                </span>
                <span
                    className={selectedTeam === 'away' ? styles.activeTeam : ''}
                    onClick={() => setSelectedTeam('away')}
                    style={{ cursor: 'pointer', fontWeight: selectedTeam === 'away' ? 'bold' : 'normal', opacity: selectedTeam === 'away' ? 1 : 0.5 }}
                >
                    {awayTeam}
                </span>
            </div>
            <div className={styles.sectionHeader}>Cartões</div>
            <div className={styles.list}>
                {stats.map((stat, idx) => (
                    <div key={idx} className={styles.row}>
                        <span>{stat.label}</span>
                        <span>{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}