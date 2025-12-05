
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; // Animações
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import TeamHeader from "@/components/TeamHeader/TeamHeader";
import SquadList from "@/components/SquadList/SquadList";
import styles from './page.module.css';
import { teamService } from '@/lib/api';
import { FaSpinner, FaCalendarAlt, FaUsers, FaChevronLeft, FaChevronRight, FaExclamationTriangle } from 'react-icons/fa';

// Variantes de animação
const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

const tabVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
};

// --- SUBCOMPONENTES INTERNOS ---

// 1. Linha de Jogo (Match Row)
const MatchHistoryRow = ({ match, mainTeamId }) => {
    const dateObj = new Date(match.timestamp * 1000);
    const dateStr = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const homeScore = match.home_team?.score ?? '-';
    const awayScore = match.away_team?.score ?? '-';

    // Lógica visual para Vitória/Empate/Derrota
    let resultClass = styles.resultNeutral;
    const finishedStatuses = ['FT', 'AET', 'FT_PEN'];

    if (finishedStatuses.includes(match.status?.short) && mainTeamId) {
        const isHome = Number(match.home_team.id) === Number(mainTeamId);
        const hScore = Number(homeScore);
        const aScore = Number(awayScore);

        if (hScore === aScore) {
            resultClass = styles.resultDraw;
        } else if ((isHome && hScore > aScore) || (!isHome && aScore > hScore)) {
            resultClass = styles.resultWin;
        } else {
            resultClass = styles.resultLoss;
        }
    }

    return (
        <Link href={`/match/${match.id}`} className={styles.matchLink}>
            <motion.div
                className={`${styles.matchRow} ${resultClass}`}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Data e Status */}
                <div className={styles.matchMeta}>
                    <span className={styles.date}>{dateStr}</span>
                    <span className={styles.time}>
                        {finishedStatuses.includes(match.status?.short) ? 'FIM' : timeStr}
                    </span>
                </div>

                {/* Placar Visual */}
                <div className={styles.scoreboard}>
                    {/* Mandante */}
                    <div className={`${styles.teamBox} ${styles.teamHome}`}>
                        <span className={styles.teamName}>{match.home_team.name}</span>
                        {match.home_team.logo ? (
                            <img src={match.home_team.logo} alt={match.home_team.name} className={styles.teamLogo} />
                        ) : (
                            <div className={styles.logoPlaceholder} />
                        )}
                    </div>

                    {/* Scores */}
                    <div className={styles.scoreBox}>
                        <span className={styles.scoreValue}>{homeScore}</span>
                        <span className={styles.vs}>:</span>
                        <span className={styles.scoreValue}>{awayScore}</span>
                    </div>

                    {/* Visitante */}
                    <div className={`${styles.teamBox} ${styles.teamAway}`}>
                        {match.away_team.logo ? (
                            <img src={match.away_team.logo} alt={match.away_team.name} className={styles.teamLogo} />
                        ) : (
                            <div className={styles.logoPlaceholder} />
                        )}
                        <span className={styles.teamName}>{match.away_team.name}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

// 2. Lista Agrupada e Paginada (Grouped Match List)
const GroupedMatchList = ({ matches, title, mainTeamId, emptyMessage }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Resetar página se a lista mudar (ex: mudou de time)
    useEffect(() => {
        setCurrentPage(1);
    }, [matches]);

    if (!matches || matches.length === 0) {
        return (
            <div className={styles.listBox}>
                <h3 className={styles.colTitle}>{title}</h3>
                <div className={styles.emptyCard}>
                    <p className={styles.emptyText}>{emptyMessage}</p>
                </div>
            </div>
        );
    }

    // 1. Paginação: Pega apenas os itens da página atual
    const totalPages = Math.ceil(matches.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = matches.slice(startIndex, startIndex + itemsPerPage);

    // 2. Agrupamento: Agrupa os itens da página por Liga
    const grouped = currentItems.reduce((acc, match) => {
        const leagueId = match.league?.id || 'unknown';
        if (!acc[leagueId]) {
            acc[leagueId] = {
                info: match.league,
                matches: []
            };
        }
        acc[leagueId].matches.push(match);
        return acc;
    }, {});

    const groupedArray = Object.values(grouped);

    return (
        <div className={styles.listBox}>
            <h3 className={styles.colTitle}>{title}</h3>

            <div className={styles.listContent}>
                {groupedArray.map((group) => (
                    <div key={group.info.id || Math.random()} className={styles.leagueGroup}>
                        {/* Cabeçalho da Liga */}
                        <div className={styles.leagueHeader}>
                            {group.info.logo && <img src={group.info.logo} alt="L" className={styles.groupLeagueIcon} />}
                            <span className={styles.groupLeagueName}>{group.info.name}</span>
                        </div>

                        {/* Lista de Jogos daquela Liga */}
                        <div className={styles.groupMatches}>
                            {group.matches.map(m => (
                                <MatchHistoryRow key={m.id} match={m} mainTeamId={mainTeamId} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Controles de Paginação */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        <FaChevronLeft />
                    </button>
                    <span className={styles.pageInfo}>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

export default function TeamPage() {
    const params = useParams();
    const id = params?.id;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'squad'

    const [teamInfo, setTeamInfo] = useState(null);
    const [scheduleData, setScheduleData] = useState({ results: [], upcoming: [] });
    const [squadData, setSquadData] = useState([]);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Executa todas as requisições em paralelo
                const [info, schedule, squad] = await Promise.all([
                    teamService.getInfo(id),
                    teamService.getSchedule(id),
                    teamService.getSquad(id)
                ]);

                if (!info) throw new Error("Time não encontrado");

                setTeamInfo(info);
                setScheduleData(schedule || { results: [], upcoming: [] });
                setSquadData(squad || []);

            } catch (error) {
                console.error("Erro ao carregar dados do time:", error);
                setError("Não foi possível carregar as informações do time.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    // 1. Estado de Carregamento
    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.layout}>
                    <Sidebar />
                    <main className={styles.main}>
                        <div className={styles.loadingScreen}>
                            <FaSpinner className={styles.spinner} />
                            <p>Carregando perfil do clube...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // 2. Estado de Erro
    if (error || !teamInfo) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.layout}>
                    <Sidebar />
                    <main className={styles.main}>
                        <div className={styles.errorScreen}>
                            <FaExclamationTriangle size={40} className={styles.errorIcon} />
                            <h2>Time não encontrado</h2>
                            <Link href="/" className={styles.backLink}>Voltar para Home</Link>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // 3. Renderização da Página
    return (
        <div className={styles.pageWrapper}>
            <Header />

            <div className={styles.layout}>
                <Sidebar />

                <main className={styles.main}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                    >
                        {/* Banner com Logo e Nome do Time */}
                        <TeamHeader team={teamInfo} />

                        <div className={styles.contentContainer}>
                            {/* Navegação de Abas */}
                            <div className={styles.tabs}>
                                <button
                                    className={`${styles.tab} ${activeTab === 'matches' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('matches')}
                                >
                                    <FaCalendarAlt /> Jogos
                                </button>
                                <button
                                    className={`${styles.tab} ${activeTab === 'squad' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('squad')}
                                >
                                    <FaUsers /> Elenco
                                </button>
                            </div>

                            {/* Conteúdo das Abas */}
                            <div className={styles.tabContent}>
                                <AnimatePresence mode="wait">
                                    {/* ABA 1: JOGOS (Resultados e Calendário) */}
                                    {activeTab === 'matches' && (
                                        <motion.div
                                            key="matches"
                                            variants={tabVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className={styles.matchesGrid}
                                        >
                                            {/* Coluna da Esquerda: Últimos Resultados */}
                                            <GroupedMatchList
                                                matches={scheduleData.results}
                                                title="Últimos Resultados"
                                                mainTeamId={id}
                                                emptyMessage="Nenhum resultado recente encontrado."
                                            />

                                            {/* Coluna da Direita: Próximos Jogos */}
                                            <GroupedMatchList
                                                matches={scheduleData.upcoming}
                                                title="Próximos Jogos"
                                                mainTeamId={id}
                                                emptyMessage="Sem jogos agendados no momento."
                                            />
                                        </motion.div>
                                    )}

                                    {/* ABA 2: ELENCO (Jogadores e Stats) */}
                                    {activeTab === 'squad' && (
                                        <motion.div
                                            key="squad"
                                            variants={tabVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <SquadList squad={squadData} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}