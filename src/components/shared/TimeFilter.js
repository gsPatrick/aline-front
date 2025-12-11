'use client';
import { useState } from 'react';
import styles from './TimeFilter.module.css';

export default function TimeFilter({
    period = 'fulltime',
    onPeriodChange,
    maxMinute = 90,
    onMaxMinuteChange
}) {
    const periods = [
        { id: 'fulltime', label: 'Fim do jogo' },
        { id: 'ht', label: '1ª Parte' },
        { id: 'st', label: '2ª Parte' }
    ];

    const handleSliderChange = (e) => {
        if (onMaxMinuteChange) {
            onMaxMinuteChange(parseInt(e.target.value, 10));
        }
    };

    return (
        <div className={styles.container}>
            {/* Period Radio Buttons */}
            <div className={styles.periodSection}>
                <span className={styles.label}>Período de Tempo</span>
                <div className={styles.radioGroup}>
                    {periods.map(p => (
                        <label key={p.id} className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="period"
                                value={p.id}
                                checked={period === p.id}
                                onChange={() => onPeriodChange && onPeriodChange(p.id)}
                                className={styles.radioInput}
                            />
                            <span className={`${styles.radioBtn} ${period === p.id ? styles.active : ''}`}>
                                {p.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Minute Slider */}
            <div className={styles.sliderSection}>
                <span className={styles.label}>Minutos</span>
                <div className={styles.sliderWrapper}>
                    <input
                        type="range"
                        min={period === 'st' ? 46 : 0}
                        max={period === 'ht' ? 45 : 90}
                        value={maxMinute}
                        onChange={handleSliderChange}
                        className={styles.slider}
                    />
                    <span className={styles.sliderValue}>{maxMinute}</span>
                </div>
            </div>
        </div>
    );
}
