'use client';
import { useState } from 'react';
import styles from './TeamTrends.module.css';

export default function TeamTrends({ homeTeam = "Home", awayTeam = "Away", data }) {
    const [tab, setTab] = useState('equipas'); // equipas, liga
    const [selectedTeam, setSelectedTeam] = useState('home');

    // Helper to get value
    const getVal = (team, key) => data?.[team]?.[key] || 0;

    const stats = [
        { label: 'Vitórias', value: `${getVal(selectedTeam, 'wins')}%` },
        { label: 'Média Golos Marcados', value: getVal(selectedTeam, 'scored') },
        { label: 'Média Golos Marcados + Sofridos', value: getVal(selectedTeam, 'avgTotal') },
        { label: 'Ambas Marcam %', value: `${getVal(selectedTeam, 'btts')}%` },
        { label: 'Over 1.5 %', value: `${getVal(selectedTeam, 'over15')}%` },
        { label: 'Over 2.5 %', value: `${getVal(selectedTeam, 'over25')}%` },
        { label: 'Golos 1ª Parte (0-45)', value: getVal(selectedTeam, 'intervals')?.['0-15']?.scored + getVal(selectedTeam, 'intervals')?.['16-30']?.scored + getVal(selectedTeam, 'intervals')?.['31-HT']?.scored || 0 },
    ];

    return (
        <div className={styles.container}>
            {/* Header Tabs */}
            <div className={styles.header}>
                <span className={styles.title}>Tendências</span>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${tab === 'equipas' ? styles.active : ''}`}
                        onClick={() => setTab('equipas')}
                    >
                        Equipas
                    </button>
                    <button
                        className={`${styles.tabBtn} ${tab === 'liga' ? styles.active : ''}`}
                        onClick={() => setTab('liga')}
                    >
                        Liga
                    </button>
                </div>
            </div>

            {/* Teams Header */}
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

            {/* Category Title */}
            <div className={styles.categoryTitle}>Golos</div>

            {/* Stats List */}
            {tab === 'equipas' ? (
                <div className={styles.list}>
                    {stats.map((stat, idx) => (
                        <div key={idx} className={styles.row}>
                            <span className={styles.label}>{stat.label}</span>
                            <span className={styles.value}>{stat.value}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.list} style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    Dados da Liga indisponíveis
                </div>
            )}
        </div>
    );
}