'use client';
import { FaFlag, FaFutbol } from 'react-icons/fa';
import styles from './LiveDashboard.module.css';

// Componente da Barra de Pressão
const PressureBar = ({ val, type }) => {
    // Normaliza o valor para uma altura visual (max 40px)
    const height = Math.min(Math.abs(val) * 2, 40);
    const color = type === 'home' ? '#00ff88' : '#ff3366'; // Verde (Casa) vs Vermelho (Fora)

    // Se o valor for 0, mostra uma linha mínima
    if (Math.abs(val) < 1) {
        return <div className={styles.barWrapper}><div className={styles.barZero}></div></div>;
    }

    return (
        <div className={styles.barWrapper}>
            <div
                className={styles.bar}
                style={{
                    height: `${height}px`,
                    backgroundColor: color,
                    // Se for casa (positivo), cresce pra cima (margin-bottom). Se fora, pra baixo (margin-top).
                    marginBottom: type === 'home' ? '0' : 'auto',
                    marginTop: type === 'away' ? '0' : 'auto',
                    alignSelf: type === 'home' ? 'flex-end' : 'flex-start'
                }}
            />
        </div>
    );
};

export default function LiveDashboard({ match }) {
    if (!match) return null;

    // 1. Extração Segura dos Dados do Backend
    const charts = match.chartsAnalysis || {};

    // Gráfico de Pressão (Array de 90+ minutos)
    const pressureData = charts.pressure || Array(90).fill(0);

    // Zonas de Ação (Heurística do Backend)
    const zones = charts.attackZones || {
        home: { defense: 0, middle: 0, attack: 0 },
        away: { defense: 0, middle: 0, attack: 0 }
    };

    // Presença na área de ataque (Cálculo simples ou dado direto)
    // Se não tiver, usamos a % de ataque da zona
    const homeAttackPresence = zones.home.attack || 0;
    const awayAttackPresence = zones.away.attack || 0;

    return (
        <div className={styles.container}>

            {/* 1. GRÁFICO DE PRESSÃO (MOMENTUM) */}
            <div className={styles.section}>
                <h3 className={styles.title}>Gráfico de Pressão</h3>
                <div className={styles.graphContainer}>
                    <div className={styles.graphTimeline}>
                        {/* Linha Central (Eixo 0) */}
                        <div className={styles.centerLine}></div>

                        {/* Barras */}
                        <div className={styles.barsContainer}>
                            {pressureData.map((dataPoint, i) => {
                                // O Backend pode retornar objeto {minute, value} ou apenas o valor numérico
                                const val = typeof dataPoint === 'object' ? dataPoint.value : dataPoint;
                                const type = val >= 0 ? 'home' : 'away';
                                return <PressureBar key={i} val={val} type={type} />;
                            })}
                        </div>

                        {/* Marcadores de Tempo */}
                        <div className={styles.timeMarkers}>
                            <span>0'</span>
                            <span>15'</span>
                            <span>30'</span>
                            <span>45'</span>
                            <span>60'</span>
                            <span>75'</span>
                            <span>90'</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ZONAS DE AÇÃO (CAMPO VISUAL) */}
            <div className={styles.section}>
                <div className={styles.pitchHeader}>
                    <div className={styles.teamSide}>
                        {match.homeTeam?.logo && <img src={match.homeTeam.logo} width={24} alt="H" />}
                        <span>{match.homeTeam?.name}</span>
                        <span className={styles.attackBadge} style={{ background: '#00ff88', color: '#000' }}>
                            {homeAttackPresence}%
                        </span>
                    </div>
                    <div className={styles.teamSide} style={{ justifyContent: 'flex-end' }}>
                        <span className={styles.attackBadge} style={{ background: '#ff3366' }}>
                            {awayAttackPresence}%
                        </span>
                        <span>{match.awayTeam?.name}</span>
                        {match.awayTeam?.logo && <img src={match.awayTeam.logo} width={24} alt="A" />}
                    </div>
                </div>

                <div className={styles.pitchContainer}>
                    {/* --- CAMPO CASA (ESQUERDA) --- */}
                    <div className={styles.halfPitch}>
                        <div className={styles.pitchBgLeft}></div>
                        <div className={styles.overlayData}>
                            {/* Defesa (Esq), Meio, Ataque (Dir) */}
                            <div className={styles.zoneVal}>
                                {zones.home.defense}% <span className={styles.arrow}>→</span>
                            </div>
                            <div className={styles.zoneVal}>
                                {zones.home.middle}% <span className={styles.arrow}>→</span>
                            </div>
                            <div className={styles.zoneVal}>
                                {zones.home.attack}% <span className={styles.arrow}>→</span>
                            </div>
                        </div>
                    </div>

                    {/* Divisor Central */}
                    <div className={styles.pitchDivider}></div>

                    {/* --- CAMPO FORA (DIREITA) --- */}
                    <div className={styles.halfPitch}>
                        <div className={styles.pitchBgRight}></div>
                        <div className={styles.overlayData}>
                            {/* A lógica inverte visualmente: Ataque (Esq), Meio, Defesa (Dir) do ponto de vista da tela */}
                            {/* Mas taticamente, o ataque do Away é na esquerda do campo dele (invadindo o Home) */}
                            <div className={styles.zoneVal}>
                                <span className={styles.arrow}>←</span> {zones.away.attack}%
                            </div>
                            <div className={styles.zoneVal}>
                                <span className={styles.arrow}>←</span> {zones.away.middle}%
                            </div>
                            <div className={styles.zoneVal}>
                                <span className={styles.arrow}>←</span> {zones.away.defense}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}