'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaTrophy,
    FaChartLine,
    FaUsers,
    FaFutbol,
    FaMoneyBillWave
} from 'react-icons/fa';
import styles from './OverviewTab.module.css';

// Componentes Reutilizados (Nível 3)
import MatchStatsView from '../MatchStatsView/MatchStatsView';
import StandingsTab from '../StandingsTab/StandingsTab';
import LineupsTab from '@/components/Match/Analysis/LineupsTab';
import EventsTab from '@/components/MatchContentTabs/EventsTab';

export default function OverviewTab({ match }) {
    // Aba padrão interna agora é "Dados do Jogo" (stats) ou "Resumo"
    const [activeSubTab, setActiveSubTab] = useState('stats');

    if (!match) return null;

    const { analysis } = match;

    // Conteúdo da aba "Odds" (Simplificado para o Overview)
    const renderOddsTab = () => (
        <div className={styles.oddsContainer}>
            <h4 className={styles.subTabTitle}>Mercados Principais</h4>
            {match.goalMarkets ? (
                <div className={styles.oddsList}>
                    <div className={styles.oddRow}>
                        <span>Over 0.5 Gols</span>
                        <span className={styles.oddNum}>{match.goalMarkets.over05?.toFixed(2) || '-'}</span>
                    </div>
                    <div className={styles.oddRow}>
                        <span>Over 1.5 Gols</span>
                        <span className={styles.oddNum}>{match.goalMarkets.over15?.toFixed(2) || '-'}</span>
                    </div>
                    <div className={styles.oddRow}>
                        <span>Over 2.5 Gols</span>
                        <span className={styles.oddNum}>{match.goalMarkets.over25?.toFixed(2) || '-'}</span>
                    </div>
                    <div className={styles.oddRow}>
                        <span>Ambas Marcam (Sim)</span>
                        <span className={styles.oddNum}>1.85</span>
                    </div>
                </div>
            ) : (
                <p className={styles.noData}>Odds de mercado indisponíveis.</p>
            )}
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Navegação de Sub-Abas (Nível 2) */}
            <div className={styles.subTabsNav}>
                <button
                    className={`${styles.subTabBtn} ${activeSubTab === 'onze' ? styles.active : ''}`}
                    onClick={() => setActiveSubTab('onze')}
                >
                    <FaUsers /> Onzes Iniciais
                </button>
                <button
                    className={`${styles.subTabBtn} ${activeSubTab === 'stats' ? styles.active : ''}`}
                    onClick={() => setActiveSubTab('stats')}
                >
                    <FaChartLine /> Dados do Jogo
                </button>
                <button
                    className={`${styles.subTabBtn} ${activeSubTab === 'eventos' ? styles.active : ''}`}
                    onClick={() => setActiveSubTab('eventos')}
                >
                    <FaFutbol /> Eventos Jogo
                </button>
                <button
                    className={`${styles.subTabBtn} ${activeSubTab === 'classificacao' ? styles.active : ''}`}
                    onClick={() => setActiveSubTab('classificacao')}
                >
                    <FaTrophy /> Tabela Classificativa
                </button>
                <button
                    className={`${styles.subTabBtn} ${activeSubTab === 'odds' ? styles.active : ''}`}
                    onClick={() => setActiveSubTab('odds')}
                >
                    <FaMoneyBillWave /> Odds
                </button>
            </div>

            {/* Conteúdo Dinâmico */}
            <div className={styles.subTabContent}>
                <motion.div
                    key={activeSubTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* 1. Onzes Iniciais */}
                    {activeSubTab === 'onze' && <LineupsTab match={match} />}

                    {/* 2. Dados do Jogo (MatchStatsView) */}
                    {activeSubTab === 'stats' && (
                        <MatchStatsView
                            homeTeam={match.homeTeam}
                            awayTeam={match.awayTeam}
                            statsData={match.analysis?.detailedStats}
                        />
                    )}

                    {/* 3. Eventos Jogo */}
                    {activeSubTab === 'eventos' && <EventsTab match={match} />}

                    {/* 4. Tabela Classificativa */}
                    {activeSubTab === 'classificacao' && (
                        <StandingsTab
                            standings={analysis?.standings}
                            homeId={match.homeTeam?.id}
                            awayId={match.awayTeam?.id}
                        />
                    )}

                    {/* 5. Odds */}
                    {activeSubTab === 'odds' && renderOddsTab()}
                </motion.div>
            </div>
        </div>
    );
}