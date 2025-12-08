'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import MatchHeader from "@/components/MatchHeader/MatchHeader";
import StatsTabs from "@/components/StatsTabs/StatsTabs";
import MatchContent from "@/components/MatchContent/MatchContent";
import { useMatchDetails } from '@/hooks/useMatchDetails';
import { FaSpinner, FaExclamationTriangle, FaFilter } from 'react-icons/fa';
import styles from "./page.module.css";

// Variantes de Animação para entrada da página
const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function MatchPage() {
    const params = useParams();
    const matchId = params?.id;

    // Use enhanced hook with filter support
    const { match, loading, error, filterCondition, setFilterCondition, isLive, refetch } = useMatchDetails(matchId);

    // Estado para controlar qual aba está visível
    const [activeTab, setActiveTab] = useState('overview');

    // --- RENDER: LOADING ---
    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.contentLayout}>
                    <Sidebar />
                    <main className={styles.mainContent}>
                        <div className={styles.loadingScreen}>
                            <FaSpinner className={styles.spinner} />
                            <p className={styles.loadingText}>Analisando dados táticos...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // --- RENDER: ERRO ---
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

    // --- RENDER: CONTEÚDO PRINCIPAL ---
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
                        {/* 1. Cabeçalho com Placar e Times */}
                        <MatchHeader match={match} isLive={isLive} />

                        {/* 2. Filter Toggle (for Goals, Corners, Cards tabs) */}
                        {['goals', 'corners', 'cards'].includes(activeTab) && (
                            <div className={styles.filterContainer}>
                                <FaFilter className={styles.filterIcon} />
                                <div className={styles.filterToggle}>
                                    <button
                                        className={`${styles.filterBtn} ${filterCondition === 'ALL' ? styles.active : ''}`}
                                        onClick={() => setFilterCondition('ALL')}
                                    >
                                        Geral
                                    </button>
                                    <button
                                        className={`${styles.filterBtn} ${filterCondition === 'HOME' ? styles.active : ''}`}
                                        onClick={() => setFilterCondition('HOME')}
                                    >
                                        Casa
                                    </button>
                                    <button
                                        className={`${styles.filterBtn} ${filterCondition === 'AWAY' ? styles.active : ''}`}
                                        onClick={() => setFilterCondition('AWAY')}
                                    >
                                        Fora
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 3. Menu de Abas */}
                        <StatsTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            matchStatus={match.matchInfo?.state || 'NS'}
                        />

                        {/* 4. Conteúdo Dinâmico */}
                        <div className={styles.scrollableContent}>
                            <MatchContent
                                activeTab={activeTab}
                                match={match}
                                filterCondition={filterCondition}
                                isLive={isLive}
                            />
                        </div>

                    </motion.div>
                </main>
            </div>
        </div>
    );
}