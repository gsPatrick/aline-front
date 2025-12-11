'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import MatchSidebar from "@/components/Match/MatchSidebar/MatchSidebar";
import MatchContent from "../../../components/MatchContent/MatchContent"; // Ajuste o caminho se necessário
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import styles from "./page.module.css";

// DADOS MOCKADOS COMPLETOS - SINGLE SOURCE OF TRUTH
const mockMatch = {
    matchInfo: {
        id: 12345,
        round: "Jornada #38",
        date: "2025-12-06 18:30",
        score: "3-3",
        status: "Terminado",
        venue: "Estádio José Maria de Campos Maia",
        weather: "22°C, Céu Limpo"
    },
    // ID 1 = MIRASSOL (Será verde na tabela)
    homeTeam: {
        id: 1,
        name: "Mirassol",
        logo: "https://cdn.sportmonks.com/images/soccer/teams/22/3030.png",
        form: ['V', 'D', 'E', 'V', 'V']
    },
    // ID 2 = FLAMENGO (Será vermelho na tabela)
    awayTeam: {
        id: 2,
        name: "Flamengo",
        logo: "https://cdn.sportmonks.com/images/soccer/teams/19/3027.png",
        form: ['V', 'D', 'E', 'V', 'V']
    },
    league: {
        name: "Brasil Série A",
        logo: "https://cdn.sportmonks.com/images/soccer/leagues/8.png"
    },

    // ANÁLISE COMPLETA (Alimenta Tabela e Dados do Jogo)
    analysis: {
        // TABELA CLASSIFICATIVA (20 Times)
        standings: [
            { pos: 1, team_name: 'Flamengo', id: 2, team_logo: "https://cdn.sportmonks.com/images/soccer/teams/19/3027.png", p: 79, j: 38, v: 23, e: 10, d: 5, goals: '78:27', form: ['E', 'V', 'E', 'V', 'D'] },
            { pos: 2, team_name: 'Palmeiras', id: 102, team_logo: "https://cdn.sportmonks.com/images/soccer/teams/22/1234.png", p: 76, j: 38, v: 23, e: 7, d: 8, goals: '66:33', form: ['V', 'V', 'D', 'E', 'E'] },
            { pos: 3, team_name: 'Cruzeiro', id: 103, team_logo: "https://cdn.sportmonks.com/images/soccer/teams/22/1235.png", p: 70, j: 38, v: 19, e: 13, d: 6, goals: '55:31', form: ['D', 'E', 'E', 'V', 'E'] },
            { pos: 4, team_name: 'Mirassol', id: 1, team_logo: "https://cdn.sportmonks.com/images/soccer/teams/22/3030.png", p: 67, j: 38, v: 18, e: 13, d: 7, goals: '63:39', form: ['E', 'V', 'D', 'V', 'E'] },
            { pos: 5, team_name: 'Fluminense', id: 105, team_logo: "", p: 64, j: 38, v: 19, e: 7, d: 12, goals: '50:39', form: ['V', 'V', 'V', 'E', 'V'] },
            { pos: 6, team_name: 'Botafogo', id: 106, team_logo: "", p: 63, j: 38, v: 17, e: 12, d: 9, goals: '58:38', form: ['V', 'E', 'E', 'V', 'V'] },
            { pos: 7, team_name: 'Bahia', id: 107, team_logo: "", p: 60, j: 38, v: 17, e: 9, d: 12, goals: '50:46', form: ['D', 'V', 'E', 'V', 'D'] },
            { pos: 8, team_name: 'São Paulo', id: 108, team_logo: "", p: 51, j: 38, v: 14, e: 9, d: 15, goals: '43:47', form: ['D', 'V', 'D', 'V', 'D'] },
            { pos: 9, team_name: 'Grêmio', id: 109, team_logo: "", p: 49, j: 38, v: 13, e: 10, d: 15, goals: '47:50', form: ['V', 'D', 'V', 'D', 'V'] },
            { pos: 10, team_name: 'Bragantino', id: 110, team_logo: "", p: 48, j: 38, v: 14, e: 6, d: 18, goals: '45:57', form: ['D', 'V', 'D', 'D', 'V'] },
            { pos: 11, team_name: 'Atlético Mineiro', id: 111, team_logo: "", p: 48, j: 38, v: 12, e: 12, d: 14, goals: '43:44', form: ['V', 'D', 'D', 'E', 'D'] },
            { pos: 12, team_name: 'Santos', id: 112, team_logo: "", p: 47, j: 38, v: 12, e: 11, d: 15, goals: '45:50', form: ['V', 'V', 'V', 'E', 'E'] },
            { pos: 13, team_name: 'Corinthians', id: 113, team_logo: "", p: 47, j: 38, v: 12, e: 11, d: 15, goals: '42:47', form: ['E', 'D', 'E', 'D', 'V'] },
            { pos: 14, team_name: 'Vasco da Gama', id: 114, team_logo: "", p: 45, j: 38, v: 13, e: 6, d: 19, goals: '55:60', form: ['D', 'D', 'V', 'D', 'D'] },
            { pos: 15, team_name: 'Vitória', id: 115, team_logo: "", p: 45, j: 38, v: 11, e: 12, d: 15, goals: '35:52', form: ['V', 'D', 'V', 'V', 'E'] },
            { pos: 16, team_name: 'Internacional', id: 116, team_logo: "", p: 44, j: 38, v: 11, e: 11, d: 16, goals: '44:57', form: ['V', 'D', 'D', 'E', 'V'] },
            { pos: 17, team_name: 'Ceará', id: 117, team_logo: "", p: 43, j: 38, v: 11, e: 10, d: 17, goals: '34:40', form: ['D', 'D', 'E', 'D', 'D'] },
            { pos: 18, team_name: 'Fortaleza', id: 118, team_logo: "", p: 43, j: 38, v: 11, e: 10, d: 17, goals: '43:58', form: ['D', 'V', 'V', 'V', 'V'] },
            { pos: 19, team_name: 'Juventude', id: 119, team_logo: "", p: 35, j: 38, v: 9, e: 8, d: 21, goals: '35:69', form: ['E', 'D', 'E', 'D', 'E'] },
            { pos: 20, team_name: 'Sport Recife', id: 120, team_logo: "", p: 17, j: 38, v: 2, e: 11, d: 25, goals: '28:75', form: ['D', 'D', 'D', 'D', 'D'] },
        ],

        // ESTATÍSTICAS DETALHADAS (Fulltime, 1st Half, 2nd Half)
        detailedStats: {
            fulltime: {
                possession: { home: 63, away: 37 },
                attacks: {
                    total: { home: 94, away: 48 },
                    dangerous: { home: 56, away: 27 },
                    corners: { home: 2, away: 3 },
                    crosses: { home: 24, away: 6 }
                },
                shots: {
                    total: { home: 17, away: 16 },
                    onTarget: { home: 9, away: 6 },
                    offTarget: { home: 8, away: 10 },
                    insideBox: { home: 13, away: 12 },
                    outsideBox: { home: 4, away: 4 }
                },
                others: {
                    saves: { home: 3, away: 5 },
                    fouls: { home: 11, away: 10 },
                    freeKicks: { home: 10, away: 11 },
                    yellowCards: { home: 1, away: 1 },
                    redCards: { home: 0, away: 0 },
                    passes: { home: 433, away: 242 },
                    longPasses: { home: 41, away: 48 },
                    interceptions: { home: 3, away: 8 }
                }
            },
            ht: {
                possession: { home: 60, away: 40 },
                attacks: { total: { home: 45, away: 20 }, dangerous: { home: 25, away: 10 }, corners: { home: 1, away: 1 }, crosses: { home: 10, away: 2 } },
                shots: { total: { home: 8, away: 5 }, onTarget: { home: 4, away: 2 }, offTarget: { home: 4, away: 3 }, insideBox: { home: 6, away: 4 }, outsideBox: { home: 2, away: 1 } },
                others: { saves: { home: 1, away: 3 }, fouls: { home: 5, away: 4 }, freeKicks: { home: 4, away: 5 }, yellowCards: { home: 0, away: 1 }, redCards: { home: 0, away: 0 }, passes: { home: 200, away: 100 }, longPasses: { home: 20, away: 20 }, interceptions: { home: 1, away: 4 } }
            },
            st: {
                possession: { home: 66, away: 34 },
                attacks: { total: { home: 49, away: 28 }, dangerous: { home: 31, away: 17 }, corners: { home: 1, away: 2 }, crosses: { home: 14, away: 4 } },
                shots: { total: { home: 9, away: 11 }, onTarget: { home: 5, away: 4 }, offTarget: { home: 4, away: 7 }, insideBox: { home: 7, away: 8 }, outsideBox: { home: 2, away: 3 } },
                others: { saves: { home: 2, away: 2 }, fouls: { home: 6, away: 6 }, freeKicks: { home: 6, away: 6 }, yellowCards: { home: 1, away: 0 }, redCards: { home: 0, away: 0 }, passes: { home: 233, away: 142 }, longPasses: { home: 21, away: 28 }, interceptions: { home: 2, away: 4 } }
            }
        }
    },
    // Outros dados essenciais
    history: { home: [], away: [] }, // Preencher conforme necessário
    odds: { home: { value: "2.60" }, draw: { value: "3.50" }, away: { value: "1.50" } },
    goalAnalysis: { home: { btts: "55", over25: "60" }, away: { btts: "45", over25: "50" } },
    cornerAnalysis: { home: { avgTotal: "10" }, away: { avgTotal: "9" } }
};

