
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import LeagueHeader from "@/components/LeagueHeader/LeagueHeader";
import StandingsTable from "@/components/StandingsTable/StandingsTable";
import styles from './page.module.css';
import api from '@/lib/api';
import { FaSpinner, FaListAlt, FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// --- HELPERS DE DATA ---
const getDatesRange = () => {
    const dates = [];
    const today = new Date();
    // Gera datas de -3 dias até +14 dias
    for (let i = -3; i <= 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);
    }
    return dates;
};

const formatDateToISO = (date) => date.toISOString().split('T')[0];

const formatDateDisplay = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    const weekday = date.toLocaleString('pt-BR', { weekday: 'short' }).replace('.', '');
    return { day, month, weekday };
};

// --- COMPONENTES VISUAIS INTERNOS ---

const DatePicker = ({ selectedDate, onSelectDate }) => {
    const dates = getDatesRange();

    // Funções de scroll horizontal
    const scrollLeft = () => document.getElementById('date-slider').scrollBy({ left: -200, behavior: 'smooth' });
    const scrollRight = () => document.getElementById('date-slider').scrollBy({ left: 200, behavior: 'smooth' });

    return (
        <div className={styles.datePickerWrapper}>
            <button onClick={scrollLeft} className={styles.scrollBtn}><FaChevronLeft /></button>
            <div id="date-slider" className={styles.dateSlider}>
                {dates.map((date) => {
                    const iso = formatDateToISO(date);
                    const { day, month, weekday } = formatDateDisplay(date);
                    const isSelected = selectedDate === iso;
                    const isToday = iso === formatDateToISO(new Date());

                    return (
                        <button
                            key={iso}
                            className={`${styles.dateCard} ${isSelected ? styles.dateCardActive : ''} ${isToday ? styles.dateCardToday : ''}`}
                            onClick={() => onSelectDate(iso)}
                        >
                            <span className={styles.dateWeekday}>{weekday}</span>
                            <span className={styles.dateNumber}>{day} {month.toUpperCase()}</span>
                        </button>
                    );
                })}
            </div>
            <button onClick={scrollRight} className={styles.scrollBtn}><FaChevronRight /></button>
        </div>
    );
};

