
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import MatchHeader from "@/components/MatchHeader/MatchHeader";
import StatsTabs from "@/components/StatsTabs/StatsTabs";
import MatchContent from "@/components/MatchContent/MatchContent";
import api from '@/lib/api';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import styles from "./page.module.css";

export default function MatchPage() {
    // 1. Pegando o ID da URL
    const params = useParams();
    const matchId = params?.id;

    // 2. Estados
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!matchId) return;

        const fetchMatch = async () => {
            console.log(`🚀 Iniciando busca para partida ID: ${matchId}`);
            setLoading(true);
            setError(null);

            try {
                // Busca direta na API (Endpoint de detalhes completos)
                const response = await api.get(`/matches/${matchId}`);

                if (response.data) {
                    console.log("✅ Dados da partida recebidos:", response.data);
                    setMatch(response.data);
                } else {
                    throw new Error("Dados vazios recebidos da API");
                }
            } catch (err) {
                console.error("❌ Erro ao carregar partida:", err);
                setError("Não foi possível carregar os detalhes desta partida.");
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();

    }, [matchId]);

    // --- RENDERIZAÇÃO: LOADING ---
    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.contentLayout}>
                    <Sidebar />
                    <main className={styles.mainContent}>
                        <div className={styles.loadingScreen}>
                            <FaSpinner className={styles.spinner} />
                            <p>Carregando análise tática...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // --- RENDERIZAÇÃO: ERRO ---
    if (error || !match) {
        return (
            <div className={styles.pageWrapper}>
                <Header />
                <div className={styles.contentLayout}>
                    <Sidebar />
                    <main className={styles.mainContent}>
                        <div className={styles.errorScreen}>
                            <FaExclamationTriangle size={50} color="var(--color-danger)" />
                            <h1>Partida não encontrada</h1>
                            <p>{error || "Verifique se o ID está correto ou tente novamente mais tarde."}</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // --- RENDERIZAÇÃO: CONTEÚDO PRINCIPAL ---
    return (
        <div className={styles.pageWrapper}>
            <Header />

            <div className={styles.contentLayout}>
                <Sidebar />

                <main className={styles.mainContent}>

                    {/* Cabeçalho da Partida (Placar, Times, Status) */}
                    <MatchHeader match={match} />

                    {/* Navegação entre Abas (Visão Geral, Stats, H2H, etc) */}
                    <StatsTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        matchStatus={match.status?.short || 'NS'}
                    />

                    {/* Conteúdo dinâmico baseado na aba selecionada */}
                    <div className={styles.scrollableContent}>
                        <MatchContent activeTab={activeTab} match={match} />
                    </div>

                </main>
            </div>
        </div>
    );
}