const LEVEL_1_TABS = [
    { id: 'global', label: 'Análise Global' },
    { id: 'finished', label: 'Terminado' },
    { id: 'h2h', label: 'H2H' },
    { id: 'goals', label: 'Golos' },
    { id: 'corners', label: 'Cantos' },
    { id: 'cards', label: 'Cartões' },
    { id: 'odds', label: 'Odds' },
    { id: 'charts', label: 'Gráficos' },
    { id: 'players', label: 'Dados Jogadores' },
];

export default function MatchPage() {
    const params = useParams();
    const { id } = params;
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('global');

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const response = await fetch(`http://localhost:3333/api/matches/${id}/analysis`);
                if (!response.ok) throw new Error('Falha ao carregar dados do jogo');

                const data = await response.json();

                // Adapter: Map API response to Frontend 'mockMatch' structure
                const adaptedMatch = {
                    matchInfo: data.matchInfo,
                    homeTeam: data.homeTeam,
                    awayTeam: data.awayTeam,
                    league: data.matchInfo.league, // Frontend expects league at root

                    // Analysis
                    analysis: {
                        standings: data.analysis?.standings || [],
                        detailedStats: data.analysis?.detailedStats || null
                    },

                    // Stats & Analysis
                    history: data.history,
                    odds: data.odds, // Need to verify if backend returns odds object or array
                    goalAnalysis: data.goalAnalysis,
                    cornerAnalysis: data.cornerAnalysis,
                    cardAnalysis: data.cardAnalysis,
                    predictions: data.predictions,
                    lineups: data.lineups,

                    // Pass through other data
                    ...data
                };

                setMatch(adaptedMatch);

                // Auto-select 'finished' tab if match is ended and we are on default 'global'
                // Or maybe just ensure 'finished' is available.
                // Actually, 'Global' shows OverviewTab for finished, so maybe we don't need to switch?
                // The user request: "O TAB DE TERMINADO VOLTA APARECER POIS ALI MOSTRA OS DADOS DA PARTIDA FINALIZADA"
                // It means they specifically want the 'finished' tab to be visible. 
                // In LEVEL_1_TABS it is always visible.
                // But perhaps they want it to be *selected*?
                const state = adaptedMatch.matchInfo?.state;
                if (['FT', 'AET', 'FT_PEN'].includes(state) && activeTab === 'global') {
                    // If we want to force 'finished' tab:
                    setActiveTab('finished');
                    // IMPORTANT: 'Global' (OverviewTab) and 'Finished' (MatchStatsView) might be redundant or different views.
                    // The user says "Global tab shows finished data".
                    // OverviewTab shows general summary. MatchStatsView (on 'finished' tab) shows detailed stats.
                    // Let's force switch to 'finished' if we want detailed stats, or just ensure 'finished' is clickable.
                    // It seems they want the user to know it's finished.
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMatchData();
        }
    }, [id]);

    if (loading) return (
        <div className={styles.loadingContainer}>
            <FaSpinner className={styles.spinner} />
            <p>Carregando análise da partida...</p>
        </div>
    );

    if (error) return (
        <div className={styles.errorContainer}>
            <FaExclamationTriangle className={styles.errorIcon} />
            <p>Erro ao carregar dados: {error}</p>
        </div>
    );

    if (!match) return null;

    // Filter tabs based on match state
    // If Pre-Match, maybe hide 'finished'?
    // User wants 'finished' to appear when match is OVER.
    const isFinished = ['FT', 'AET', 'FT_PEN'].includes(match.matchInfo?.state);

    // Logic to hide 'finished' if NOT finished?
    // User request implies it disappears or appeared and shouldn't?
    // "O TAB DE TERMINADO VOLTA APARECER" -> "The Finished tab appears again"
    // So we should filter tabs.

    const visibleTabs = LEVEL_1_TABS.filter(tab => {
        if (tab.id === 'finished' && !isFinished) return false;
        return true;
    });

    return (
        <div className={styles.pageWrapper}>
            <Header />
            <div className={styles.contentLayout}>
                <Sidebar />
                <main className={styles.mainContent}>
                    {/* Header Principal da Página */}
                    <nav className={styles.topNav}>
                        {visibleTabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className={styles.matchGrid}>
                        {/* Sidebar do Jogo */}
                        <aside className={styles.leftColumn}>
                            <MatchSidebar match={match} activeTab={activeTab} />
                        </aside>

                        {/* Conteúdo Central */}
                        <div className={styles.rightColumn}>
                            <MatchContent
                                activeTab={activeTab}
                                match={match}
                                isLive={['LIVE', 'HT', 'ET', 'PEN_LIVE'].includes(match.matchInfo?.state)}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}