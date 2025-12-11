'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './LeagueFixtures.module.css';

export default function LeagueFixtures({
    fixtures = [],
    rounds = [],
    selectedRoundId,
    onRoundChange,
    loading = false
}) {
    const [filter, setFilter] = useState('round'); // 'round' | 'today' | 'week'

    const filteredFixtures = useMemo(() => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        switch (filter) {
            case 'today':
                return fixtures.filter(f => {
                    const matchDate = new Date(f.starting_at_timestamp * 1000).toISOString().split('T')[0];
                    return matchDate === today;
                });
            case 'week':
                const weekEnd = new Date(now);
                weekEnd.setDate(weekEnd.getDate() + 7);
                return fixtures.filter(f => {
                    const matchDate = new Date(f.starting_at_timestamp * 1000);
                    return matchDate >= now && matchDate <= weekEnd;
                });
            default:
                // When 'round' is selected, we assume 'fixtures' passed are already for that round
                return fixtures;
        }
    }, [fixtures, filter]);

    const formatTime = (timestamp) => {
        if (!timestamp) return '--:--';
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    const isLive = (status) => {
        return ['LIVE', 'HT', '1T', '2T', 'ET', 'PEN'].includes(status?.short);
    };

    const isFinished = (status) => {
        return ['FT', 'AET', 'PEN'].includes(status?.short);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <h3 className={styles.title}>JOGOS</h3>
                    {filter === 'round' && rounds.length > 0 && (
                        <select
                            className={styles.roundSelect}
                            value={selectedRoundId || ''}
                            onChange={(e) => onRoundChange && onRoundChange(e.target.value)}
                            disabled={loading}
                        >
                            {rounds.map(round => (
                                <option key={round.id} value={round.id}>
                                    {round.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className={styles.filters}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'round' ? styles.active : ''}`}
                        onClick={() => setFilter('round')}
                    >
                        Rodada
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'today' ? styles.active : ''}`}
                        onClick={() => setFilter('today')}
                    >
                        Hoje
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'week' ? styles.active : ''}`}
                        onClick={() => setFilter('week')}
                    >
                        Semana
                    </button>
                </div>
            </div>

            {/* Fixtures List */}
            <div className={styles.fixturesList}>
                {loading ? (
                    <div className={styles.loading}>Carregando jogos...</div>
                ) : filteredFixtures.length === 0 ? (
                    <div className={styles.empty}>Nenhum jogo encontrado</div>
                ) : (
                    filteredFixtures.map((fixture) => (
                        <Link
                            key={fixture.id}
                            href={`/match/${fixture.id}`}
                            className={styles.fixtureRow}
                        >
                            <div className={styles.timeCol}>
                                <span className={styles.date}>{formatDate(fixture.starting_at_timestamp || fixture.timestamp)}</span>
                                {isLive(fixture.state) ? (
                                    <span className={styles.live}>
                                        <span className={styles.liveDot}></span>
                                        {fixture.state?.short}
                                    </span>
                                ) : isFinished(fixture.state) ? (
                                    <span className={styles.finished}>FT</span>
                                ) : (
                                    <span className={styles.time}>{formatTime(fixture.starting_at_timestamp || fixture.timestamp)}</span>
                                )}
                            </div>

                            <div className={styles.teamsCol}>
                                <div className={styles.teamLine}>
                                    {fixture.participants?.find(p => p.meta?.location === 'home')?.image_path && (
                                        <img src={fixture.participants.find(p => p.meta?.location === 'home').image_path} alt="" className={styles.teamLogo} />
                                    )}
                                    <span className={styles.teamName}>{fixture.participants?.find(p => p.meta?.location === 'home')?.name || 'TBD'}</span>
                                </div>
                                <div className={styles.teamLine}>
                                    {fixture.participants?.find(p => p.meta?.location === 'away')?.image_path && (
                                        <img src={fixture.participants.find(p => p.meta?.location === 'away').image_path} alt="" className={styles.teamLogo} />
                                    )}
                                    <span className={styles.teamName}>{fixture.participants?.find(p => p.meta?.location === 'away')?.name || 'TBD'}</span>
                                </div>
                            </div>

                            <div className={styles.scoreCol}>
                                {(isLive(fixture.state) || isFinished(fixture.state)) && (
                                    <div className={styles.scores}>
                                        <span className={isLive(fixture.state) ? styles.scoreLive : ''}>
                                            {fixture.scores?.find(s => s.description === 'CURRENT')?.score?.goals ||
                                                fixture.participants?.find(p => p.meta?.location === 'home')?.score || 0}
                                        </span>
                                        <span className={isLive(fixture.state) ? styles.scoreLive : ''}>
                                            {fixture.scores?.find(s => s.description === 'CURRENT')?.score?.goals ||
                                                fixture.participants?.find(p => p.meta?.location === 'away')?.score || 0}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
