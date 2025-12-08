'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import MatchHeader from "@/components/MatchHeader/MatchHeader";
import MatchTabs from "@/components/MatchTabs/MatchTabs";
import OverviewTab from "@/components/MatchTabs/OverviewTab";
import GoalsTab from "@/components/MatchTabs/GoalsTab";
import CornersTab from "@/components/MatchTabs/CornersTab";
import CardsTab from "@/components/MatchTabs/CardsTab";
import ChartsTab from "@/components/MatchTabs/ChartsTab";
import SquadTab from "@/components/MatchTabs/SquadTab";
import { useMatchDetails } from '@/hooks/useMatchDetails';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import styles from "./page.module.css";

const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
};

export default function MatchPage() {
    const params = useParams();
    const matchId = params?.id;

    const { match, loading, error, filterCondition, setFilterCondition, isLive } = useMatchDetails(matchId);
    const [activeTab, setActiveTab] = useState('overview');

    // Loading State
    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.contentLayout}>
                    <Sidebar />
                    <main className={styles.mainContent}>
                        <div className={styles.loadingScreen}>
                            <FaSpinner className={styles.spinner} />
                            <p className={styles.loadingText}>Carregando análise da partida...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !match) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.contentLayout}>
                    <Sidebar />
                    <main className={styles.mainContent}>
                        <div className={styles.errorScreen}>
                            <FaExclamationTriangle size={48} className={styles.errorIcon} />
                            <h1 className={styles.errorTitle}>Partida não encontrada</h1>
                            <p className={styles.errorDesc}>{error || "Verifique o ID ou sua conexão."}</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Extract data from match object
    const { goalAnalysis, goalMarkets, cornerAnalysis, cardAnalysis, chartsAnalysis, generalStatsAnalysis, squad, h2h, history, matchInfo } = match;

    // Extract team names
    const homeTeam = matchInfo?.home_team?.name || 'Casa';
    const awayTeam = matchInfo?.away_team?.name || 'Fora';

    return (
        <div className={styles.pageWrapper}>
            <Header />

            <div className={styles.contentLayout}>
                <Sidebar />

                <main className={styles.mainContent}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={pageVariants}
                        className={styles.motionWrapper}
                    >
                        {/* Match Header */}
                        <MatchHeader match={match} />

                        {/* Tabs Navigation */}
                        <MatchTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />

                        {/* Tab Content */}
                        <div className={styles.tabContent}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    {activeTab === 'overview' && (
                                        <OverviewTab
                                            data={goalAnalysis}
                                            h2h={h2h}
                                            history={history}
                                        />
                                    )}

                                    {activeTab === 'goals' && (
                                        <GoalsTab
                                            goalAnalysis={goalAnalysis}
                                            goalMarkets={goalMarkets}
                                            homeTeam={homeTeam}
                                            awayTeam={awayTeam}
                                        />
                                    )}

                                    {activeTab === 'corners' && (
                                        <CornersTab
                                            homeData={cornerAnalysis?.home}
                                            awayData={cornerAnalysis?.away}
                                            homeTeam={homeTeam}
                                            awayTeam={awayTeam}
                                            chartsData={chartsAnalysis}
                                            isLive={isLive}
                                            currentMinute={matchInfo?.minute}
                                        />
                                    )}

                                    {activeTab === 'cards' && (
                                        <CardsTab
                                            data={cardAnalysis}
                                            referee={matchInfo?.referee}
                                        />
                                    )}

                                    {activeTab === 'charts' && (
                                        <ChartsTab
                                            generalStatsAnalysis={generalStatsAnalysis}
                                            matchState={matchInfo?.state}
                                        />
                                    )}

                                    {activeTab === 'squad' && (
                                        <SquadTab
                                            homeSquad={squad?.home}
                                            awaySquad={squad?.away}
                                            homeTeamName={match.homeTeam?.name}
                                            awayTeamName={match.awayTeam?.name}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Live Indicator */}
                        {isLive && (
                            <div className={styles.liveIndicator}>
                                <span className={styles.liveDot} />
                                Atualização automática a cada 30 segundos
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}