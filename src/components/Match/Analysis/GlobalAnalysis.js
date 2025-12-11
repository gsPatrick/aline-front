'use client';
import { useState } from 'react';
import styles from './GlobalAnalysis.module.css';
import LineupsView from './LineupsView';
import StatsView from './StatsView';
import EventsView from './EventsView';
import StandingsView from './StandingsView';

const LEVEL_2_TABS = [
    { id: 'lineups', label: 'Onzes Iniciais' },
    { id: 'stats', label: 'Dados do Jogo' },
    { id: 'events', label: 'Eventos Jogo' },
    { id: 'standings', label: 'Tabela Classificativa' },
    { id: 'odds', label: 'Odds' }
];

export default function GlobalAnalysis({ match }) {
    const [activeTab, setActiveTab] = useState('events'); // Default conforme print 2

    return (
        <div className={styles.container}>
            {/* Navegação Nível 2 */}
            <div className={styles.tabsHeader}>
                {LEVEL_2_TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo Nível 2 */}
            <div className={styles.content}>
                {activeTab === 'lineups' && <LineupsView match={match} />}
                {activeTab === 'stats' && <StatsView match={match} />}
                {activeTab === 'events' && <EventsView match={match} />}
                {activeTab === 'standings' && <StandingsView match={match} />}
                {activeTab === 'odds' && <div className={styles.placeholder}>Odds Component Here</div>}
            </div>
        </div>
    );
}