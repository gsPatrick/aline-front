'use client';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import MatchHeader from "@/components/MatchHeader/MatchHeader";
import MatchAnalysisSidebar from "@/components/MatchAnalysisSidebar/MatchAnalysisSidebar";
import MatchContentTabs from "@/components/MatchContentTabs/MatchContentTabs";
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

export default function MatchPage() {
    const params = useParams();
    const matchId = params?.id;

    const { match, loading, error, isLive } = useMatchDetails(matchId);

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

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <div className={styles.contentLayout}>
                <Sidebar />
                <main className={styles.mainContent}>
                    <motion.div
                        variants={pageVariants}
                        initial="hidden"
                        animate="visible"
                        className={styles.matchContainer}
                    >
                        {/* Match Header */}
                        <MatchHeader match={match} />

                        {/* Main Grid: Sidebar (3 cols) + Content (9 cols) */}
                        <div className={styles.matchGrid}>
                            {/* Left Sidebar - Analysis */}
                            <aside className={styles.analysisSidebar}>
                                <MatchAnalysisSidebar match={match} />
                            </aside>

                            {/* Right Content - Tabs */}
                            <div className={styles.matchContent}>
                                <MatchContentTabs match={match} />
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}