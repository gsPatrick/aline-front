'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartBar, FaClock } from 'react-icons/fa';
import styles from './ChartsTab.module.css';

export default function ChartsTab({ generalStatsAnalysis, matchState }) {
    if (!generalStatsAnalysis) {
        return <div className={styles.emptyState}>Dados de gráficos não disponíveis</div>;
    }

    // Show placeholder for NS (Not Started) matches
    if (matchState === 'NS') {
        return (
            <div className={styles.placeholder}>
                <FaClock className={styles.placeholderIcon} />
                <h3>Gráfico disponível após o início da partida</h3>
                <p>Os dados estatísticos serão exibidos quando o jogo começar</p>
            </div>
        );
    }

    const { home, away } = generalStatsAnalysis;

    const charts = [
        {
            title: 'Ataques Perigosos',
            data: [
                { team: 'Casa', value: home?.shots?.total || 0 },
                { team: 'Fora', value: away?.shots?.total || 0 }
            ],
            color: '#ff3333'
        },
        {
            title: 'Remates à Baliza',
            data: [
                { team: 'Casa', value: home?.shots?.onGoal || 0 },
                { team: 'Fora', value: away?.shots?.onGoal || 0 }
            ],
            color: '#00ff88'
        },
        {
            title: 'Remates Fora',
            data: [
                { team: 'Casa', value: home?.shots?.offGoal || 0 },
                { team: 'Fora', value: away?.shots?.offGoal || 0 }
            ],
            color: '#ffd700'
        },
        {
            title: 'Posse de Bola (%)',
            data: [
                { team: 'Casa', value: home?.control?.possession || 0 },
                { team: 'Fora', value: away?.control?.possession || 0 }
            ],
            color: '#00d4ff'
        }
    ];

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
                            <BarChart data={chart.data}>
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
