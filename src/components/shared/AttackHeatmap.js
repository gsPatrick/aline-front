'use client';
import { useMemo } from 'react';
import styles from './AttackHeatmap.module.css';

export default function AttackHeatmap({
    homeTeam,
    awayTeam,
    homeZones = { top: 34, middle: 40, bottom: 26 },
    awayZones = { top: 24, middle: 37, bottom: 39 },
    homeAttackPresence = 57,
    awayAttackPresence = 43,
    period = 'fulltime'
}) {
    // Generate heat dots based on zones
    const generateHeatDots = useMemo(() => {
        return (zones, isHome) => {
            const dots = [];
            const totalDots = 50;

            // Distribution based on zone percentages
            const topDots = Math.round((zones.top / 100) * totalDots);
            const middleDots = Math.round((zones.middle / 100) * totalDots);
            const bottomDots = Math.round((zones.bottom / 100) * totalDots);

            // For home team, attack area is RIGHT side of field
            // For away team, attack area is LEFT side of field (mirrored)
            const attackSideX = isHome ? [55, 95] : [5, 45];
            const defendSideX = isHome ? [5, 45] : [55, 95];

            // Generate attack area dots (more concentrated)
            for (let i = 0; i < Math.round(topDots * 0.7); i++) {
                dots.push({
                    id: `atk-top-${i}`,
                    x: attackSideX[0] + Math.random() * (attackSideX[1] - attackSideX[0]),
                    y: 5 + Math.random() * 28,
                    intensity: 0.6 + Math.random() * 0.4
                });
            }

            for (let i = 0; i < Math.round(middleDots * 0.7); i++) {
                dots.push({
                    id: `atk-mid-${i}`,
                    x: attackSideX[0] + Math.random() * (attackSideX[1] - attackSideX[0]),
                    y: 35 + Math.random() * 30,
                    intensity: 0.7 + Math.random() * 0.3
                });
            }

            for (let i = 0; i < Math.round(bottomDots * 0.7); i++) {
                dots.push({
                    id: `atk-bot-${i}`,
                    x: attackSideX[0] + Math.random() * (attackSideX[1] - attackSideX[0]),
                    y: 67 + Math.random() * 28,
                    intensity: 0.5 + Math.random() * 0.5
                });
            }

            // Generate some midfield dots
            for (let i = 0; i < 10; i++) {
                dots.push({
                    id: `mid-${i}`,
                    x: 40 + Math.random() * 20,
                    y: 10 + Math.random() * 80,
                    intensity: 0.3 + Math.random() * 0.4
                });
            }

            // Generate some defense area dots (less concentrated)
            for (let i = 0; i < 8; i++) {
                dots.push({
                    id: `def-${i}`,
                    x: defendSideX[0] + Math.random() * (defendSideX[1] - defendSideX[0]),
                    y: 10 + Math.random() * 80,
                    intensity: 0.2 + Math.random() * 0.3
                });
            }

            return dots;
        };
    }, []);

    const homeHeatDots = generateHeatDots(homeZones, true);
    const awayHeatDots = generateHeatDots(awayZones, false);

    return (
        <div className={styles.container}>
            <div className={styles.fieldsWrapper}>
                {/* Home Team Field */}
                <div className={styles.fieldCard}>
                    <div className={styles.fieldHeader}>
                        <div className={styles.teamInfo}>
                            {homeTeam?.logo && (
                                <img src={homeTeam.logo} alt={homeTeam.name} className={styles.teamLogo} />
                            )}
                            <span className={styles.teamName}>{homeTeam?.name || 'Casa'}</span>
                        </div>
                        <div className={styles.presenceBadge}>
                            <span className={styles.presenceLabel}>Presença na área de ataque</span>
                            <span className={styles.presenceValue}>{homeAttackPresence}%</span>
                        </div>
                    </div>

                    <div className={styles.field}>
                        {/* Horizontal Field SVG */}
                        <svg className={styles.fieldSvg} viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet">
                            {/* Field outline */}
                            <rect x="5" y="5" width="390" height="250" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                            {/* Center line */}
                            <line x1="200" y1="5" x2="200" y2="255" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            {/* Center circle */}
                            <circle cx="200" cy="130" r="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            {/* Left penalty area */}
                            <rect x="5" y="65" width="60" height="130" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <rect x="5" y="95" width="25" height="70" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            {/* Right penalty area */}
                            <rect x="335" y="65" width="60" height="130" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <rect x="370" y="95" width="25" height="70" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            {/* Corner arcs */}
                            <path d="M 5 15 Q 15 5, 25 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <path d="M 375 5 Q 395 5, 395 25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <path d="M 5 245 Q 5 255, 25 255" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <path d="M 375 255 Q 395 255, 395 235" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                        </svg>

                        {/* Zone percentages - LEFT side for home team */}
                        <div className={styles.zonesOverlayHome}>
                            <div className={styles.zoneLabel}>
                                <span>{homeZones.top}%</span>
                                <span className={styles.arrow}>→</span>
                            </div>
                            <div className={styles.zoneLabel}>
                                <span>{homeZones.middle}%</span>
                                <span className={styles.arrow}>→</span>
                            </div>
                            <div className={styles.zoneLabel}>
                                <span>{homeZones.bottom}%</span>
                                <span className={styles.arrow}>→</span>
                            </div>
                        </div>

                        {/* Heatmap overlay */}
                        <div className={styles.heatmapOverlay}>
                            {homeHeatDots.map(dot => (
                                <div
                                    key={dot.id}
                                    className={styles.heatDot}
                                    style={{
                                        left: `${dot.x}%`,
                                        top: `${dot.y}%`,
                                        opacity: dot.intensity,
                                        transform: `translate(-50%, -50%) scale(${0.8 + dot.intensity * 0.6})`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Away Team Field */}
                <div className={styles.fieldCard}>
                    <div className={styles.fieldHeader}>
                        <div className={styles.teamInfo}>
                            {awayTeam?.logo && (
                                <img src={awayTeam.logo} alt={awayTeam.name} className={styles.teamLogo} />
                            )}
                            <span className={styles.teamName}>{awayTeam?.name || 'Fora'}</span>
                        </div>
                        <div className={styles.presenceBadge}>
                            <span className={styles.presenceLabel}>Presença na área de ataque</span>
                            <span className={styles.presenceValue}>{awayAttackPresence}%</span>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <svg className={styles.fieldSvg} viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet">
                            <rect x="5" y="5" width="390" height="250" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                            <line x1="200" y1="5" x2="200" y2="255" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <circle cx="200" cy="130" r="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <rect x="5" y="65" width="60" height="130" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <rect x="5" y="95" width="25" height="70" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <rect x="335" y="65" width="60" height="130" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <rect x="370" y="95" width="25" height="70" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <path d="M 5 15 Q 15 5, 25 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <path d="M 375 5 Q 395 5, 395 25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <path d="M 5 245 Q 5 255, 25 255" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <path d="M 375 255 Q 395 255, 395 235" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                        </svg>

                        {/* Zone percentages - RIGHT side for away team */}
                        <div className={styles.zonesOverlayAway}>
                            <div className={styles.zoneLabel}>
                                <span className={styles.arrow}>←</span>
                                <span>{awayZones.top}%</span>
                            </div>
                            <div className={styles.zoneLabel}>
                                <span className={styles.arrow}>←</span>
                                <span>{awayZones.middle}%</span>
                            </div>
                            <div className={styles.zoneLabel}>
                                <span className={styles.arrow}>←</span>
                                <span>{awayZones.bottom}%</span>
                            </div>
                        </div>

                        <div className={styles.heatmapOverlay}>
                            {awayHeatDots.map(dot => (
                                <div
                                    key={dot.id}
                                    className={styles.heatDot}
                                    style={{
                                        left: `${dot.x}%`,
                                        top: `${dot.y}%`,
                                        opacity: dot.intensity,
                                        transform: `translate(-50%, -50%) scale(${0.8 + dot.intensity * 0.6})`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
