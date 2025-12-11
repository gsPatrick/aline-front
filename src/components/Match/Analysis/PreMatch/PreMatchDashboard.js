'use client';
import { useState, useEffect } from 'react';
import styles from './PreMatchDashboard.module.css';
import StandingsTab from '../Tabs/StandingsTab/StandingsTab';
import LineupsTab from '../LineupsTab';

// Sub-componente de Contador
const Countdown = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                // Time is up
                setTimeLeft(null); // Set to null to indicate finished
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                d: Math.floor(distance / (1000 * 60 * 60 * 24)),
                h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (!timeLeft) {
        return (
            <div className={styles.timerContainer}>
                <div className={styles.timerMessage} style={{ color: '#aaa', fontSize: '1.2rem', padding: '20px' }}>
                    Jogo em Curso / Aguardando Atualização...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.timerContainer}>
            <div className={styles.timerBlock}>
                <span className={styles.timerVal}>{String(timeLeft.d).padStart(2, '0')}</span>
                <span className={styles.timerLabel}>DIAS</span>
            </div>
            <div className={styles.timerBlock}>
                <span className={styles.timerVal}>{String(timeLeft.h).padStart(2, '0')}</span>
                <span className={styles.timerLabel}>HORAS</span>
            </div>
            <div className={styles.timerBlock}>
                <span className={styles.timerVal}>{String(timeLeft.m).padStart(2, '0')}</span>
                <span className={styles.timerLabel}>MINUTOS</span>
            </div>
            <div className={styles.timerBlock}>
                <span className={styles.timerVal}>{String(timeLeft.s).padStart(2, '0')}</span>
                <span className={styles.timerLabel}>SEGUNDOS</span>
            </div>
        </div>
    );
};

export default function PreMatchDashboard({ match }) {
    const [activeSubTab, setActiveSubTab] = useState('onzes');

    return (
        <div className={styles.container}>
            {/* 1. SEÇÃO DE CONTAGEM REGRESSIVA */}
            <div className={styles.heroSection}>
                <h3 className={styles.heroTitle}>Jogo a Iniciar em</h3>
                <Countdown targetDate={match.matchInfo.starting_at || match.matchInfo.date} />
            </div>

            {/* 2. SUB-NAVEGAÇÃO PRÉ-JOGO */}
            <div className={styles.navSection}>
                <div className={styles.navTabs}>
                    <button
                        className={`${styles.navBtn} ${activeSubTab === 'onzes' ? styles.active : ''}`}
                        onClick={() => setActiveSubTab('onzes')}
                    >
                        Onzes Possíveis
                    </button>
                    <button
                        className={`${styles.navBtn} ${activeSubTab === 'tabela' ? styles.active : ''}`}
                        onClick={() => setActiveSubTab('tabela')}
                    >
                        Tabela Classificativa
                    </button>
                    <button
                        className={`${styles.navBtn} ${activeSubTab === 'odds' ? styles.active : ''}`}
                        onClick={() => setActiveSubTab('odds')}
                    >
                        Odds
                    </button>
                </div>
            </div>

            {/* 3. CONTEÚDO DAS SUB-ABAS */}
            <div className={styles.contentSection}>
                {activeSubTab === 'onzes' && (
                    <LineupsTab match={match} />
                )}

                {activeSubTab === 'tabela' && (
                    <StandingsTab
                        standings={match.analysis?.standings}
                        homeId={match.homeTeam?.id}
                        awayId={match.awayTeam?.id}
                    />
                )}

                {activeSubTab === 'odds' && (
                    <div className={styles.placeholder}>
                        Comparador de Odds Completo em Breve
                    </div>
                )}
            </div>
        </div>
    );
}