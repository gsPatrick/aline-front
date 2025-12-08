'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartBar } from 'react-icons/fa';
import styles from './ChartsTab.module.css';

export default function ChartsTab({ data }) {
    if (!data) {
        return <div className={styles.emptyState}>Dados de gráficos não disponíveis</div>;
    }

    const { dangerousAttacks, shotsOnTarget, shotsOffTarget, possession } = data;

    const charts = [
        {
            title: 'Ataques Perigosos',
            data: dangerousAttacks,
            color: '#ff3333'
        },
        {
            title: 'Remates à Baliza',
            data: shotsOnTarget,
            color: '#00ff88'
        },
        {
            title: 'Remates Fora',
            data: shotsOffTarget,
            color: '#ffd700'
        },
        {
            title: 'Posse de Bola (%)',
            data: possession,
            color: '#00d4ff'
        }
    ];

    const prepareChartData = (chartData) => {
        if (!chartData) return [];
        return [
            { team: 'Casa', value: chartData.home || 0 },
            { team: 'Fora', value: chartData.away || 0 }
        ];
    };

    return (
        <div className={styles.container}>
            <div className={styles.chartsGrid}>
                {charts.map((chart, idx) => (
                    <div key={idx} className={styles.chartSection}>
                        <h3 className={styles.chartTitle}>
                            <FaChartBar className={styles.icon} />
                            {chart.title}
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={prepareChartData(chart.data)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="team"
                                    stroke="#a0a0a0"
                                    tick={{ fill: '#a0a0a0' }}
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
                                <Bar dataKey="value" fill={chart.color} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>
        </div>
    );
}
