
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion'; // Adicionado para efeito cinematográfico
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import MatchHeader from "@/components/MatchHeader/MatchHeader";
import StatsTabs from "@/components/StatsTabs/StatsTabs";
import MatchContent from "@/components/MatchContent/MatchContent";
import { matchService } from '@/lib/api';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import styles from "./page.module.css";

// Va   riantes de Animação para entrada da página
const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function MatchPage() {
    // 1. Pegando o ID da URL de forma segura
    const params = useParams();
    const matchId = params?.id;

    // 2. Estados da Página
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para controlar qual aba está visível (Overview, Stats, Lineups, etc)
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!matchId) return;

        const fetchMatchDetails = async () => {
            console.log(`📡 Fetching Match Details for ID: ${matchId}`);
            setLoading(true);
            setError(null);

            try {
                // Chama o endpoint de análise
                const response = await matchService.getAnalysis(matchId);
                console.log("🔍 DADOS COMPLETOS DA API (DEBUG):", JSON.stringify(response, null, 2));

                if (response && response.success && response.data) {
                    const apiData = response.data;

                    // Mapeamento dos dados da nova API para a estrutura esperada pelos componentes
                    const dateStr = apiData.match_info.date.replace(' ', 'T');
                    const timestamp = Math.floor(new Date(dateStr).getTime() / 1000);

                    const enrichedMatch = {
                        id: apiData.match_info.id,
                        date: apiData.match_info.date,
                        timestamp: timestamp,
                        status: { short: 'NS' }, // Default para NS, ajustar se a API retornar status
                        venue: apiData.match_info.venue,
                        league: { name: apiData.match_info.league_name },
                        round: { name: apiData.match_info.round },
                        home_team: {
                            ...apiData.teams.home,
                            logo: apiData.teams.home.image
                        },
                        away_team: {
                            ...apiData.teams.away,
                            logo: apiData.teams.away.image
                        },
                        lineups: {
                            home: { starters: apiData.teams.home.lineup || [] },
                            away: { starters: apiData.teams.away.lineup || [] }
                        },
                        analysis: {
                            predictions: apiData.analysis.predictions,
                            h2h_summary: apiData.analysis.h2h_summary,
                            stats: apiData.analysis.h2h_summary, // Usando resumo como stats por enquanto
                            history: apiData.history_data.h2h_matches
                        },
                        // Campos opcionais que podem não vir na nova API
                        stats: null,
                        events: []
                    };

                    setMatch(enrichedMatch);
                } else {
                    throw new Error("Dados da partida vazios ou inválidos.");
                }
            } catch (err) {
                console.error("❌ Erro ao buscar detalhes da partida:", err);
                setError("Não foi possível carregar os dados. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchMatchDetails();

        // Opcional: Polling para atualizar dados se estiver ao vivo (a cada 60s)
        const interval = setInterval(() => {
            if (match?.status?.short === 'LIVE' || match?.status?.id === 2) {
                fetchMatchDetails();
            }
        }, 60000);

        return () => clearInterval(interval);

    }, [matchId]);

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
                        <MatchHeader match={match} />

                        {/* 2. Menu de Abas (Visão Geral, Estatísticas, H2H...) */}
                        <StatsTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            matchStatus={match.status?.short || 'NS'}
                        />

                        {/* 3. Conteúdo Dinâmico (Scrollável) */}
                        <div className={styles.scrollableContent}>
                            <MatchContent activeTab={activeTab} match={match} />
                        </div>

                    </motion.div>
                </main>
            </div>
        </div>
    );
}