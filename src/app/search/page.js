'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFutbol, FaTrophy, FaUser, FaTimes, FaSpinner } from 'react-icons/fa';
import Header from '@/components/Header/Header';
import styles from './search.module.css';

const API_URL = 'https://10stats-dezstatsapi.qc6ju4.easypanel.host';

// Separate component for the search logic that uses useSearchParams
function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [activeFilter, setActiveFilter] = useState('all');
    const [results, setResults] = useState({ teams: [], leagues: [], players: [] });
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const filters = [
        { id: 'all', label: 'Todos', icon: <FaSearch /> },
        { id: 'teams', label: 'Times', icon: <FaFutbol /> },
        { id: 'leagues', label: 'Ligas', icon: <FaTrophy /> },
        { id: 'players', label: 'Jogadores', icon: <FaUser /> }
    ];

    const performSearch = useCallback(async (searchQuery, type = 'all') => {
        if (!searchQuery || searchQuery.length < 2) return;

        setLoading(true);
        setSearched(true);

        try {
            const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(searchQuery)}&type=${type}`);
            const data = await response.json();

            if (data.success) {
                setResults(data.data);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                performSearch(query, activeFilter);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query, activeFilter, performSearch]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query.length >= 2) {
            performSearch(query, activeFilter);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults({ teams: [], leagues: [], players: [] });
        setSearched(false);
    };

    const navigateTo = (type, id) => {
        switch (type) {
            case 'team':
                router.push(`/teams/${id}`);
                break;
            case 'league':
                router.push(`/leagues/${id}`);
                break;
            case 'player':
                router.push(`/players/${id}`);
                break;
        }
    };

    const totalResults = (results.teams?.length || 0) + (results.leagues?.length || 0) + (results.players?.length || 0);

    return (
        <div className={styles.searchPage}>
            {/* Hero Section */}
            <motion.div
                className={styles.hero}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className={styles.heroTitle}>Buscar</h1>
                <p className={styles.heroSubtitle}>Encontre times, ligas e jogadores</p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                className={styles.searchContainer}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <div className={styles.searchInputWrapper}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Digite o nome do time, liga ou jogador..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    {query && (
                        <button className={styles.clearBtn} onClick={clearSearch}>
                            <FaTimes />
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                className={styles.filters}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        <span className={styles.filterIcon}>{filter.icon}</span>
                        <span>{filter.label}</span>
                    </button>
                ))}
            </motion.div>

            {/* Results */}
            <div className={styles.resultsContainer}>
                {loading && (
                    <div className={styles.loadingState}>
                        <FaSpinner className={styles.spinner} />
                        <span>Buscando...</span>
                    </div>
                )}

                {!loading && searched && totalResults === 0 && (
                    <motion.div
                        className={styles.emptyState}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <FaSearch size={48} />
                        <h3>Nenhum resultado encontrado</h3>
                        <p>Tente buscar por outro termo</p>
                    </motion.div>
                )}

                {!loading && totalResults > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className={styles.resultsCount}>
                            {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
                        </p>

                        {/* Leagues Section */}
                        {(activeFilter === 'all' || activeFilter === 'leagues') && results.leagues?.length > 0 && (
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>
                                    <FaTrophy /> Ligas
                                </h2>
                                <div className={styles.grid}>
                                    {results.leagues.map(league => (
                                        <motion.div
                                            key={league.id}
                                            className={styles.card}
                                            onClick={() => navigateTo('league', league.id)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={styles.cardLogo}>
                                                {league.logo ? (
                                                    <img src={league.logo} alt={league.name} />
                                                ) : (
                                                    <FaTrophy size={32} />
                                                )}
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <h3>{league.name}</h3>
                                                <p>
                                                    {league.country_flag && <img src={league.country_flag} alt="" className={styles.flag} />}
                                                    {league.country}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Teams Section */}
                        {(activeFilter === 'all' || activeFilter === 'teams') && results.teams?.length > 0 && (
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>
                                    <FaFutbol /> Times
                                </h2>
                                <div className={styles.grid}>
                                    {results.teams.map(team => (
                                        <motion.div
                                            key={team.id}
                                            className={styles.card}
                                            onClick={() => navigateTo('team', team.id)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={styles.cardLogo}>
                                                {team.logo ? (
                                                    <img src={team.logo} alt={team.name} />
                                                ) : (
                                                    <FaFutbol size={32} />
                                                )}
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <h3>{team.name}</h3>
                                                <p>
                                                    {team.country_flag && <img src={team.country_flag} alt="" className={styles.flag} />}
                                                    {team.country}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Players Section */}
                        {(activeFilter === 'all' || activeFilter === 'players') && results.players?.length > 0 && (
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>
                                    <FaUser /> Jogadores
                                </h2>
                                <div className={styles.grid}>
                                    {results.players.map(player => (
                                        <motion.div
                                            key={player.id}
                                            className={styles.card}
                                            onClick={() => navigateTo('player', player.id)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={styles.cardLogo}>
                                                {player.image ? (
                                                    <img src={player.image} alt={player.name} />
                                                ) : (
                                                    <FaUser size={32} />
                                                )}
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <h3>{player.name}</h3>
                                                <p>
                                                    {player.team_logo && <img src={player.team_logo} alt="" className={styles.flag} />}
                                                    {player.team || 'Sem clube'}
                                                </p>
                                                {player.position && <span className={styles.badge}>{player.position}</span>}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {!searched && !loading && (
                    <motion.div
                        className={styles.emptyState}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <FaSearch size={48} />
                        <h3>Comece a digitar para buscar</h3>
                        <p>Digite pelo menos 2 caracteres</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// Main page component with Suspense boundary
export default function SearchPage() {
    return (
        <>
            <Header />
            <Suspense fallback={
                <div className={styles.searchPage}>
                    <div className={styles.loadingState}>
                        <FaSpinner className={styles.spinner} />
                        <span>Carregando...</span>
                    </div>
                </div>
            }>
                <SearchContent />
            </Suspense>
        </>
    );
}
