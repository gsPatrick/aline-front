'use client';
import { FaChartLine, FaFutbol, FaFlag, FaIdCard, FaChartBar, FaUsers } from 'react-icons/fa';
import styles from './MatchTabs.module.css';

const TABS = [
    { id: 'overview', label: 'Análise Global', icon: FaChartLine },
    { id: 'goals', label: 'Golos', icon: FaFutbol },
    { id: 'corners', label: 'Cantos', icon: FaFlag },
    { id: 'cards', label: 'Cartões', icon: FaIdCard },
    { id: 'charts', label: 'Gráficos', icon: FaChartBar },
    { id: 'squad', label: 'Jogadores', icon: FaUsers }
];

export default function MatchTabs({ activeTab, onTabChange }) {
    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabsList}>
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            <Icon className={styles.icon} />
                            <span className={styles.label}>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
