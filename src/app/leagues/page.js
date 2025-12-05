'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTrophy, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import BottomNav from "@/components/BottomNav/BottomNav";
import { useLeagues } from '@/hooks/useLeagues';
import styles from './page.module.css';

export default function LeaguesPage() {
    const { leagues, loading, page, nextPage, prevPage } = useLeagues();
    const [searchTerm, setSearchTerm] = useState('');

    // Client-side filtering (since API might not support search yet)
    const filteredLeagues = leagues.filter(league =>
        league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (league.country && league.country.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className={styles.pageWrapper}>
            <Header />

            <div className={styles.contentContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        <FaTrophy className={styles.titleIcon} />
                        Ligas
                    </h1>

                    <div className={styles.searchContainer}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar liga ou país..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <FaTrophy className={styles.spinner} />
                        <p>Carregando ligas...</p>
                    </div>
                ) : (
                    <>
                        <motion.div
                            className={styles.leaguesGrid}
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {filteredLeagues.map((league) => (
                                <Link key={league.id} href={`/leagues/${league.id}`} passHref legacyBehavior>
                                    <motion.a className={styles.leagueCard} variants={itemVariants}>
                                        <div className={styles.cardHeader}>
                                            {league.logo ? (
                                                <img src={league.logo} alt={league.name} className={styles.leagueLogo} />
                                            ) : (
                                                <div className={styles.placeholderLogo}>🏆</div>
                                            )}
                                            <div className={styles.cardInfo}>
                                                <h3 className={styles.leagueName}>{league.name}</h3>
                                                {league.country && (
                                                    <span className={styles.leagueCountry}>
                                                        {league.country}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.cardFooter}>
                                            {league.season && (
                                                <span className={styles.seasonBadge}>
                                                    {league.season}
                                                </span>
                                            )}
                                            <FaChevronRight className={styles.arrowIcon} />
                                        </div>
                                    </motion.a>
                                </Link>
                            ))}
                        </motion.div>

                        {/* Pagination Controls */}
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                onClick={prevPage}
                                disabled={page === 1 || loading}
                            >
                                <FaChevronLeft />
                            </button>
                            <span className={styles.pageIndicator}>Página {page}</span>
                            <button
                                className={styles.pageBtn}
                                onClick={nextPage}
                                disabled={loading}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