const MatchRow = ({ match }) => {
    const dateObj = new Date(match.timestamp * 1000);
    const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const home = match.home_team || {};
    const away = match.away_team || {};

    // Verifica status para mostrar tempo ou placar final
    const isFinished = ['FT', 'AET', 'FT_PEN'].includes(match.status?.short);
    const isLive = match.status?.id === 2 || ['LIVE', '1T', '2T', 'HT'].includes(match.status?.short);

    return (
        <Link href={`/match/${match.id}`} className={styles.matchLink}>
            <div className={styles.matchRow}>
                <div className={styles.matchTimeBox}>
                    {isLive ? (
                        <span className={styles.liveTime}>{match.minute}'</span>
                    ) : (
                        <span className={styles.timeText}>{isFinished ? 'FIM' : timeStr}</span>
                    )}
                </div>

                <div className={styles.scoreboard}>
                    {/* Time Casa */}
                    <div className={`${styles.teamBox} ${styles.teamHome}`}>
                        <span className={styles.teamName}>{home.name}</span>
                        {home.logo ? (
                            <img src={home.logo} className={styles.teamLogo} alt={home.name} />
                        ) : (
                            <div className={styles.logoPlaceholder} />
                        )}
                    </div>

                    {/* Placar Central ou VS */}
                    <div className={styles.vsBox}>
                        <span className={`${styles.vsText} ${isLive ? styles.liveScore : ''}`}>
                            {(isFinished || isLive) ? `${home.score} - ${away.score}` : 'VS'}
                        </span>
                    </div>

                    {/* Time Visitante */}
                    <div className={`${styles.teamBox} ${styles.teamAway}`}>
                        {away.logo ? (
                            <img src={away.logo} className={styles.teamLogo} alt={away.name} />
                        ) : (
                            <div className={styles.logoPlaceholder} />
                        )}
                        <span className={styles.teamName}>{away.name}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// --- COMPONENTE PRINCIPAL ---

export default function LeaguePage() {
    const params = useParams();

    // Estados
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Estado do Calendário
    const [selectedDate, setSelectedDate] = useState(formatDateToISO(new Date()));
    const [calendarMatches, setCalendarMatches] = useState([]);
    const [loadingCalendar, setLoadingCalendar] = useState(false);

    // 1. CARREGAMENTO INICIAL (Info da Liga + Jogos do Dia)
    useEffect(() => {
        if (!params?.id) return;

        setLoading(true);

        const fetchLeagueInfo = api.get(`/leagues/${params.id}`);
        const fetchTodayMatches = api.get(`/leagues/${params.id}/matches?date=${selectedDate}`);

        Promise.all([fetchLeagueInfo, fetchTodayMatches])
            .then(([resInfo, resMatches]) => {
                setData(resInfo.data);
                setCalendarMatches(resMatches.data || []);
            })
            .catch(err => {
                console.error("Erro ao carregar dados iniciais da liga:", err);
            })
            .finally(() => {
                setLoading(false);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);


    // 2. CARREGAMENTO DO CALENDÁRIO (Quando muda a data)
    useEffect(() => {
        if (!params?.id || loading) return; // Evita conflito com load inicial

        setLoadingCalendar(true);

        api.get(`/leagues/${params.id}/matches?date=${selectedDate}`)
            .then(res => setCalendarMatches(res.data || []))
            .catch(err => console.error("Erro ao buscar calendário:", err))
            .finally(() => setLoadingCalendar(false));

    }, [selectedDate]);

    // Helper: Filtrar próximas 48 horas para a Sidebar
    const getNext48HoursMatches = () => {
        if (!data?.upcoming_matches) return [];
        const now = Date.now() / 1000;
        const limit = now + (48 * 60 * 60); // +48h
        return data.upcoming_matches
            .filter(m => m.timestamp >= now && m.timestamp <= limit)
            .slice(0, 5); // Limita a 5 jogos
    };

    // --- RENDERS DE LOADING/ERRO ---
    if (loading) return (
        <div className={styles.pageWrapper}>
            <Header />
            <div className={styles.loadingWrapper}>
                <FaSpinner className={styles.spinner} />
                <p>Carregando dados da liga...</p>
            </div>
        </div>
    );

    if (!data) return (
        <div className={styles.pageWrapper}>
            <Header />
            <div className={styles.loadingWrapper}>
                <h2>Liga não encontrada</h2>
            </div>
        </div>
    );

    const nextMatches = getNext48HoursMatches();

    return (
        <div className={styles.pageWrapper}>
            <Header />

            <div className={styles.contentLayout}>
                <Sidebar />

                <main className={styles.mainContent}>

                    {/* Cabeçalho da Liga (Logo, Nome, País) */}
                    <LeagueHeader league={data.info} />

                    <div className={styles.leagueContent}>

                        {/* Navegação de Abas */}
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                <FaListAlt /> Visão Geral
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'calendar' ? styles.active : ''}`}
                                onClick={() => setActiveTab('calendar')}
                            >
                                <FaCalendarAlt /> Calendário
                            </button>
                        </div>

                        {/* ABA: VISÃO GERAL (Tabela + Sidebar de Jogos) */}
                        {activeTab === 'overview' && (
                            <div className={styles.grid}>
                                {/* Coluna Principal: Tabela de Classificação */}
                                <div className={styles.mainCol}>
                                    <StandingsTable standings={data.standings} />
                                </div>

                                {/* Coluna Lateral: Próximos Jogos (48h) */}
                                <div className={styles.sideCol}>
                                    <div className={styles.upcomingContainer}>
                                        <h3 className={styles.sectionTitle}><FaClock /> Próximas 48h</h3>

                                        <div className={styles.fixturesList}>
                                            {nextMatches.length > 0 ? (
                                                nextMatches.map(m => <MatchRow key={m.id} match={m} />)
                                            ) : (
                                                <div className={styles.emptyState}>Nenhum jogo nas próximas 48h.</div>
                                            )}
                                        </div>

                                        <button className={styles.viewMoreBtn} onClick={() => setActiveTab('calendar')}>
                                            Ver Calendário Completo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ABA: CALENDÁRIO (Date Picker + Lista de Jogos) */}
                        {activeTab === 'calendar' && (
                            <div className={styles.calendarWrapper}>
                                <DatePicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                                <div className={styles.calendarResults}>
                                    {loadingCalendar ? (
                                        <div className={styles.miniLoader}>
                                            <FaSpinner className={styles.spinner} />
                                            <span>Buscando jogos...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className={styles.dateTitle}>
                                                Jogos de {new Date(selectedDate).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                                            </h3>

                                            {calendarMatches.length > 0 ? (
                                                <div className={styles.matchesGrid}>
                                                    {calendarMatches.map(m => <MatchRow key={m.id} match={m} />)}
                                                </div>
                                            ) : (
                                                <div className={styles.emptyCalendar}>
                                                    Nenhum jogo encontrado para esta data nesta liga.
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}