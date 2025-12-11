'use client';
import styles from './CornerTrendsWidget.module.css';

import { useState } from 'react';

export default function CornerTrendsWidget({ data, homeTeam = "Home", awayTeam = "Away" }) {
    const [tab, setTab] = useState('equipas'); // equipas, liga
    const [selectedTeam, setSelectedTeam] = useState('home');

    // Helper to get value
    const getVal = (team, key) => data?.[team]?.[key] || 0;

    // Actually, let's look at the mock data:
    // "Média Cantos Favor", "Média Cantos Total", "Cantos 37-HT %", "Cantos 87FT %", "Over 8.5FT"

    // We have 'averages.favor' and 'averages.total'.
    // We have 'intervals' for periods.
    // We have 'totalCorners' for Over/Under.

    const stats = [
        { label: 'Média Cantos Favor', value: getVal(selectedTeam, 'avgFor') },
        { label: 'Média Cantos Total', value: getVal(selectedTeam, 'avgTotal') },
        // For intervals, let's sum up some periods or show a specific one?
        // Mock says "37-HT %". Maybe 31-HT?
        { label: 'Cantos 37-HT %', value: data?.intervals?.find(i => i.period.includes('37-HT'))?.[selectedTeam === 'home' ? 'pctH' : 'pctA'] + '%' || '0%' },
        { label: 'Cantos 87-FT %', value: data?.intervals?.find(i => i.period.includes('87-FT'))?.[selectedTeam === 'home' ? 'pctH' : 'pctA'] + '%' || '0%' },
        { label: 'Over 8.5 FT', value: data?.totalCorners?.find(r => r.label === 'Over 8.5')?.[selectedTeam === 'home' ? 'homeM' : 'awayM'] || '-' },
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
            <div className={styles.sectionHeader}>Cantos</div>
            <div className={styles.list}>
                {tab === 'equipas' ? (
                    stats.map((stat, idx) => (
                        <div key={idx} className={styles.row}>
                            <span>{stat.label}</span>
                            <span>{stat.value}</span>
                        </div>
                    ))
                ) : (
                    <div className={styles.noData}>
                        Dados da Liga indisponíveis
                    </div>
                )}
            </div>
        </div>
    );
}