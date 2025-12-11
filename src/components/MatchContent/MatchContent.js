'use client';
import { motion, AnimatePresence } from 'framer-motion';
// ... imports de ícones (mantenha os existentes)
import { FaMapMarkerAlt, FaCloudSun, FaMoneyBillWave, FaChartPie, FaIdCard, FaChartBar, FaUsers, FaExchangeAlt } from 'react-icons/fa';
import styles from './MatchContent.module.css';

// IMPORTS DE ABAS E DASHBOARDS
import OverviewTab from '@/components/Match/Analysis/Tabs/OverviewTab/OverviewTab';
import MatchStatsView from '@/components/Match/Analysis/Tabs/MatchStatsView/MatchStatsView';
import GoalsAnalysis from '@/components/Match/Analysis/Tabs/GoalsAnalysis';
import CornersAnalysis from '@/components/Match/Analysis/Tabs/CornersAnalysis';
import CardsAnalysis from '@/components/Match/Analysis/Tabs/CardsAnalysis';
import SquadAnalysis from '@/components/MatchContent/SquadAnalysis';
import ChartsTab from '@/components/MatchTabs/ChartsTab';
import EventsTab from '@/components/MatchContentTabs/EventsTab';
import LineupsTab from '@/components/Match/Analysis/LineupsTab';
import StandingsTab from '@/components/Match/Analysis/Tabs/StandingsTab/StandingsTab';
import H2HTab from '@/components/MatchContentTabs/H2HTab';

// NOVOS IMPORTS DE ESTADO
import LiveDashboard from '@/components/Match/Analysis/Live/LiveDashboard';
import PreMatchDashboard from '@/components/Match/Analysis/PreMatch/PreMatchDashboard';

// Placeholder (Mantenha o código do PlaceholderTab aqui se não estiver em outro arquivo)
const PlaceholderTab = ({ icon: Icon, title, message }) => (
    <div className={styles.placeholderContainer}>
        <div className={styles.placeholderIcon}><Icon /></div>
        <h3 className={styles.placeholderTitle}>{title}</h3>
        <p className={styles.placeholderMessage}>{message}</p>
        <button className={styles.placeholderBtn}>Em Breve</button>
    </div>
);

const tabVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
};

