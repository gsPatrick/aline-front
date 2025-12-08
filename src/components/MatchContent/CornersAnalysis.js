'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaFlag, FaClock, FaChartArea, FaExclamationTriangle } from 'react-icons/fa';
import StatCard from '@/components/shared/StatCard';
import HeatmapTable from '@/components/shared/HeatmapTable';
import styles from './CornersAnalysis.module.css';

export default function CornersAnalysis({ data, chartsData, filterCondition = 'ALL', isLive = false, currentMinute = 90 }) {
    const [activeTeam, setActiveTeam] = useState('home');

    if (!data) {
        return (
            <div className={styles.emptyState}>
                <FaFlag className={styles.emptyIcon} />
                <p>Análise de escanteios não disponível</p>
            </div>
        );
    }

    const { home, away } = data;
    const currentData = filterCondition === 'HOME' ? home : filterCondition === 'AWAY' ? away : null;

    // If ALL, show both teams side by side
    if (filterCondition === 'ALL') {
        return (
            <div className={styles.container}>
                {/* Timeline Chart (Full Width) */}
                {chartsData?.timeline && (
                    <div className={styles.chartSection}>
                        <h4 className={styles.sectionTitle}>
                            <FaChartArea className={styles.titleIcon} />
                            Linha do Tempo de Pressão
                        </h4>
                        <TimelineChart data={chartsData.timeline} isLive={isLive} currentMinute={currentMinute} />
                    </div>
                )}

                <div className={styles.teamToggle}>
                    <button
                        className={`${styles.toggleBtn} ${activeTeam === 'home' ? styles.active : ''}`}
                        onClick={() => setActiveTeam('home')}
                    >
                        Casa
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${activeTeam === 'away' ? styles.active : ''}`}
                        onClick={() => setActiveTeam('away')}
                    >
                        Fora
                    </button>
                </div>

                <TeamCornersAnalysis data={activeTeam === 'home' ? home : away} />
            </div>
        );
    }

    // Single team view
    return (
        <div className={styles.container}>
            {chartsData?.timeline && (
                <div className={styles.chartSection}>
                    <h4 className={styles.sectionTitle}>
                        <FaChartArea className={styles.titleIcon} />
                        Linha do Tempo de Pressão
                    </h4>
                    <TimelineChart data={chartsData.timeline} isLive={isLive} currentMinute={currentMinute} />
                </div>
            )}
            <TeamCornersAnalysis data={currentData} />
        </div>
    );
}

function TimelineChart({ data, isLive, currentMinute }) {
    if (!data || data.length === 0) return null;

    // Filter data up to current minute if live
    const chartData = isLive ? data.filter(d => d.minute <= currentMinute) : data;

    return (
        <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="minute"
                        stroke="rgba(255,255,255,0.5)"
                        label={{ value: 'Minuto', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        label={{ value: 'Pressão', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(0, 0, 0, 0.9)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white'
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="home"
                        stroke="#00d4ff"
                        strokeWidth={2}
                        dot={{ fill: '#00d4ff', r: 3 }}
                        name="Casa"
                    />
                    <Line
                        type="monotone"
                        dataKey="away"
                        stroke="#ff3366"
                        strokeWidth={2}
                        dot={{ fill: '#ff3366', r: 3 }}
                        name="Fora"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function TeamCornersAnalysis({ data }) {
    if (!data) return null;

    const hasRaces = data.races !== null && data.races !== undefined;

    return (
        <>
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <StatCard
                    title="Média de Escanteios"
                    value={data.avgFor}
                    subtitle="A favor por jogo"
                    icon={FaFlag}
                    color="primary"
                />
                <StatCard
                    title="Média Contra"
                    value={data.avgAgainst}
                    subtitle="Contra por jogo"
                    icon={FaFlag}
                    color="danger"
                />
                <StatCard
                    title="Total Médio"
                    value={data.avgTotal}
                    subtitle="Por partida"
                    icon={FaFlag}
                    color="success"
                />
                <StatCard
                    title="Over 8.5"
                    value={`${data.trends?.over85 || 0}%`}
                    subtitle="Mais de 8.5 escanteios"
                    icon={FaClock}
                    color={parseFloat(data.trends?.over85 || 0) >= 50 ? 'success' : 'warning'}
                />
            </div>

            {/* Corner Races */}
            {hasRaces ? (
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>
                        <FaFlag className={styles.titleIcon} />
                        Corridas de Escanteios
                    </h4>
                    <div className={styles.racesGrid}>
                        <RaceCard race="3" percentage={data.races.race3} />
                        <RaceCard race="5" percentage={data.races.race5} />
                        <RaceCard race="7" percentage={data.races.race7} />
                        <RaceCard race="9" percentage={data.races.race9} />
                    </div>
                </div>
            ) : (
                <div className={styles.fallbackCard}>
                    <FaExclamationTriangle className={styles.fallbackIcon} />
                    <div className={styles.fallbackText}>
                        <strong>Corridas de Escanteios não disponíveis</strong>
                        <p>Dados de eventos minuto a minuto não estão disponíveis para esta liga.</p>
                    </div>
                </div>
            )}

            {/* Intervals Heatmap */}
            {data.intervals && (
                <div className={styles.section}>
                    <HeatmapTable
                        intervals={data.intervals}
                        title="Distribuição de Escanteios por Intervalo"
                        type="corners"
                    />
                </div>
            )}
        </>
    );
}

function RaceCard({ race, percentage }) {
    const pct = parseFloat(percentage);
    const getColor = () => {
        if (pct >= 60) return '#00ff88';
        if (pct >= 40) return '#ffaa00';
        return '#ff3366';
    };

    return (
        <div className={styles.raceCard}>
            <div className={styles.raceHeader}>
                <FaFlag className={styles.raceIcon} />
                <span className={styles.raceTitle}>Race to {race}</span>
            </div>
            <div className={styles.raceValue} style={{ color: getColor() }}>
                {percentage}%
            </div>
            <div className={styles.raceBar}>
                <div
                    className={styles.raceBarFill}
                    style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${getColor()}, ${getColor()}aa)`
                    }}
                />
            </div>
            <div className={styles.raceLabel}>Probabilidade de vencer</div>
        </div>
    );
}
