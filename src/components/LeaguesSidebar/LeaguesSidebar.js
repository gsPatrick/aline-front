'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLeagues } from '@/hooks/useLeagues';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import styles from './LeaguesSidebar.module.css';

export default function LeaguesSidebar() {
    const { leagues, loading, error } = useLeagues();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter leagues based on search
    const filteredLeagues = leagues.filter(league =>
        league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        league.country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className={styles.sidebar}>
                <div className={styles.loadingContainer}>
                    <FaSpinner className={styles.spinner} />
                    <p>Carregando ligas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.sidebar}>
                <div className={styles.errorContainer}>
                    <p>Erro ao carregar ligas</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <h3 className={styles.title}>Ligas</h3>
                <p className={styles.count}>{leagues.length} ligas disponíveis</p>
            </div>

            {/* Search Input */}
            <div className={styles.searchContainer}>
                <FaSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Buscar liga ou país..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Leagues List */}
            <div className={styles.leaguesList}>
                {filteredLeagues.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Nenhuma liga encontrada</p>
                    </div>
                ) : (
                    filteredLeagues.map(league => (
                        <Link
                            key={league.id}
                            href={`/leagues/${league.id}`}
                            className={styles.leagueItem}
                        >
                            <img
                                src={league.logo}
                                alt={league.name}
                                className={styles.leagueLogo}
                                onError={(e) => e.target.src = '/api/placeholder/32/32'}
                            />
                            <div className={styles.leagueInfo}>
                                <span className={styles.leagueName}>{league.name}</span>
                                <div className={styles.leagueCountry}>
                                    <img
                                        src={league.country.flag}
                                        alt={league.country.name}
                                        className={styles.countryFlag}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                    <span className={styles.countryName}>{league.country.name}</span>
                                </div>
                            </div>
                            {league.is_cup && (
                                <span className={styles.cupBadge}>Copa</span>
                            )}
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
