'use client';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from './CornerProPredictions.module.css';

export default function CornerProPredictions({ stats, competitions }) {
    const [selectedLeague, setSelectedLeague] = useState(competitions?.[0]?.name || 'Todos');
    const [showDropdown, setShowDropdown] = useState(false);

    // Default stats structure
    const defaultStats = {
        avgGoals: 0,
        goalsScored: 0,
        goalsConceded: 0,
        over05HT: 0,
        over15FT: 0,
        over25FT: 0,
        btts: 0,
        avgCorners: 0,
        over85Corners: 0,
        over95Corners: 0,
        corners37HT: 0,
        corners80FT: 0
    };

    const data = { ...defaultStats, ...stats };

    const statCards = [
        { key: 'avgGoals', label: 'Média Golos', value: data.avgGoals, color: 'cyan', type: 'number' },
        { key: 'goalsScored', label: 'Golos Marcados', value: data.goalsScored, color: 'green', type: 'number' },
        { key: 'goalsConceded', label: 'Sofridos', value: data.goalsConceded, color: 'orange', type: 'number' },
        { key: 'over05HT', label: 'Over 0.5 Golos HT', value: data.over05HT, color: 'cyan', type: 'percent' },
        { key: 'over15FT', label: 'Over 1.5 Golos FT', value: data.over15FT, color: 'green', type: 'percent' },
        { key: 'over25FT', label: 'Over 2.5 Golos FT', value: data.over25FT, color: 'orange', type: 'percent' },
        { key: 'btts', label: 'Ambas marcam', value: data.btts, color: 'cyan', type: 'percent' },
        { key: 'avgCorners', label: 'Média Cantos', value: data.avgCorners, color: 'default', type: 'number' },
        { key: 'over85Corners', label: 'Over 8.5 Cantos', value: data.over85Corners, color: 'orange', type: 'percent' },
        { key: 'over95Corners', label: 'Over 9.5 Cantos', value: data.over95Corners, color: 'cyan', type: 'percent' },
        { key: 'corners37HT', label: 'Cantos 37-HT %', value: data.corners37HT, color: 'green', type: 'percent' },
        { key: 'corners80FT', label: 'Cantos 80FT %', value: data.corners80FT, color: 'orange', type: 'percent' }
    ];

    const formatValue = (value, type) => {
        if (type === 'percent') return `${value}%`;
        return value.toFixed(2);
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Previsões CornerPro</h3>

            {/* League Dropdown */}
            <div className={styles.dropdownWrapper}>
                <button
                    className={styles.dropdown}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <span>{selectedLeague}</span>
                    <FaChevronDown className={showDropdown ? styles.rotated : ''} />
                </button>

                {showDropdown && competitions && competitions.length > 0 && (
                    <div className={styles.dropdownMenu}>
                        {competitions.map((comp, i) => (
                            <button
                                key={i}
                                className={styles.dropdownItem}
                                onClick={() => {
                                    setSelectedLeague(comp.name);
                                    setShowDropdown(false);
                                }}
                            >
                                {comp.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className={styles.grid}>
                {statCards.map((stat) => (
                    <div
                        key={stat.key}
                        className={`${styles.statCard} ${styles[`color${stat.color}`]}`}
                    >
                        <span className={styles.statLabel}>{stat.label}</span>
                        <span className={styles.statValue}>{formatValue(stat.value, stat.type)}</span>
                        {stat.type === 'percent' && (
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progress}
                                    style={{ width: `${Math.min(stat.value, 100)}%` }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
