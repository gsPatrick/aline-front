'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './TimelineGraph.module.css';

export default function TimelineGraph({
    data = [],
    homeKey = 'home',
    awayKey = 'away',
    xAxisKey = 'minute',
    currentMinute = 90,
    isLive = false,
    title = 'Timeline'
}) {
    if (!data || data.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>Sem dados disponíveis para o gráfico</p>
            </div>
        );
    }

    // Filter data up to current minute if live
    const filteredData = isLive
        ? data.filter(item => item[xAxisKey] <= currentMinute)
        : data;

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>{title}</h4>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey={xAxisKey}
                        stroke="#a0a0a0"
                        tick={{ fill: '#a0a0a0' }}
                        label={{ value: 'Minutos', position: 'insideBottom', offset: -5, fill: '#a0a0a0' }}
                    />
                    <YAxis
                        stroke="#a0a0a0"
                        tick={{ fill: '#a0a0a0' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#2a2a2a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#e0e0e0'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ color: '#e0e0e0' }}
                    />
                    <Line
                        type="monotone"
                        dataKey={homeKey}
                        stroke="#00ff88"
                        strokeWidth={2}
                        dot={{ fill: '#00ff88', r: 3 }}
                        activeDot={{ r: 5 }}
                        name="Casa"
                    />
                    <Line
                        type="monotone"
                        dataKey={awayKey}
                        stroke="#00d4ff"
                        strokeWidth={2}
                        dot={{ fill: '#00d4ff', r: 3 }}
                        activeDot={{ r: 5 }}
                        name="Fora"
                    />
                </LineChart>
            </ResponsiveContainer>
            {isLive && (
                <div className={styles.liveIndicator}>
                    <span className={styles.liveDot} />
                    Atualização ao vivo - Minuto {currentMinute}
                </div>
            )}
        </div>
    );
}
