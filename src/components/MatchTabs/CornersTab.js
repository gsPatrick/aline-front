'use client';
import TimelineGraph from '../shared/TimelineGraph';
import HeatmapTable from '../shared/HeatmapTable';
import MarketsTable from '../shared/MarketsTable';
import { FaFlag, FaChartArea } from 'react-icons/fa';
import styles from './CornersTab.module.css';

export default function CornersTab({ data, chartsData, filterCondition, isLive, currentMinute }) {
    if (!data) {
        return <div className={styles.emptyState}>Dados de cantos não disponíveis</div>;
    }

    const { races, intervals, markets, pressureTimeline } = data;

    return (
        <div className={styles.container}>
            {/* Pressure Timeline Graph */}
            {(pressureTimeline || chartsData?.pressureIndex) && (
                <div className={styles.section}>
                    <TimelineGraph
                        data={pressureTimeline || chartsData?.pressureIndex || []}
                        homeKey="home"
                        awayKey="away"
                        xAxisKey="minute"
                        currentMinute={currentMinute}
                        isLive={isLive}
                        title="Gráfico de Pressão (Timeline)"
                    />
                </div>
            )}

            {/* Races */}
            {races && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaFlag className={styles.icon} />
                        Corridas de Cantos
                    </h3>
                    {races.available ? (
                        <div className={styles.racesGrid}>
                            {Object.entries(races.data || {}).map(([key, value]) => (
                                <div key={key} className={styles.raceCard}>
                                    <div className={styles.raceLabel}>Primeiro a {key}</div>
                                    <div className={styles.raceValue}>
                                        {value || 'Não atingido'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noData}>
                            Sem dados para esta liga
                        </div>
                    )}
                </div>
            )}

            {/* Intervals Heatmap */}
            {intervals && (
                <div className={styles.section}>
                    <HeatmapTable
                        intervals={intervals}
                        title="Intervalos de Cantos"
                        type="corners"
                    />
                </div>
            )}

            {/* Markets */}
            {markets && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <FaChartArea className={styles.icon} />
                        Mercados de Cantos
                    </h3>
                    <MarketsTable
                        markets={markets}
                        type="corners"
                    />
                </div>
            )}
        </div>
    );
}
