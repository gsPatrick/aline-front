'use client';
import { useState } from 'react';
import StatRow from './StatRow';
import PressureGraph from '../../../../shared/PressureGraph';
import AttackHeatmap from '../../../../shared/AttackHeatmap';
import TimeFilter from '../../../../shared/TimeFilter';
import styles from './MatchStatsView.module.css';

export default function MatchStatsView({ homeTeam, awayTeam, statsData, charts, events }) {
    const [activeTab, setActiveTab] = useState('fulltime'); // fulltime, ht, st
    const [maxMinute, setMaxMinute] = useState(90);

    // Handler to change period (used by both TimeFilter and Stats tabs)
    const handlePeriodChange = (period) => {
        setActiveTab(period);
        if (period === 'ht') {
            setMaxMinute(45);
        } else if (period === 'st') {
            setMaxMinute(90);
        } else {
            setMaxMinute(90);
        }
    };

    // Se não houver dados, usa um objeto vazio para não quebrar
    const currentStats = statsData?.[activeTab] || null;

    // Calculate attack zones from stats (heuristic based on attacks and corners)
    const calculateZones = (stats, isHome) => {
        // Get dangerous attacks and corners which now vary by period
        const attacks = isHome ?
            (stats?.attacks?.dangerous?.home || 0) :
            (stats?.attacks?.dangerous?.away || 0);
        const corners = isHome ?
            (stats?.attacks?.corners?.home || 0) :
            (stats?.attacks?.corners?.away || 0);
        const shots = isHome ?
            (stats?.shots?.total?.home || 0) :
            (stats?.shots?.total?.away || 0);

        // Use a combination of metrics to estimate zone distribution
        // More corners = more wing play (top/bottom), more shots = central presence (middle)
        const total = attacks + corners + shots || 1;

        // Calculate zone weights
        const cornerWeight = corners / total;
        const shotWeight = shots / total;

        // Top zone: influenced by corners (wing play)
        const top = Math.min(45, Math.max(25, Math.round(30 + cornerWeight * 20)));
        // Middle zone: influenced by shots (central attacks)
        const middle = Math.min(50, Math.max(30, Math.round(35 + shotWeight * 15)));
        // Bottom zone: remainder to make 100%
        const bottom = 100 - top - middle;

        return { top, middle, bottom };
    };

    // Calculate attack presence percentage
    const calculatePresence = (stats, isHome) => {
        const homeDangerousAttacks = stats?.attacks?.dangerous?.home || 0;
        const awayDangerousAttacks = stats?.attacks?.dangerous?.away || 0;
        const total = homeDangerousAttacks + awayDangerousAttacks;

        if (total === 0) return 50;

        if (isHome) {
            return Math.round((homeDangerousAttacks / total) * 100);
        }
        return Math.round((awayDangerousAttacks / total) * 100);
    };

    const homeZones = calculateZones(currentStats, true);
    const awayZones = calculateZones(currentStats, false);
    const homePresence = calculatePresence(currentStats, true);
    const awayPresence = calculatePresence(currentStats, false);

    if (!currentStats) return <div style={{ padding: '20px', color: '#fff' }}>Dados de estatísticas indisponíveis.</div>;

    return (
        <div className={styles.bigCard}>
            {/* NEW: Time Filter - controls all period-based components */}
            <TimeFilter
                period={activeTab}
                onPeriodChange={handlePeriodChange}
                maxMinute={maxMinute}
                onMaxMinuteChange={setMaxMinute}
            />

            {/* NEW: Pressure Graph Section */}
            <PressureGraph
                timeline={charts?.timeline || []}
                events={events || []}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                period={activeTab}
                maxMinute={maxMinute}
            />

            {/* NEW: Attack Heatmaps */}
            <AttackHeatmap
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                homeZones={homeZones}
                awayZones={awayZones}
                homeAttackPresence={homePresence}
                awayAttackPresence={awayPresence}
                period={activeTab}
            />

            {/* Header com Abas e Times */}
            <div className={styles.header}>
                <div className={styles.tabsContainer}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'fulltime' ? styles.active : ''}`}
                        onClick={() => handlePeriodChange('fulltime')}
                    >
                        Fim do Jogo
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'ht' ? styles.active : ''}`}
                        onClick={() => handlePeriodChange('ht')}
                    >
                        1ª Parte
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'st' ? styles.active : ''}`}
                        onClick={() => handlePeriodChange('st')}
                    >
                        2ª Parte
                    </button>
                </div>

                <div className={styles.teamsHeader}>
                    <div className={styles.teamInfoLeft}>
                        {homeTeam?.logo && <img src={homeTeam.logo} alt="Home" />}
                        <span className={styles.teamName}>{homeTeam?.name || 'Casa'}</span>
                    </div>
                    <div className={styles.teamInfoRight}>
                        <span className={styles.teamName}>{awayTeam?.name || 'Fora'}</span>
                        {awayTeam?.logo && <img src={awayTeam.logo} alt="Away" />}
                    </div>
                </div>
            </div>

            {/* SEÇÃO 1: POSSE DE BOLA */}
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Posse de Bola</h4>
                <div className={styles.statsGroup}>
                    <StatRow
                        label="Posse de Bola"
                        homeValue={currentStats.possession?.home}
                        awayValue={currentStats.possession?.away}
                        type="percent"
                    />
                </div>
            </div>

            {/* SEÇÃO 2: ATAQUES */}
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Ataques</h4>
                <div className={styles.statsGroup}>
                    <StatRow label="Ataques" homeValue={currentStats.attacks?.total?.home} awayValue={currentStats.attacks?.total?.away} />
                    <StatRow label="Ataques Perigosos" homeValue={currentStats.attacks?.dangerous?.home} awayValue={currentStats.attacks?.dangerous?.away} />
                    <StatRow label="Cantos" homeValue={currentStats.attacks?.corners?.home} awayValue={currentStats.attacks?.corners?.away} />
                    <StatRow label="Cruzamentos" homeValue={currentStats.attacks?.crosses?.home} awayValue={currentStats.attacks?.crosses?.away} />
                </div>
            </div>

            {/* SEÇÃO 3: REMATES TOTAIS */}
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Remates Totais</h4>
                <div className={styles.statsGroup}>
                    <StatRow label="Remates Totais" homeValue={currentStats.shots?.total?.home} awayValue={currentStats.shots?.total?.away} />
                    <StatRow label="Remates à Baliza" homeValue={currentStats.shots?.onTarget?.home} awayValue={currentStats.shots?.onTarget?.away} />
                    <StatRow label="Remates Falhados" homeValue={currentStats.shots?.offTarget?.home} awayValue={currentStats.shots?.offTarget?.away} />
                    <StatRow label="R. Dentro Área" homeValue={currentStats.shots?.insideBox?.home} awayValue={currentStats.shots?.insideBox?.away} />
                    <StatRow label="R. Fora Área" homeValue={currentStats.shots?.outsideBox?.home} awayValue={currentStats.shots?.outsideBox?.away} />
                </div>
            </div>

            {/* SEÇÃO 4: OUTRAS ESTATÍSTICAS */}
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Outras Estatísticas</h4>
                <div className={styles.statsGroup}>
                    <StatRow label="Defesas" homeValue={currentStats.others?.saves?.home} awayValue={currentStats.others?.saves?.away} />
                    <StatRow label="Faltas" homeValue={currentStats.others?.fouls?.home} awayValue={currentStats.others?.fouls?.away} />
                    <StatRow label="Pontapé Livre" homeValue={currentStats.others?.freeKicks?.home} awayValue={currentStats.others?.freeKicks?.away} />
                    <StatRow label="Cartões Amarelos" homeValue={currentStats.others?.yellowCards?.home} awayValue={currentStats.others?.yellowCards?.away} />
                    <StatRow label="Cartões Vermelhos" homeValue={currentStats.others?.redCards?.home} awayValue={currentStats.others?.redCards?.away} />
                    <StatRow label="Passes com sucesso" homeValue={currentStats.others?.passes?.home} awayValue={currentStats.others?.passes?.away} />
                    <StatRow label="Passes Longos" homeValue={currentStats.others?.longPasses?.home} awayValue={currentStats.others?.longPasses?.away} />
                    <StatRow label="Interceções" homeValue={currentStats.others?.interceptions?.home} awayValue={currentStats.others?.interceptions?.away} />
                </div>
            </div>
        </div>
    );
}