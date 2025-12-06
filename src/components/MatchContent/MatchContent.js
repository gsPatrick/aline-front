
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFutbol, FaSquare, FaSpinner, FaChartPie, FaMapMarkerAlt,
    FaCloudSun, FaExchangeAlt, FaHistory, FaUserShield, FaTshirt,
    FaVideo, FaHandPaper, FaMoneyBillWave, FaTimes, FaRulerVertical,
    FaWeight, FaBirthdayCake, FaExternalLinkAlt
} from 'react-icons/fa';
import api from '@/lib/api';
import styles from './MatchContent.module.css';
import PredictionWidget from '@/components/PredictionWidget/PredictionWidget';
import StatsMatrix from '@/components/StatsMatrix/StatsMatrix';

// Variantes de Animação para as Abas
const tabVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.3 } }
};

// --- COMPONENTE MODAL DE DETALHES DO JOGADOR ---
const PlayerModal = ({ data, onClose }) => {
    if (!data) return null;

    // Normalização segura: tenta pegar de 'player' ou usa o próprio objeto
    const playerInfo = data.player || data;
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
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose}><FaTimes /></button>

                <div className={styles.modalHeader}>
                    <div className={styles.modalAvatarContainer}>
                        <img
                            src={playerInfo.photo || playerInfo.image_path || '/api/placeholder/100/100'}
                            alt={playerInfo.name}
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
                            {data.rating && (
                                <span className={`${styles.modalPosition} ${parseFloat(data.rating) >= 7 ? styles.highRating : ''}`} style={{ marginLeft: 8 }}>
                                    Nota: {data.rating}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

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
                            <span className={styles.statValue}>{getAge(playerInfo.date_of_birth)} anos</span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.modalStatsGrid} style={{ gridTemplateColumns: '1fr' }}>
                        <div className={styles.modalStatItem}>
                            <span className={styles.statLabel} style={{ marginBottom: 5 }}>Performance</span>
                            <span className={styles.statValue} style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>
                                {data.rating || "-"}
                            </span>
                            <span className={styles.statSubText}>Nota da Partida</span>
                        </div>
                    </div>
                )}

                <div className={styles.modalActions}>
                    <Link href={`/player/${playerInfo.id}`} className={styles.profileBtn}>
                        Ver Perfil Completo <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- 1. ABA VISÃO GERAL (TIMELINE) ---
