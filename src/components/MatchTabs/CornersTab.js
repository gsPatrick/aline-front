'use client';
import RaceChart from '../shared/RaceChart';
import CornerIntervalsHeatmap from '../shared/CornerIntervalsHeatmap';
import StatCard from '../shared/StatCard';
import { FaFlag, FaChartLine, FaClock } from 'react-icons/fa';
import styles from './CornersTab.module.css';

export default function CornersTab({ homeData, awayData, homeTeam, awayTeam, chartsData, isLive, currentMinute }) {
    if (!homeData || !awayData) {
        return <div className={styles.emptyState}>Dados de cantos não disponíveis</div>;
    }

    return (
        <div className={styles.container}>
            {/* Average Stats Cards */}
            <div className={styles.statsGrid}>
                <StatCard
                    title="Média de Cantos - Casa"
                    value={homeData.avgTotal || '0.0'}
                    subtitle={`${homeData.avgFor || '0.0'} a favor • ${homeData.avgAgainst || '0.0'} contra`}
                    icon={FaChartLine}
                    color="primary"
                />
                <StatCard
                    title="Média de Cantos - Fora"
                    value={awayData.avgTotal || '0.0'}
                    subtitle={`${awayData.avgFor || '0.0'} a favor • ${awayData.avgAgainst || '0.0'} contra`}
                    icon={FaChartLine}
                    color="secondary"
                />
                <StatCard
                    title="Over 8.5 Cantos - Casa"
                    value={`${homeData.trends?.over85 || '0'}%`}
                    subtitle="Probabilidade histórica"
                    icon={FaFlag}
                    color={parseInt(homeData.trends?.over85 || '0') >= 70 ? 'success' : 'warning'}
                />
                <StatCard
                    title="Over 8.5 Cantos - Fora"
                    value={`${awayData.trends?.over85 || '0'}%`}
                    subtitle="Probabilidade histórica"
                    icon={FaFlag}
                    color={parseInt(awayData.trends?.over85 || '0') >= 70 ? 'success' : 'warning'}
                />
            </div>

            {/* Corner Races */}
            {homeData.races && awayData.races && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaFlag className={styles.icon} />
                        Corridas de Cantos
                    </h3>
                    <RaceChart
                        homeRaces={homeData.races}
                        awayRaces={awayData.races}
                        homeTeam={homeTeam || 'Casa'}
                        awayTeam={awayTeam || 'Fora'}
                    />
                </div>
            )}

            {/* Corner Intervals Heatmap */}
            {homeData.intervals && awayData.intervals && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaClock className={styles.icon} />
                        Intervalos de Tempo
                    </h3>
                    <CornerIntervalsHeatmap
                        homeIntervals={homeData.intervals}
                        awayIntervals={awayData.intervals}
                        homeTeam={homeTeam || 'Casa'}
                        awayTeam={awayTeam || 'Fora'}
                    />
                </div>
            )}
        </div>
    );
}
