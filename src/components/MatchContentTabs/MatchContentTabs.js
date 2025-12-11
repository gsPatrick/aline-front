'use client';
import { useState } from 'react';
import { FaUsers, FaChartBar, FaListUl, FaTrophy, FaExchangeAlt } from 'react-icons/fa';
import LineupsTab from './LineupsTab';
import StatsTab from './StatsTab';
import EventsTab from './EventsTab';
import StandingsTab from './StandingsTab';
import H2HTab from './H2HTab';
import styles from './MatchContentTabs.module.css';

export default function MatchContentTabs({ match }) {
    const [activeTab, setActiveTab] = useState('stats');

    const tabs = [
        { id: 'lineups', label: 'Onze Iniciais', icon: FaUsers },
        { id: 'stats', label: 'Dados do Jogo', icon: FaChartBar },
        { id: 'events', label: 'Eventos Jogo', icon: FaListUl },
        { id: 'h2h', label: 'H2H', icon: FaExchangeAlt },
        { id: 'standings', label: 'Classificação', icon: FaTrophy }
    ];

    return (
        <div className={styles.container}>
            {/* Tab Navigation */}
            <div className={styles.tabNav}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTab === 'lineups' && <LineupsTab match={match} />}
                {activeTab === 'stats' && <StatsTab match={match} />}
                {activeTab === 'events' && <EventsTab match={match} />}
                {activeTab === 'h2h' && <H2HTab match={match} />}
                {activeTab === 'standings' && <StandingsTab match={match} />}
            </div>
        </div>
    );
}