const OverviewTab = ({ events, homeId }) => {
    if (!events || events.length === 0) return <div className={styles.emptyState}>Sem eventos registrados para esta partida.</div>;

    return (
        <div className={styles.tabPanel}>
            <h3 className={styles.cardTitle}>Linha do Tempo</h3>
            <div className={styles.timeline}>
                {events.map((event, idx) => {
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
                        <motion.div
                            key={`${event.id}-${idx}`}
                            className={`${styles.timelineEvent} ${isHome ? styles.home : styles.away}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <div className={styles.timeBadge}>{event.minute}'</div>
                            <div className={styles.eventDetail}>
                                <span className={styles.icon}>
                                    {isGoal && <FaFutbol className={styles.iconGoal} />}
                                    {isYellow && <FaSquare style={{ color: '#ffd700' }} />}
                                    {isRed && <FaSquare style={{ color: '#ff3333' }} />}
                                    {isSub && <FaExchangeAlt style={{ fontSize: '0.8rem', color: '#a0a0a0' }} />}
                                    {isVar && <FaVideo style={{ color: '#00d4ff' }} />}
                                </span>
                                <div className={styles.eventText}>
                                    <span className={styles.playerName}>{event.player_name}</span>
                                    {event.related_player_name && <span className={styles.subName}>({event.related_player_name})</span>}
                                    <span className={styles.eventType}>
                                        {isVar ? `VAR: ${type.replace('VAR', '')}` : type}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// --- 2. ABA ESTATÍSTICAS ---
const StatsTab = ({ stats, analysis, homeTeam, awayTeam }) => {
    if (!stats && !analysis) {
        return <div className={styles.emptyState}>Estatísticas aguardando início do jogo.</div>;
    }

    const statsConfig = [
        { key: 'possession', label: 'Posse de Bola (%)', type: 'percent' },
        { key: 'shots_total', label: 'Finalizações', type: 'number' },
        { key: 'shots_on_target', label: 'No Gol', type: 'number' },
        { key: 'corners', label: 'Escanteios', type: 'number' },
        { key: 'fouls', label: 'Faltas', type: 'number' },
        { key: 'yellowcards', label: 'Cartões Amarelos', type: 'number' },
        { key: 'redcards', label: 'Cartões Vermelhos', type: 'number' },
        { key: 'passes', label: 'Passes', type: 'number' },
        { key: 'dangerous_attacks', label: 'Ataques Perigosos', type: 'number' },
        { key: 'attacks', label: 'Ataques', type: 'number' }
    ];

    return (
        <div className={styles.tabPanel}>
            {/* Matriz de Análise (Novo Componente) */}
            {analysis && (
                <div style={{ marginBottom: '2rem' }}>
                    <StatsMatrix
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        stats={analysis}
                    />
                </div>
            )}

            {stats && stats.home && (
                <div className={styles.statsList}>
                    {statsConfig.map((config, index) => {
                        const key = config.key;
                        const homeVal = stats.home[key] ?? stats.home[key.replace('_', '-')] ?? 0;
                        const awayVal = stats.away[key] ?? stats.away[key.replace('_', '-')] ?? 0;
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

                        if (homeVal === 0 && awayVal === 0 && key !== 'possession') return null;

                        return (
                            <motion.div
                                key={index}
                                className={styles.statRow}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className={styles.labels}>
                                    <span className={styles.valueHome}>{homeVal}{config.type === 'percent' ? '%' : ''}</span>
                                    <span className={styles.statName}>{config.label}</span>
                                    <span className={styles.valueAway}>{awayVal}{config.type === 'percent' ? '%' : ''}</span>
                                </div>
                                <div className={styles.barTrack}>
                                    <motion.div
                                        className={styles.barHome}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${homePercent}%` }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                    />
                                    <div className={styles.barSeparator} />
                                    <motion.div
                                        className={styles.barAway}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${awayPercent}%` }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                    />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

// --- 3. ABA PROJEÇÕES (IA) ---
const PredictionsTab = ({ predictions }) => {
    if (!predictions) return <div className={styles.emptyState}>Probabilidades não disponíveis no momento.</div>;

    return (
        <div className={styles.tabPanel}>
            <PredictionWidget predictions={predictions} />

            <div className={styles.aiInsight}>
                <p>🤖 <strong>Análise 10Stats:</strong> Probabilidades calculadas com base no histórico recente e performance.</p>
            </div>
        </div>
    );
};

// --- 4. ABA ESCALAÇÕES ---
const LineupsTab = ({ lineups, homeName, awayName }) => {
    const [activeTeam, setActiveTeam] = useState('home');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    if (!lineups || (!lineups.home?.starters?.length && !lineups.away?.starters?.length)) {
        return <div className={styles.emptyState}>Escalações ainda não confirmadas.</div>;
    }

    const currentLineup = activeTeam === 'home' ? lineups.home : lineups.away;
    const currentName = activeTeam === 'home' ? homeName : awayName;

    // Função auxiliar para agrupar jogadores por linha no campo (Simplificada)
    // Sportmonks retorna 'grid' tipo "4:1". Vamos agrupar pela primeira parte.
    const groupPlayersByRow = (starters) => {
        const rows = { 1: [], 2: [], 3: [], 4: [], 5: [] }; // Goleiro até Ataque
        starters.forEach(player => {
            if (player.grid) {
                const [rowIndex] = player.grid.split(':');
                if (rows[rowIndex]) rows[rowIndex].push(player);
            } else {
                // Fallback baseado na posição se não tiver grid
                const posMap = { 24: 1, 25: 2, 26: 3, 27: 4 }; // IDs padrão sportmonks
                const row = posMap[player.position] || 3;
                rows[row].push(player);
            }
        });
        // Ordena jogadores em cada linha
        Object.keys(rows).forEach(key => {
            rows[key].sort((a, b) => (a.grid?.split(':')[1] || 0) - (b.grid?.split(':')[1] || 0));
        });
        return rows;
    };

    const rows = groupPlayersByRow(currentLineup.starters);

    const PlayerNode = ({ player }) => {
        const rating = player.rating ? parseFloat(player.rating) : null;
        return (
            <motion.div
                className={styles.playerNode}
                onClick={() => setSelectedPlayer(player)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
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
                        <div className={`${styles.ratingBadge} ${rating >= 7.0 ? styles.highRatingBadge : ''}`}>
                            {rating.toFixed(1)}
                        </div>
                    )}
                </div>
                <div className={styles.playerNameField}>{player.name.split(' ').pop()}</div>
                <div className={styles.playerNumberField}>{player.number}</div>
            </motion.div>
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

            <motion.div
                key={activeTeam}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
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
                            {/* Renderiza Goleiro (Linha 1) no fundo se for home, topo se away? 
                                Normalmente campo tático é estático. Goleiro embaixo.
                            */}
                            {[1, 2, 3, 4, 5].map(rowNum => {
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
                            <FaTshirt style={{ marginRight: 5, fontSize: '0.7rem' }} /> Banco de Reservas
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
        </div>
    );
};

// --- 5. ABA CLASSIFICAÇÃO (STANDINGS) ---
const StandingsTab = ({ standings }) => {
    if (!standings || !standings.table || standings.table.length === 0) {
        return <div className={styles.emptyState}>Tabela de classificação não disponível.</div>;
    }

    return (
        <div className={styles.tabPanel}>
            <div className={styles.standingsTable}>
                <div className={styles.standingsHeader}>
                    <span className={styles.colPos}>#</span>
                    <span className={styles.colTeam}>Time</span>
                    <span className={styles.colPts}>P</span>
                    <span className={styles.colJ}>J</span>
                    <span className={styles.colV}>V</span>
                    <span className={styles.colE}>E</span>
                    <span className={styles.colD}>D</span>
                    <span className={styles.colSG}>SG</span>
                </div>
                {standings.table.map((row) => (
                    <div
                        key={row.team.id}
                        className={`${styles.standingsRow} ${row.team.id === standings.home_id || row.team.id === standings.away_id ? styles.highlightRow : ''}`}
                    >
                        <span className={styles.colPos}>{row.position}</span>
                        <div className={styles.colTeam}>
                            <img src={row.team.logo} alt={row.team.name} className={styles.tableLogo} />
                            <span className={styles.tableName}>{row.team.name}</span>
                        </div>
                        <span className={styles.colPts}>{row.points}</span>
                        <span className={styles.colJ}>{row.overall.games_played}</span>
                        <span className={styles.colV}>{row.overall.won}</span>
                        <span className={styles.colE}>{row.overall.draw}</span>
                        <span className={styles.colD}>{row.overall.lost}</span>
                        <span className={styles.colSG}>{row.overall.goal_difference}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 6. ABA FORMA (LAST 10 GAMES) ---
const FormTab = ({ form, homeName, awayName }) => {
    const [activeTeam, setActiveTeam] = useState('home');

    if (!form || (!form.home?.length && !form.away?.length)) {
        return <div className={styles.emptyState}>Histórico recente não disponível.</div>;
    }

    const currentForm = activeTeam === 'home' ? form.home : form.away;
    const currentName = activeTeam === 'home' ? homeName : awayName;

    return (
        <div className={styles.tabPanel}>
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

            <h4 className={styles.sectionTitle}>Últimos 10 Jogos - {currentName}</h4>

            <div className={styles.h2hList}>
                {currentForm.map((match, idx) => {
                    const isWinner = match.home_team.is_winner || match.away_team.is_winner; // Ajustar conforme lógica de winner
                    // Simplificação visual
                    return (
                        <motion.div
                            key={match.id}
                            className={styles.h2hCard}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <div className={styles.h2hHeader}>
                                <span className={styles.h2hDate}>
                                    {new Date(match.timestamp * 1000).toLocaleDateString('pt-BR')}
                                </span>
                                <span className={styles.h2hLeague}>{match.league.name}</span>
                            </div>
                            <div className={styles.h2hContent}>
                                <div className={styles.h2hTeam}>
                                    <span className={styles.h2hTeamName}>{match.home_team.name}</span>
                                    <img src={match.home_team.logo} className={styles.h2hLogo} alt="H" />
                                </div>
                                <div className={styles.h2hScoreBox}>
                                    <span className={styles.scoreNum}>{match.home_team.score}</span>
                                    <span className={styles.scoreDiv}>:</span>
                                    <span className={styles.scoreNum}>{match.away_team.score}</span>
                                </div>
                                <div className={styles.h2hTeam}>
                                    <img src={match.away_team.logo} className={styles.h2hLogo} alt="A" />
                                    <span className={styles.h2hTeamName}>{match.away_team.name}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// --- 7. ABA PRÓXIMOS JOGOS ---
const UpcomingTab = ({ upcoming, homeName, awayName }) => {
    const [activeTeam, setActiveTeam] = useState('home');

    if (!upcoming || (!upcoming.home?.length && !upcoming.away?.length)) {
        return <div className={styles.emptyState}>Próximos jogos não agendados.</div>;
    }

    const currentList = activeTeam === 'home' ? upcoming.home : upcoming.away;
    const currentName = activeTeam === 'home' ? homeName : awayName;

    return (
        <div className={styles.tabPanel}>
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

            <h4 className={styles.sectionTitle}>Próximos Jogos - {currentName}</h4>

            <div className={styles.h2hList}>
                {currentList.map((match, idx) => (
                    <motion.div
                        key={match.id}
                        className={styles.h2hCard}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <div className={styles.h2hHeader}>
                            <span className={styles.h2hDate}>
                                {new Date(match.timestamp * 1000).toLocaleDateString('pt-BR')}
                            </span>
                            <span className={styles.h2hLeague}>{match.league.name}</span>
                        </div>
                        <div className={styles.h2hContent}>
                            <div className={styles.h2hTeam}>
                                <span className={styles.h2hTeamName}>{match.home_team.name}</span>
                                <img src={match.home_team.logo} className={styles.h2hLogo} alt="H" />
                            </div>
                            <div className={styles.h2hScoreBox}>
                                <span className={styles.scoreNum}>-</span>
                                <span className={styles.scoreDiv}>:</span>
                                <span className={styles.scoreNum}>-</span>
                            </div>
                            <div className={styles.h2hTeam}>
                                <img src={match.away_team.logo} className={styles.h2hLogo} alt="A" />
                                <span className={styles.h2hTeamName}>{match.away_team.name}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --- 8. ABA H2H (Otimizada) ---
const H2HTab = ({ history }) => {
    if (!history || history.length === 0) return <div className={styles.emptyState}>Sem histórico recente.</div>;

    return (
        <div className={styles.tabPanel}>
            <div className={styles.h2hList}>
                {history.map((match, idx) => {
                    const homeScore = match.home_team.score;
                    const awayScore = match.away_team.score;
                    const isHomeWin = homeScore > awayScore;
                    const isAwayWin = awayScore > homeScore;

                    return (
                        <motion.div
                            key={match.id}
                            className={styles.h2hCard}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className={styles.h2hHeader}>
                                <span className={styles.h2hDate}>
                                    {new Date(match.timestamp * 1000).toLocaleDateString('pt-BR')}
                                </span>
                                <span className={styles.h2hLeague}>{match.league.name}</span>
                            </div>
                            <div className={styles.h2hContent}>
                                <div className={`${styles.h2hTeam} ${styles.teamHome} ${isHomeWin ? styles.winner : ''}`}>
                                    <span className={styles.h2hTeamName}>{match.home_team.name}</span>
                                    <img src={match.home_team.logo} className={styles.h2hLogo} alt="H" />
                                </div>
                                <div className={styles.h2hScoreBox}>
                                    <span className={`${styles.scoreNum} ${isHomeWin ? styles.scoreWin : ''}`}>{homeScore}</span>
                                    <span className={styles.scoreDiv}>:</span>
                                    <span className={`${styles.scoreNum} ${isAwayWin ? styles.scoreWin : ''}`}>{awayScore}</span>
                                </div>
                                <div className={`${styles.h2hTeam} ${styles.teamAway} ${isAwayWin ? styles.winner : ''}`}>
                                    <img src={match.away_team.logo} className={styles.h2hLogo} alt="A" />
                                    <span className={styles.h2hTeamName}>{match.away_team.name}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

import GoalsAnalysis from './GoalsAnalysis';
import CornersAnalysis from './CornersAnalysis';
import CardsAnalysis from './CardsAnalysis';

// --- COMPONENTE PRINCIPAL ---
export default function MatchContent({ activeTab, match }) {
    const [goalsData, setGoalsData] = useState(null);
    const [cornersData, setCornersData] = useState(null);
    const [cardsData, setCardsData] = useState(null);

    // Fetch data on tab change
    useEffect(() => {
        if (!match?.id) return;

        const fetchData = async () => {
            try {
                if (activeTab === 'goals' && !goalsData) {
                    const data = await api.matchService.getGoalsAnalysis(match.id);
                    setGoalsData(data.data);
                }
                if (activeTab === 'corners' && !cornersData) {
                    const data = await api.matchService.getCornersAnalysis(match.id);
                    setCornersData(data.data);
                }
                if (activeTab === 'cards' && !cardsData) {
                    const data = await api.matchService.getCardsAnalysis(match.id);
                    setCardsData(data.data);
                }
            } catch (error) {
                console.error("Error fetching analysis:", error);
            }
        };

        fetchData();
    }, [activeTab, match?.id, goalsData, cornersData, cardsData]); // Added data dependencies to re-fetch if data is cleared or becomes null

    if (!match) return null;

    return (
        <div className={styles.contentGrid}>
            <div className={styles.mainColumn}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {activeTab === 'overview' && (
                            <OverviewTab events={match.timeline || match.events} homeId={match.home_team.id} />
                        )}

                        {activeTab === 'stats' && (
                            <StatsTab
                                stats={match.stats}
                                analysis={match.analysis?.stats}
                                homeTeam={match.home_team}
                                awayTeam={match.away_team}
                            />
                        )}

                        {activeTab === 'predictions' && (
                            <PredictionsTab
                                predictions={match.analysis?.predictions || match.predictions}
                            />
                        )}

                        {activeTab === 'goals' && (
                            <GoalsAnalysis data={goalsData} />
                        )}

                        {activeTab === 'corners' && (
                            <CornersAnalysis data={cornersData} />
                        )}

                        {activeTab === 'cards' && (
                            <CardsAnalysis data={cardsData} />
                        )}

                        {activeTab === 'lineups' && (
                            <LineupsTab
                                lineups={match.lineups}
                                homeName={match.home_team.name}
                                awayName={match.away_team.name}
                            />
                        )}

                        {activeTab === 'standings' && (
                            <StandingsTab
                                standings={match.analysis?.standings}
                            />
                        )}

                        {activeTab === 'form' && (
                            <FormTab
                                form={match.analysis?.form}
                                homeName={match.home_team.name}
                                awayName={match.away_team.name}
                            />
                        )}

                        {activeTab === 'upcoming' && (
                            <UpcomingTab
                                upcoming={match.analysis?.upcoming}
                                homeName={match.home_team.name}
                                awayName={match.away_team.name}
                            />
                        )}

                        {activeTab === 'h2h' && (
                            <H2HTab history={match.analysis?.h2h || []} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* SIDEBAR DE INFORMAÇÕES */}
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

                {match.odds && (
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <FaMoneyBillWave style={{ color: 'var(--color-primary)' }} /> Odds ({match.odds.bookmaker})
                        </h3>
                        <div className={styles.oddsContainer}>
                            <motion.div className={styles.oddBox} whileHover={{ scale: 1.05 }}>
                                <span className={styles.oddLabel}>1</span>
                                <span className={styles.oddValue}>{match.odds.home?.value || '-'}</span>
                                <span className={styles.oddProb}>{match.odds.home?.prob}</span>
                            </motion.div>
                            <motion.div className={styles.oddBox} whileHover={{ scale: 1.05 }}>
                                <span className={styles.oddLabel}>X</span>
                                <span className={styles.oddValue}>{match.odds.draw?.value || '-'}</span>
                                <span className={styles.oddProb}>{match.odds.draw?.prob}</span>
                            </motion.div>
                            <motion.div className={styles.oddBox} whileHover={{ scale: 1.05 }}>
                                <span className={styles.oddLabel}>2</span>
                                <span className={styles.oddValue}>{match.odds.away?.value || '-'}</span>
                                <span className={styles.oddProb}>{match.odds.away?.prob}</span>
                            </motion.div>
                        </div>
                    </div>
                )}

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
                                <div className={styles.miniBar} style={{ width: `${match.predictions.fulltime?.away}%`, background: '#0ea5e9' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}