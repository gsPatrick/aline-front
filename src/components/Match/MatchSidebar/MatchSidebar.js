'use client';
import styles from './MatchSidebar.module.css';

// Componentes da Análise GLOBAL (Antigos)
import H2HStats from '../../SidebarComponents/H2HStats';
import PredictionGrid from '../../SidebarComponents/PredictionGrid';
import PreviousGames from '../../SidebarComponents/PreviousGames';

// Componentes da Aba GOLOS (Novos)
import CornerProPredictions from '../../SidebarComponents/CornerProPredictions/CornerProPredictions';
import TeamTrends from '../../SidebarComponents/TeamTrends/TeamTrends';


// Imports Cantos (NOVOS)
import CornerPredictionsWidget from '../../SidebarComponents/CornerPredictionsWidget/CornerPredictionsWidget';
import CornerTrendsWidget from '../../SidebarComponents/CornerTrendsWidget/CornerTrendsWidget';

// Imports Cartões (NOVOS)
import CardPredictionsWidget from '../../SidebarComponents/CardPredictionsWidget/CardPredictionsWidget';
import CardTrendsWidget from '../../SidebarComponents/CardTrendsWidget/CardTrendsWidget';

export default function MatchSidebar({ match, activeTab }) {
    // Fallback for team objects if match.homeTeam/awayTeam are missing
    const home = match.homeTeam || { name: match.matchInfo?.home_team || "Home", logo: match.matchInfo?.home_team_logo || "" };
    const away = match.awayTeam || { name: match.matchInfo?.away_team || "Away", logo: match.matchInfo?.away_team_logo || "" };
    const info = match.matchInfo;
    const state = info?.state; // FT, LIVE, HT, NS, etc.
    const minute = info?.minute;

    let displayStatus = info?.status || ""; // Fallback

    // Logic for Status Text
    if (state === 'FT' || state === 'AET' || state === 'FT_PEN') {
        displayStatus = 'TERMINADO';
    } else if (state === 'HT') {
        displayStatus = 'Intervalo';
    } else if (['LIVE', 'ET', 'PEN_LIVE', 'BREAK', 'INT'].includes(state)) {
        displayStatus = minute ? `${minute}'` : 'AO VIVO';
    } else if (state === 'NS' || state === 'TBD') {
        displayStatus = displayStatus || 'Agendado';
    }

    return (
        <div className={styles.sidebarWrapper}>
            {/* Header Fixo */}
            <div className={styles.headerCard}>
                <div className={styles.leagueRow}>
                    <img src={match.league?.logo} alt="L" width={20} />
                    <span>{match.league?.name} - {info.round}</span>
                </div>
                <div className={styles.scoreBoard}>
                    <div className={styles.teamCol}>
                        <img src={home.logo} className={styles.bigLogo} alt={home.name} />
                        <span className={styles.teamName}>{home.name}</span>
                    </div>
                    <div className={styles.scoreCol}>
                        <span className={styles.date}>{info.date}</span>
                        <span className={styles.scoreMain}>{info.score || "VS"}</span>
                        <span className={styles.status} style={state === 'FT' ? { color: '#ef4444' } : (['LIVE', 'HT'].includes(state) ? { color: '#22c55e' } : {})}>
                            {displayStatus}
                        </span>
                    </div>
                    <div className={styles.teamCol}>
                        <img src={away.logo} className={styles.bigLogo} alt={away.name} />
                        <span className={styles.teamName}>{away.name}</span>
                    </div>
                </div>
            </div>

            {/* CONTEÚDO DINÂMICO DA SIDEBAR */}
            {activeTab === 'global' && (
                <>
                    {/* Componentes da Aba Global ... */}

                    {/* NEW: Game Events Card (Real Data) */}
                    {(() => {
                        // Calculate Goals
                        let totalGoals = 0;
                        if (info.score && info.score.includes('-')) {
                            const [h, a] = info.score.split('-').map(Number);
                            totalGoals = (h || 0) + (a || 0);
                        }

                        // Calculate Corners
                        const cornersStats = match.analysis?.detailedStats?.fulltime?.attacks?.corners;
                        const homeCorners = cornersStats?.home || 0;
                        const awayCorners = cornersStats?.away || 0;
                        const totalCorners = homeCorners + awayCorners;

                        // Calculate Sum
                        const goalsPlusCorners = totalGoals + totalCorners;

                        const gameEvents = [
                            { label: 'Gols', sub: `${totalGoals}`, type: 'med' },
                            { label: 'Cantos', sub: `${totalCorners}`, type: 'med' },
                            { label: 'Gols + Cantos', sub: `${goalsPlusCorners}`, type: 'high' }
                        ];

                        return (
                            <PredictionGrid
                                title="Eventos do Jogo"
                                predictions={gameEvents}
                            />
                        );
                    })()}

                    <H2HStats
                        homeTeam={home}
                        awayTeam={away}
                        h2hData={match.h2h}
                    />
                    <PredictionGrid
                        title={`Confronto Direto: ${home.name} vs ${away.name}`}
                        predictions={match.h2h?.trends || []}
                    />
                    <PreviousGames
                        teamName={home.name}
                        games={match.history?.home || []}
                    />
                </>
            )}

            {activeTab === 'goals' && (
                <>
                    <CornerProPredictions analysis={match.goalAnalysis} /> {/* Tabela de Gols */}
                    <TeamTrends homeTeam={home.name} awayTeam={away.name} data={match.goalAnalysis} />
                </>
            )}

            {/* ABA CANTOS: SIDEBAR ESPECÍFICA */}
            {activeTab === 'corners' && (
                <>
                    <CornerPredictionsWidget analysis={match.cornerAnalysis} />
                    <CornerTrendsWidget data={match.cornerAnalysis} homeTeam={home.name} awayTeam={away.name} />
                </>
            )}

            {/* ABA CARTÕES (NOVO) */}
            {activeTab === 'cards' && (
                <>
                    <CardPredictionsWidget analysis={match.cardAnalysis} />
                    <CardTrendsWidget data={match.cardAnalysis} homeTeam={home.name} awayTeam={away.name} />
                </>
            )}
        </div>
    );
}