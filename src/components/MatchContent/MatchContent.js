'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Importante para a navegação
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFutbol, FaSquare, FaSpinner, FaChartPie, FaMapMarkerAlt,
    FaCloudSun, FaExchangeAlt, FaHistory, FaUserShield, FaTshirt,
    FaVideo, FaHandPaper, FaMoneyBillWave, FaTimes, FaRulerVertical,
    FaWeight, FaBirthdayCake, FaExternalLinkAlt
} from 'react-icons/fa';
import api from '@/lib/api';
import Loader from '@/components/Loader/Loader';
import styles from './MatchContent.module.css';

// --- COMPONENTE MODAL DE DETALHES DO JOGADOR ---
const PlayerModal = ({ data, onClose }) => {
    if (!data) return null;

    // Normalização: tenta pegar de 'player' ou usa o próprio objeto
    const playerInfo = data.player || data;

    // Verifica se temos dados físicos (o endpoint de fixture geralmente não manda, mas o de player sim)
    const hasDetails = playerInfo.height || playerInfo.weight || playerInfo.date_of_birth;

    const getAge = (dob) => {
        if (!dob) return '-';
        const birthDate = new Date(dob);
        const difference = Date.now() - birthDate.getTime();
        const ageDate = new Date(difference);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose}><FaTimes /></button>

                <div className={styles.modalHeader}>
                    <div className={styles.modalAvatarContainer}>
                        <img
                            src={playerInfo.image_path || playerInfo.photo || '/api/placeholder/100/100'}
                            alt={playerInfo.display_name || playerInfo.name}
                            className={styles.modalAvatar}
                            onError={(e) => e.target.src = '/api/placeholder/100/100'}
                        />
                        {data.is_captain && <div className={styles.captainModalBadge}>C</div>}
                    </div>

                    <div className={styles.modalTitle}>
                        <h2 className={styles.modalName}>{playerInfo.common_name || playerInfo.name}</h2>
                        <span className={styles.modalFullName}>
                            {playerInfo.firstname && playerInfo.lastname ? `${playerInfo.firstname} ${playerInfo.lastname}` : ''}
                        </span>

                        <div className={styles.modalTags}>
                            <span className={styles.modalPosition}>Camisa {data.number || '-'}</span>

                            {/* Se tiver Nota (Rating), exibe com destaque */}
                            {data.rating && (
                                <span className={`${styles.modalPosition} ${parseFloat(data.rating) >= 7 ? styles.highRating : ''}`} style={{ marginLeft: 8 }}>
                                    Nota: {data.rating}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lógica condicional: Se tiver dados físicos mostra, senão foca na nota */}
                {hasDetails ? (
                    <div className={styles.modalStatsGrid}>
                        <div className={styles.modalStatItem}>
                            <FaRulerVertical className={styles.statIcon} />
                            <span className={styles.statLabel}>Altura</span>
                            <span className={styles.statValue}>{playerInfo.height ? `${playerInfo.height}cm` : '-'}</span>
                        </div>
                        <div className={styles.modalStatItem}>
                            <FaWeight className={styles.statIcon} />
                            <span className={styles.statLabel}>Peso</span>
                            <span className={styles.statValue}>{playerInfo.weight ? `${playerInfo.weight}kg` : '-'}</span>
                        </div>
                        <div className={styles.modalStatItem}>
                            <FaBirthdayCake className={styles.statIcon} />
                            <span className={styles.statLabel}>Idade</span>
                            <span className={styles.statValue}>
                                {getAge(playerInfo.date_of_birth)} anos
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.modalStatsGrid} style={{ gridTemplateColumns: '1fr' }}>
                        <div className={styles.modalStatItem}>
                            <span className={styles.statLabel} style={{ marginBottom: 5 }}>Performance na Partida</span>
                            <span className={styles.statValue} style={{ fontSize: '2rem', color: data.rating && parseFloat(data.rating) >= 7 ? '#00ff6a' : '#fff' }}>
                                {data.rating || "-"}
                            </span>
                            <span className={styles.statSubText}>Nota Sofascore/Sportmonks</span>
                        </div>
                    </div>
                )}

                <div className={styles.modalActions}>
                    {/* --- AQUI ESTÁ O LINK PARA A PÁGINA DO JOGADOR --- */}
                    <Link href={`/player/${playerInfo.id}`} className={styles.profileBtn}>
                        Ver Perfil Completo <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- 1. ABA VISÃO GERAL (TIMELINE COM VAR) ---
const OverviewTab = ({ events, homeId }) => {
    if (!events || events.length === 0) return <div className={styles.emptyState}>Sem eventos registrados para esta partida.</div>;

    const sortedEvents = [...events].sort((a, b) => b.minute - a.minute);

    return (
        <div className={styles.tabPanel}>
            <h3 className={styles.cardTitle}>Linha do Tempo</h3>
            <div className={styles.timeline}>
                {sortedEvents.map((event, idx) => {
                    const isHome = event.is_home;
                    const type = event.type || "Unknown";

                    // Filtros de Tipos de Evento
                    const isGoal = type === 'Goal' || type === 'Penalty';
                    const isYellow = type.includes('Yellow');
                    const isRed = type.includes('Red');
                    const isSub = type === 'Substitution';
                    const isVar = type.includes('VAR');

                    if (!isGoal && !isYellow && !isRed && !isSub && !isVar) return null;

                    return (
                        <div key={`${event.id}-${idx}`} className={`${styles.timelineEvent} ${isHome ? styles.home : styles.away}`}>
                            <div className={styles.timeBadge}>{event.minute}'</div>
                            <div className={styles.eventDetail}>
                                <span className={styles.icon}>
                                    {isGoal && <FaFutbol />}
                                    {isYellow && <FaSquare style={{ color: '#ffd700' }} />}
                                    {isRed && <FaSquare style={{ color: '#ff3333' }} />}
                                    {isSub && <FaExchangeAlt style={{ fontSize: '0.8rem' }} />}
                                    {isVar && <FaVideo style={{ color: '#00d4ff' }} />}
                                </span>
                                <div className={styles.eventText}>
                                    <span className={styles.playerName}>{event.player_name}</span>
                                    {event.related_player_name && <span className={styles.subName}>({event.related_player_name})</span>}
                                    <span className={styles.eventType}>
                                        {isVar ? `VAR: ${type.replace('VAR', '').replace('_', ' ') || 'Revisão'}` : type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- 2. ABA ESTATÍSTICAS ---
const StatsTab = ({ stats }) => {
    if (!stats || !stats.home || Object.keys(stats.home).length === 0) {
        return <div className={styles.emptyState}>Estatísticas aguardando início do jogo ou indisponíveis.</div>;
    }

    const statsConfig = [
        { key: 'ball-possession', label: 'Posse de Bola (%)', type: 'percent' },
        { key: 'goal-attempts', label: 'Finalizações Totais', type: 'number' },
        { key: 'shots-on-target', label: 'No Gol', type: 'number' },
        { key: 'saves', label: 'Defesas do Goleiro', type: 'number', icon: <FaHandPaper /> },
        { key: 'corners', label: 'Escanteios', type: 'number' },
        { key: 'fouls', label: 'Faltas', type: 'number' },
        { key: 'yellowcards', label: 'Cartões Amarelos', type: 'number' },
        { key: 'redcards', label: 'Cartões Vermelhos', type: 'number' },
        { key: 'passes', label: 'Passes Totais', type: 'number' },
        { key: 'successful-passes-percentage', label: 'Precisão de Passe (%)', type: 'percent' },
        { key: 'duels-won', label: 'Duelos Ganhos', type: 'number' },
        { key: 'tackles', label: 'Desarmes', type: 'number' }
    ];

    return (
        <div className={styles.tabPanel}>
            <div className={styles.statsList}>
                {statsConfig.map((config, index) => {
                    const key = config.key;
                    const homeVal = stats.home[key] || 0;
                    const awayVal = stats.away[key] || 0;
                    const total = homeVal + awayVal;

                    let homePercent = 50;
                    let awayPercent = 50;

                    if (total > 0 && config.type !== 'percent') {
                        homePercent = (homeVal / total) * 100;
                        awayPercent = (awayVal / total) * 100;
                    } else if (config.type === 'percent') {
                        homePercent = homeVal;
                        awayPercent = awayVal;
                    }

                    if (homeVal === 0 && awayVal === 0 && key !== 'ball-possession') return null;

                    return (
                        <div key={index} className={styles.statRow}>
                            <div className={styles.labels}>
                                <span className={styles.valueHome}>{homeVal}{config.type === 'percent' ? '%' : ''}</span>
                                <span className={styles.statName}>
                                    {config.icon && <span style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }}>{config.icon}</span>}
                                    {config.label}
                                </span>
                                <span className={styles.valueAway}>{awayVal}{config.type === 'percent' ? '%' : ''}</span>
                            </div>
                            <div className={styles.barTrack}>
                                <motion.div
                                    className={styles.barHome}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${homePercent}%` }}
                                    transition={{ duration: 1 }}
                                />
                                <div className={styles.barSeparator} />
                                <motion.div
                                    className={styles.barAway}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${awayPercent}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

// --- 3. ABA PROJEÇÕES (IA) ---
const PredictionsTab = ({ predictions, homeName, awayName }) => {
    if (!predictions || !predictions.fulltime) return <div className={styles.emptyState}>Análise de IA indisponível. Veja as Odds na barra lateral.</div>;

    const ft = predictions.fulltime;

    return (
        <div className={styles.tabPanel}>
            <h3 className={styles.cardTitle}><FaChartPie /> Probabilidades de Vitória</h3>

            <div className={styles.predChart}>
                <div className={styles.predBarContainer}>
                    <div className={styles.predBar} style={{ width: `${ft.home}%`, background: 'var(--color-primary)' }}>
                        <span className={styles.predLabel}>{ft.home}%</span>
                    </div>
                    <div className={styles.predBar} style={{ width: `${ft.draw}%`, background: '#64748b' }}>
                        <span className={styles.predLabel}>{ft.draw}%</span>
                    </div>
                    <div className={styles.predBar} style={{ width: `${ft.away}%`, background: '#3b82f6' }}>
                        <span className={styles.predLabel}>{ft.away}%</span>
                    </div>
                </div>
                <div className={styles.predLegend}>
                    <span style={{ color: 'var(--color-primary)' }}>{homeName}</span>
                    <span style={{ color: '#64748b' }}>Empate</span>
                    <span style={{ color: '#3b82f6' }}>{awayName}</span>
                </div>
            </div>

            <div className={styles.aiInsight}>
                <p>🤖 <strong>Análise IA:</strong> Probabilidades calculadas com base no histórico recente.</p>
            </div>
        </div>
    );
};

// --- 4. ABA ESCALAÇÕES (COM FOTO TÉCNICO E LINK DE JOGADOR) ---
const LineupsTab = ({ lineups, homeName, awayName }) => {
    const [activeTeam, setActiveTeam] = useState('home');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    if (!lineups || (!lineups.home?.starters?.length && !lineups.away?.starters?.length)) {
        return <div className={styles.emptyState}>Escalações ainda não confirmadas.</div>;
    }

    const currentLineup = activeTeam === 'home' ? lineups.home : lineups.away;
    const currentName = activeTeam === 'home' ? homeName : awayName;

    const groupPlayersByRow = (starters) => {
        const rows = { 1: [], 2: [], 3: [], 4: [], 5: [] };
        starters.forEach(player => {
            if (player.grid) {
                const [rowIndex] = player.grid.split(':');
                if (rows[rowIndex]) rows[rowIndex].push(player);
            }
        });
        Object.keys(rows).forEach(rowKey => {
            rows[rowKey].sort((a, b) => parseInt(a.grid.split(':')[1]) - parseInt(b.grid.split(':')[1]));
        });
        return rows;
    };

    const rows = groupPlayersByRow(currentLineup.starters);

    const PlayerNode = ({ player }) => {
        const rating = player.rating ? parseFloat(player.rating) : null;
        const isHighRating = rating && rating >= 7.0;

        return (
            <div
                className={styles.playerNode}
                onClick={() => setSelectedPlayer(player)}
                style={{ cursor: 'pointer' }}
            >
                <div className={styles.playerAvatar}>
                    <img
                        src={player.photo || '/api/placeholder/50/50'}
                        alt={player.name}
                        className={styles.playerPhoto}
                        onError={(e) => e.target.src = '/api/placeholder/50/50'}
                    />
                    {player.is_captain && <div className={styles.captainBadge}>C</div>}
                    {rating && (
                        <div className={`${styles.ratingBadge} ${isHighRating ? styles.highRatingBadge : ''}`}>
                            {rating.toFixed(1)}
                        </div>
                    )}
                </div>
                <div className={styles.playerNameField}>{player.name}</div>
                <div className={styles.playerNumberField}>{player.number}</div>
            </div>
        );
    };

    return (
        <div className={styles.tabPanel}>
            <AnimatePresence>
                {selectedPlayer && (
                    <PlayerModal
                        data={selectedPlayer}
                        onClose={() => setSelectedPlayer(null)}
                    />
                )}
            </AnimatePresence>

            <div className={styles.lineupToggleContainer}>
                <button
                    className={`${styles.toggleBtn} ${activeTeam === 'home' ? styles.activeToggle : ''}`}
                    onClick={() => setActiveTeam('home')}
                >
                    {homeName}
                </button>
                <button
                    className={`${styles.toggleBtn} ${activeTeam === 'away' ? styles.activeToggle : ''}`}
                    onClick={() => setActiveTeam('away')}
                >
                    {awayName}
                </button>
            </div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={activeTeam}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Campo Tático */}
                    <div className={styles.pitchContainer}>
                        <div className={styles.pitch}>
                            <div className={styles.fieldLines}>
                                <div className={styles.halfLine} />
                                <div className={styles.centerCircle} />
                                <div className={styles.penaltyBoxTop} />
                                <div className={styles.penaltyBoxBottom} />
                            </div>

                            <div className={styles.playersGrid}>
                                {[5, 4, 3, 2, 1].map(rowNum => {
                                    if (rows[rowNum].length === 0) return null;
                                    return (
                                        <div key={rowNum} className={styles.playerRow}>
                                            {rows[rowNum].map(player => (
                                                <PlayerNode key={player.id} player={player} />
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className={styles.lineupHeader}>
                        <h4 className={styles.teamTitle}>
                            <FaUserShield style={{ marginRight: 6 }} />
                            {currentName}
                        </h4>
                        <span className={styles.formationBadge}>
                            {currentLineup.formation || 'Formação N/A'}
                        </span>
                    </div>

                    {/* Técnico com Foto */}
                    {currentLineup.coach && (
                        <div className={styles.coachRow}>
                            <div className={styles.coachInfo}>
                                <span className={styles.coachLabel}>Técnico</span>
                                <div className={styles.coachDetail}>
                                    <img
                                        src={currentLineup.coach.photo || '/api/placeholder/40/40'}
                                        alt={currentLineup.coach.name}
                                        className={styles.coachPhoto}
                                        onError={(e) => e.target.src = '/api/placeholder/40/40'}
                                    />
                                    <span className={styles.coachName}>{currentLineup.coach.name}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentLineup.bench && currentLineup.bench.length > 0 && (
                        <div className={styles.benchContainer}>
                            <h5 className={styles.listGroupTitle}>
                                <FaTshirt style={{ marginRight: 5, fontSize: '0.7rem' }} /> Reservas
                            </h5>
                            <div className={styles.benchList}>
                                {currentLineup.bench.map((player) => (
                                    <div
                                        key={player.id}
                                        className={styles.benchRow}
                                        onClick={() => setSelectedPlayer(player)}
                                    >
                                        <span className={styles.benchNumber}>{player.number}</span>
                                        <span className={styles.benchName}>{player.name}</span>
                                        {player.rating && <span className={styles.benchRating}>{player.rating}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// --- 5. ABA H2H (CONFRONTOS DIRETOS) ---
const H2HTab = ({ matchId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/matches/${matchId}/h2h`)
            .then(res => setHistory(res.data || []))
            .catch(err => console.error("Erro ao carregar H2H", err))
            .finally(() => setLoading(false));
    }, [matchId]);

    if (loading) return <Loader text="Carregando histórico..." />;
    if (!history || history.length === 0) return <div className={styles.emptyState}>Sem histórico recente de confrontos.</div>;

    return (
        <div className={styles.tabPanel}>
            <div className={styles.h2hList}>
                {history.map(match => {
                    const homeScore = match.home_team.score;
                    const awayScore = match.away_team.score;
                    const isHomeWin = homeScore > awayScore;
                    const isAwayWin = awayScore > homeScore;
                    const isDraw = homeScore === awayScore;

                    return (
                        <div key={match.id} className={styles.h2hCard}>
                            <div className={styles.h2hHeader}>
                                <span className={styles.h2hDate}>
                                    {new Date(match.timestamp * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                </span>
                                <span className={styles.h2hLeague}>{match.league.name}</span>
                            </div>
                            <div className={styles.h2hContent}>
                                <div className={`${styles.h2hTeam} ${styles.teamHome} ${isHomeWin ? styles.winner : (isDraw ? '' : styles.loser)}`}>
                                    <span className={styles.h2hTeamName}>{match.home_team.name}</span>
                                    {match.home_team.logo ? <img src={match.home_team.logo} className={styles.h2hLogo} alt="H" /> : <div className={styles.h2hPlaceholder} />}
                                </div>
                                <div className={styles.h2hScoreBox}>
                                    <span className={`${styles.scoreNum} ${isHomeWin ? styles.scoreWin : ''}`}>{homeScore}</span>
                                    <span className={styles.scoreDiv}>:</span>
                                    <span className={`${styles.scoreNum} ${isAwayWin ? styles.scoreWin : ''}`}>{awayScore}</span>
                                </div>
                                <div className={`${styles.h2hTeam} ${styles.teamAway} ${isAwayWin ? styles.winner : (isDraw ? '' : styles.loser)}`}>
                                    {match.away_team.logo ? <img src={match.away_team.logo} className={styles.h2hLogo} alt="A" /> : <div className={styles.h2hPlaceholder} />}
                                    <span className={styles.h2hTeamName}>{match.away_team.name}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function MatchContent({ activeTab, match }) {
    if (!match) return null;

    return (
        <div className={styles.contentGrid}>
            <div className={styles.mainColumn}>
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'overview' && (
                        <OverviewTab events={match.events} homeId={match.home_team.id} />
                    )}

                    {activeTab === 'stats' && (
                        <StatsTab stats={match.stats} />
                    )}

                    {activeTab === 'predictions' && (
                        <PredictionsTab
                            predictions={match.predictions}
                            homeName={match.home_team.name}
                            awayName={match.away_team.name}
                        />
                    )}

                    {activeTab === 'lineups' && (
                        <LineupsTab
                            lineups={match.lineups}
                            homeName={match.home_team.name}
                            awayName={match.away_team.name}
                        />
                    )}

                    {activeTab === 'h2h' && (
                        <H2HTab matchId={match.id} />
                    )}
                </motion.div>
            </div>

            {/* SIDEBAR */}
            <div className={styles.sideColumn}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}><FaMapMarkerAlt /> Detalhes</h3>

                    {match.league && (
                        <div className={styles.leagueInfo} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {match.league.logo && <img src={match.league.logo} style={{ width: 25, height: 25, objectFit: 'contain' }} alt="League" />}
                            <span style={{ color: '#fff', fontWeight: 'bold' }}>{match.league.name}</span>
                        </div>
                    )}

                    <p className={styles.infoText}>{match.venue || "Estádio não informado"}</p>
                    {match.weather && (
                        <div className={styles.weatherBox}>
                            <FaCloudSun />
                            <span>{match.weather.temperature?.temp ? `${match.weather.temperature.temp}°C` : '-'}</span>
                            <span>{match.weather.type || ''}</span>
                        </div>
                    )}
                </div>

                {/* ODDS (Se Predictions for Null ou se Odds existirem) */}
                {match.odds && (
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <FaMoneyBillWave style={{ color: '#00ff6a' }} /> Odds ({match.odds.bookmaker})
                        </h3>
                        <div className={styles.oddsContainer}>
                            <div className={styles.oddBox}>
                                <span className={styles.oddLabel}>Casa</span>
                                <span className={styles.oddValue}>{match.odds.home?.value}</span>
                                <span className={styles.oddProb}>{match.odds.home?.prob}</span>
                            </div>
                            <div className={styles.oddBox}>
                                <span className={styles.oddLabel}>X</span>
                                <span className={styles.oddValue}>{match.odds.draw?.value}</span>
                                <span className={styles.oddProb}>{match.odds.draw?.prob}</span>
                            </div>
                            <div className={styles.oddBox}>
                                <span className={styles.oddLabel}>Fora</span>
                                <span className={styles.oddValue}>{match.odds.away?.value}</span>
                                <span className={styles.oddProb}>{match.odds.away?.prob}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mini Gráfico (apenas se predictions existirem) */}
                {match.predictions && activeTab !== 'predictions' && (
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Probabilidade</h3>
                        <div className={styles.miniPred}>
                            <div className={styles.miniHeader}>
                                <span>Casa</span>
                                <span className={styles.miniVal}>{match.predictions.fulltime?.home}%</span>
                            </div>
                            <div className={styles.miniTrack}>
                                <div className={styles.miniBar} style={{ width: `${match.predictions.fulltime?.home}%` }}></div>
                            </div>
                            <div className={styles.miniHeader} style={{ marginTop: '10px' }}>
                                <span>Fora</span>
                                <span className={styles.miniVal}>{match.predictions.fulltime?.away}%</span>
                            </div>
                            <div className={styles.miniTrack}>
                                <div className={styles.miniBar} style={{ width: `${match.predictions.fulltime?.away}%`, background: '#3b82f6' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.card}>
                    <h3 className={styles.cardTitle}><FaHistory /> Histórico</h3>
                    <p className={styles.infoText}>
                        Acompanhe o histórico completo na aba H2H para ver confrontos passados.
                    </p>
                </div>
            </div>
        </div>
    );
}