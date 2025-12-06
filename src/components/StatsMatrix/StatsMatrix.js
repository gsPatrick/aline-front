'use client';
import styles from './StatsMatrix.module.css';

export default function StatsMatrix({ homeTeam, awayTeam, stats }) {
    if (!stats) return null;

    const hStats = stats.home || {};
    const aStats = stats.away || {};

    // Dados Mockados para Heatmap (já que a API v3 é complexa nisso, vamos simular visualmente)
    // Na implementação real, você mapearia os dados de 'scoring_minutes'
    const intervals = ['0-15', '16-30', '31-HT', '46-60', '61-75', '76-FT'];

    // Função para gerar cor baseada em valor (0-100)
    const getHeatmapColor = (value) => {
        // Gradiente de Vermelho (baixo) para Verde (alto) ou apenas opacidade de vermelho como pedido
        // Pedido: "opacidade de vermelho baseada na porcentagem"
        return `rgba(214, 48, 49, ${value / 100})`; // Vermelho com opacidade
    };

    return (
        <div className={styles.matrixContainer}>
            <h3 className={styles.title}>Análise Detalhada</h3>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left' }}>Equipa</th>
                        <th>Média Gols</th>
                        <th>Sofridos</th>
                        <th>BTTS %</th>
                        <th>Clean Sheets</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={styles.teamName}>
                            {homeTeam.logo && <img src={homeTeam.logo} alt="" className={styles.logo} />}
                            {homeTeam.name}
                        </td>
                        <td>{hStats.goals_scored || '-'}</td>
                        <td>{hStats.goals_conceded || '-'}</td>
                        <td>{hStats.btts_percentage || '-'}</td>
                        <td>{hStats.clean_sheets_percentage || '-'}</td>
                    </tr>
                    <tr>
                        <td className={styles.teamName}>
                            {awayTeam.logo && <img src={awayTeam.logo} alt="" className={styles.logo} />}
                            {awayTeam.name}
                        </td>
                        <td>{aStats.goals_scored || '-'}</td>
                        <td>{aStats.goals_conceded || '-'}</td>
                        <td>{aStats.btts_percentage || '-'}</td>
                        <td>{aStats.clean_sheets_percentage || '-'}</td>
                    </tr>
                </tbody>
            </table>

            <h4 className={styles.title}>Golos Por Intervalo (Heatmap)</h4>
            <div className={styles.heatmapGrid}>
                {intervals.map((interval, idx) => {
                    // Mock random value
                    const val = Math.floor(Math.random() * 60) + 10;
                    return (
                        <div
                            key={idx}
                            className={styles.heatmapCell}
                            style={{ backgroundColor: getHeatmapColor(val) }}
                        >
                            <span className={styles.intervalLabel}>{interval}</span>
                            <span className={styles.heatmapValue}>{val}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