export default function MatchContent({ activeTab, match, filterCondition = 'ALL', isLive = false }) {
    if (!match) return null;

    const { matchInfo, league, venue, weather, odds, predictions } = match;
    const status = matchInfo?.state || 'NS'; // NS, LIVE, HT, FT (Note: API uses 'state', user code used 'status' but API response has 'state'. I should verify match structure. Previous files showed matchInfo.state. User code has matchInfo?.status. I will correct to matchInfo?.state based on match.service.js)

    // LÓGICA DE RENDERIZAÇÃO DA ABA "GLOBAL/VISÃO GERAL"
    const renderGlobalTab = () => {
        // DETECT STALE MATCHES:
        // If status is 'NS' but start time was > 3 hours ago, show Overview/Stats
        // This handles cases where backend still says 'NS' for a finished match
        const now = Math.floor(Date.now() / 1000);
        const startTime = matchInfo?.starting_at_timestamp;
        const isStale = status === 'NS' && startTime && (now > startTime + (3 * 3600));

        if (isStale) {
            return <OverviewTab match={match} />;
        }

        // Se o jogo NÃO começou (NS), mostra o Dashboard Pré-Jogo
        if (status === 'NS' || status === 'TBD') {
            return <PreMatchDashboard match={match} />;
        }
        // Se o jogo está AO VIVO (LIVE ou HT), mostra o Dashboard Ao Vivo
        // Check standard SportMonks states for LIVE
        const liveStates = ['LIVE', 'HT', 'ET', 'PEN_LIVE', 'BREAK', 'INT'];
        if (liveStates.includes(status)) {
            return <LiveDashboard match={match} />;
        }
        // Se o jogo ACABOU (FT), mostra o Overview Padrão
        return <OverviewTab match={match} />;
    };

    return (
        <div className={styles.contentGrid}>

            {/* COLUNA PRINCIPAL */}
            <div className={styles.mainColumn}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={styles.tabPanel}
                    >
                        {/* 1. LÓGICA DE ESTADO (Global/Terminado) */}

                        {/* Aba Global: Muda dependendo do estado do jogo */}
                        {activeTab === 'global' && renderGlobalTab()}

                        {/* Aba Terminado: Sempre mostra Stats Finais (Se jogo acabou) */}
                        {activeTab === 'finished' && (
                            <MatchStatsView
                                homeTeam={match.homeTeam}
                                awayTeam={match.awayTeam}
                                statsData={match.analysis?.detailedStats}
                            />
                        )}

                        {/* 2. ABAS ESPECÍFICAS (Sempre disponíveis se tiver dados) */}
                        {activeTab === 'goals' && (
                            <GoalsAnalysis homeTeam={match.homeTeam?.name} awayTeam={match.awayTeam?.name} data={match.goalAnalysis} />
                        )}

                        {activeTab === 'corners' && (
                            <CornersAnalysis
                                homeTeam={match.homeTeam?.name}
                                awayTeam={match.awayTeam?.name}
                                data={match.cornerAnalysis}
                                odds={match.odds}
                            />
                        )}

                        {activeTab === 'cards' && (
                            <CardsAnalysis data={match.cardAnalysis} referee={matchInfo?.referee} />
                        )}

                        {/* ... Mantenha as outras abas (Charts, Squad, etc) igual ao anterior ... */}
                        {activeTab === 'charts' && (
                            <ChartsTab generalStatsAnalysis={match.analysis?.detailedStats?.fulltime} matchState={status} />
                        )}

                        {(activeTab === 'players' || activeTab === 'squad') && (
                            <SquadAnalysis homeSquad={match.homeTeam?.squad} awaySquad={match.awayTeam?.squad} homeTeamName={match.homeTeam?.name} awayTeamName={match.awayTeam?.name} />
                        )}

                        {activeTab === 'odds' && <PlaceholderTab icon={FaMoneyBillWave} title="Comparador de Odds" message="Em breve" />}

                        {/* Acesso direto a abas internas se necessário */}
                        {activeTab === 'lineups' && <LineupsTab match={match} />}
                        {activeTab === 'events' && <EventsTab match={match} />}
                        {activeTab === 'h2h' && <H2HTab match={match} />}
                        {activeTab === 'standings' && <StandingsTab standings={match.analysis?.standings} homeId={match.homeTeam?.id} awayId={match.awayTeam?.id} />}

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* COLUNA LATERAL (Mantida igual ao anterior, sempre visível) */}
            <div className={styles.sideColumn}>
                {/* ... (Mesmo código da sidebar direita de Detalhes, Odds e Probabilidades) ... */}
                {/* Copie o conteúdo da sideColumn do MatchContent anterior aqui */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}><FaMapMarkerAlt /> Detalhes</h3>

                    {league && (
                        <div className={styles.leagueInfoRow}>
                            {league.logo && <img src={league.logo} alt="L" className={styles.miniLeagueLogo} />}
                            <span className={styles.leagueNameSide}>{league.name}</span>
                        </div>
                    )}

                    <p className={styles.infoText}>{venue?.name || "Estádio não informado"}</p>
                    {weather && <div className={styles.weatherBox}><FaCloudSun className={styles.weatherIcon} /> <span>{weather.condition || '-'}</span></div>}
                </div>

                {/* Widget: Odds Principais 1x2 */}
                {odds && (
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <FaMoneyBillWave style={{ color: 'var(--color-primary)' }} />
                            Odds Principais
                        </h3>
                        <div className={styles.oddsContainer}>
                            <div className={styles.oddBox}>
                                <span className={styles.oddLabel}>1</span>
                                <span className={styles.oddValue}>{odds.find(o => o.label === '1')?.value || '-'}</span>
                            </div>
                            <div className={styles.oddBox}>
                                <span className={styles.oddLabel}>X</span>
                                <span className={styles.oddValue}>{odds.find(o => o.label === 'X')?.value || '-'}</span>
                            </div>
                            <div className={styles.oddBox}>
                                <span className={styles.oddLabel}>2</span>
                                <span className={styles.oddValue}>{odds.find(o => o.label === '2')?.value || '-'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Widget: Probabilidade IA (Esconde na Global p/ não duplicar) */}
                {predictions && activeTab !== 'global' && (
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <FaChartPie /> Probabilidade
                        </h3>
                        <div className={styles.miniPred}>
                            <div className={styles.miniHeader}>
                                <span>Casa</span>
                                <span className={styles.miniVal}>{predictions.fulltime?.home || 0}%</span>
                            </div>
                            <div className={styles.miniTrack}>
                                <div
                                    className={styles.miniBar}
                                    style={{ width: `${predictions.fulltime?.home || 0}%`, background: '#00ff88' }}
                                ></div>
                            </div>

                            <div className={styles.miniHeader} style={{ marginTop: '10px' }}>
                                <span>Fora</span>
                                <span className={styles.miniVal}>{predictions.fulltime?.away || 0}%</span>
                            </div>
                            <div className={styles.miniTrack}>
                                <div
                                    className={styles.miniBar}
                                    style={{ width: `${predictions.fulltime?.away || 0}%`, background: '#00d4ff' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}