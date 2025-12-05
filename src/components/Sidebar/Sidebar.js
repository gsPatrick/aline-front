'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaAngleDown, FaAngleRight, FaAngleLeft, FaTrophy, FaFire } from 'react-icons/fa';
import { useLeagues } from '@/hooks/useLeagues';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { leagues, loading, page, nextPage, prevPage } = useLeagues();
  const [expanded, setExpanded] = useState({ 'Todas as Ligas': true });

  const toggleSection = (category) => {
    setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // Agrupando ligas
  const popularLeagues = leagues; // Mostra todas as ligas retornadas pela API

  return (
    <aside className={styles.sidebar}>
      <div className={styles.scrollContainer}>

        {/* Seção Dinâmica */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection('Todas as Ligas')}
          >
            <div className={styles.sectionTitle}>
              <FaTrophy className={styles.fireIcon} />
              <span>Ligas Disponíveis</span>
            </div>
            <span className={styles.toggleIcon}>
              {expanded['Todas as Ligas'] ? <FaAngleDown /> : <FaAngleRight />}
            </span>
          </div>

          <AnimatePresence>
            {expanded['Todas as Ligas'] && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={styles.leagueList}
              >
                {loading && popularLeagues.length === 0 ? (
                  <li className={styles.loadingItem}>Carregando...</li>
                ) : (
                  popularLeagues.map((league) => {
                    const isActive = pathname.includes(String(league.id));
                    return (
                      <li key={league.id}>
                        <Link
                          href={`/leagues/${league.id}`}
                          className={`${styles.leagueItem} ${isActive ? styles.active : ''}`}
                        >
                          <div className={styles.leagueInfo}>
                            {league.logo ? (
                              <img src={league.logo} alt={league.name} className={styles.flagIcon} />
                            ) : (
                              <span className={styles.flagPlaceholder} />
                            )}
                            <span className={styles.name}>{league.name}</span>
                          </div>
                          {isActive && <motion.div layoutId="sidebarActive" className={styles.activeGlow} />}
                        </Link>
                      </li>
                    );
                  })
                )}
                {/* Paginação com Setas */}
                <li className={styles.paginationContainer}>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevPage(); }}
                    className={styles.pageBtn}
                    disabled={page === 1 || loading}
                  >
                    <FaAngleLeft />
                  </button>
                  <span className={styles.pageInfo}>{page}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextPage(); }}
                    className={styles.pageBtn}
                    disabled={loading}
                  >
                    <FaAngleRight />
                  </button>
                </li>
                {loading && popularLeagues.length > 0 && (
                  <li className={styles.loadingItem}>Carregando mais...</li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>


      </div>
    </aside>
  );
}