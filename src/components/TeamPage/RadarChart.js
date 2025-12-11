'use client';
import { useRef, useEffect } from 'react';
import styles from './RadarChart.module.css';

export default function RadarChart({ data, size = 200 }) {
    const canvasRef = useRef(null);

    // Default data structure
    const defaultData = {
        fisicalidade: 0,
        defesa: 0,
        pressao: 0,
        finalizacao: 0,
        ataque: 0,
        posse: 0,
        contraAtaque: 0
    };

    const chartData = { ...defaultData, ...data };

    const labels = [
        { key: 'fisicalidade', label: 'Fisicalidade' },
        { key: 'defesa', label: 'Defesa' },
        { key: 'pressao', label: 'Pressão' },
        { key: 'finalizacao', label: 'Finalização' },
        { key: 'ataque', label: 'Ataque' },
        { key: 'posse', label: 'Posse' },
        { key: 'contraAtaque', label: 'Contra-ataque' }
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = size / 2;
        const centerY = size / 2;
        const maxRadius = size * 0.35;
        const numAxes = labels.length;
        const angleStep = (2 * Math.PI) / numAxes;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Draw background rings
        const rings = 5;
        for (let i = rings; i >= 1; i--) {
            const ringRadius = (maxRadius * i) / rings;
            ctx.beginPath();
            for (let j = 0; j <= numAxes; j++) {
                const angle = j * angleStep - Math.PI / 2;
                const x = centerX + ringRadius * Math.cos(angle);
                const y = centerY + ringRadius * Math.sin(angle);
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(42, 52, 65, 0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw axes
        labels.forEach((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + maxRadius * Math.cos(angle);
            const y = centerY + maxRadius * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(42, 52, 65, 0.8)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Draw data polygon
        ctx.beginPath();
        labels.forEach((item, i) => {
            const value = Math.min(100, Math.max(0, chartData[item.key] || 0));
            const radius = (value / 100) * maxRadius;
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();

        // Fill data area
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Stroke data polygon
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw data points
        labels.forEach((item, i) => {
            const value = Math.min(100, Math.max(0, chartData[item.key] || 0));
            const radius = (value / 100) * maxRadius;
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#00d4ff';
            ctx.fill();
            ctx.strokeStyle = '#0f1419';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

    }, [chartData, size, labels]);

    return (
        <div className={styles.container} style={{ width: size, height: size }}>
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                className={styles.canvas}
            />

            {/* Labels positioned around the chart */}
            <div className={styles.labels}>
                {labels.map((item, i) => {
                    const numAxes = labels.length;
                    const angleStep = (2 * Math.PI) / numAxes;
                    const angle = i * angleStep - Math.PI / 2;
                    const labelRadius = size * 0.48;
                    const x = 50 + (labelRadius / size) * 100 * Math.cos(angle);
                    const y = 50 + (labelRadius / size) * 100 * Math.sin(angle);
                    const value = chartData[item.key] || 0;

                    return (
                        <div
                            key={item.key}
                            className={styles.label}
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                            }}
                        >
                            <span className={styles.labelValue}>{value}%</span>
                            <span className={styles.labelText}>{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
