'use client';
import { useState } from 'react';
import StatRow from './StatRow';
import styles from './MatchStatsView.module.css';

export default function MatchStatsView({ homeTeam, awayTeam, statsData }) {
    const [activeTab, setActiveTab] = useState('fulltime'); // fulltime, ht, st

    // Se não houver dados, usa um objeto vazio para não quebrar
    const currentStats = statsData?.[activeTab] || null;

    if (!currentStats) return <div style={{ padding: '20px', color: '#fff' }}>Dados de estatísticas indisponíveis.</div>;

    return (
        <div className={styles.bigCard}>
            {/* Header com Abas e Times */}
            <div className={styles.header}>
                <div className={styles.tabsContainer}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'fulltime' ? styles.active : ''}`}
                        onClick={() => setActiveTab('fulltime')}
                    >
                        Fim do Jogo
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'ht' ? styles.active : ''}`}
                        onClick={() => setActiveTab('ht')}
                    >
                        1ª Parte
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'st' ? styles.active : ''}`}
                        onClick={() => setActiveTab('st')}
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