'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { useLeagues } from '@/hooks/useLeagues';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { leagues, loading } = useLeagues();
  const [searchQuery, setSearchQuery] = useState('');

  // Remove duplicates by ID and filter by search
  const uniqueLeagues = useMemo(() => {
    const seen = new Set();
    const unique = [];

    leagues.forEach(league => {
      if (!seen.has(league.id)) {
        seen.add(league.id);
        unique.push(league);
      }
    });

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return unique.filter(l =>
        l.name.toLowerCase().includes(query)
      );
    }

    return unique;
  }, [leagues, searchQuery]);

  // Check if a league is active - exact match only
  const isLeagueActive = (leagueId) => {
    return pathname === `/leagues/${leagueId}`;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.scrollContainer}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerLabel}>POPULAR LEAGUES</span>
        </div>

        {/* Search */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search leagues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* League List */}
        <ul className={styles.leagueList}>
          {loading && uniqueLeagues.length === 0 ? (
            <li className={styles.loadingItem}>Loading...</li>
          ) : (
            uniqueLeagues.map((league) => {
              const isActive = isLeagueActive(league.id);
              return (
                <li key={`league-${league.id}`}>
                  <Link
                    href={`/leagues/${league.id}`}
                    className={`${styles.leagueItem} ${isActive ? styles.active : ''}`}
                  >
                    <div className={styles.leagueInfo}>
                      {league.logo ? (
                        <img
                          src={league.logo}
                          alt=""
                          className={styles.leagueLogo}
                        />
                      ) : (
                        <div className={styles.logoPlaceholder} />
                      )}
                      <div className={styles.leagueText}>
                        <span className={styles.leagueName}>{league.name}</span>
                        {league.country?.name && (
                          <span className={styles.countryName}>{league.country.name}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })
          )}
          {uniqueLeagues.length === 0 && !loading && (
            <li className={styles.noResults}>No leagues found</li>
          )}
        </ul>
      </div>
    </aside>
  );
}