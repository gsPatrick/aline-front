import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './MatchContent.module.css';

const AnalysisTable = ({ predictionsTable }) => {
    const [activeFilter, setActiveFilter] = useState('full_time');

    if (!predictionsTable) return null;

    const filters = [
        { key: 'full_time', label: 'Jogo Completo' },
        { key: 'first_half', label: '1º Tempo' },
        { key: 'second_half', label: '2º Tempo' }
    ];

    const currentData = predictionsTable[activeFilter] || {};

    // Função para determinar a cor baseada na porcentagem
    const getProbabilityColor = (percentage) => {
        const val = parseFloat(percentage);
        if (val >= 75) return '#4caf50'; // Verde forte
        if (val >= 60) return '#8bc34a'; // Verde claro
        if (val >= 40) return '#ffc107'; // Amarelo
        if (val >= 20) return '#ff9800'; // Laranja
        return '#f44336'; // Vermelho
    };

    return (
        <div className={styles.analysisTableContainer}>
            {/* Filtros */}
            <div className={styles.filterButtons}>
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        className={`${styles.filterBtn} ${activeFilter === filter.key ? styles.activeFilter : ''}`}
                        onClick={() => setActiveFilter(filter.key)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Tabela */}
            <div className={styles.tableWrapper}>
                <table className={styles.analysisTable}>
                    <thead>
                        <tr>
                            <th>Mercado</th>
                            <th>Casa</th>
                            <th>Fora</th>
                            <th>Jogo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(currentData).map(([market, stats]) => (
                            <tr key={market}>
                                <td className={styles.marketName}>{market.replace(/_/g, ' ').toUpperCase()}</td>
                                <td>
                                    <div className={styles.probCell}>
                                        <span style={{ color: getProbabilityColor(stats.home) }}>{stats.home}%</span>
                                        <div className={styles.miniBar}>
                                            <div style={{ width: `${stats.home}%`, backgroundColor: getProbabilityColor(stats.home) }} />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.probCell}>
                                        <span style={{ color: getProbabilityColor(stats.away) }}>{stats.away}%</span>
                                        <div className={styles.miniBar}>
                                            <div style={{ width: `${stats.away}%`, backgroundColor: getProbabilityColor(stats.away) }} />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.probCell}>
                                        <span style={{ color: getProbabilityColor(stats.match) }}>{stats.match}%</span>
                                        <div className={styles.miniBar}>
                                            <div style={{ width: `${stats.match}%`, backgroundColor: getProbabilityColor(stats.match) }} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnalysisTable;
