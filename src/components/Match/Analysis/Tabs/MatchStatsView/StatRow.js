'use client';
import styles from './StatRow.module.css';

export default function StatRow({ label, homeValue, awayValue, type = 'count' }) {
    const hVal = parseFloat(homeValue || 0);
    const aVal = parseFloat(awayValue || 0);

    let homeWidth = 0;
    let awayWidth = 0;

    if (type === 'percent') {
        const total = hVal + aVal;
        homeWidth = total > 0 ? (hVal / total) * 100 : 0;
        awayWidth = total > 0 ? (aVal / total) * 100 : 0;
    } else {
        // Escala inteligente para não estourar ou ficar muito pequeno
        const maxValInRow = Math.max(hVal, aVal);
        const scaleBase = Math.max(maxValInRow * 1.2, 10);

        homeWidth = (hVal / scaleBase) * 100;
        awayWidth = (aVal / scaleBase) * 100;

        if (homeWidth > 100) homeWidth = 100;
        if (awayWidth > 100) awayWidth = 100;
    }

    return (
        <div className={styles.rowWrapper}>
            {/* Título Centralizado em cima da barra */}
            <div className={styles.barLabel}>{label}</div>

            <div className={styles.barContainer}>
                {/* Lado Casa */}
                <div className={styles.sideLeft}>
                    <span className={styles.valLeft}>{hVal}</span>
                    <div className={styles.track}>
                        <div
                            className={styles.fillHome}
                            style={{ width: `${homeWidth}%` }}
                        ></div>
                    </div>
                </div>

                {/* Espaçador */}
                <div className={styles.gap}></div>

                {/* Lado Fora */}
                <div className={styles.sideRight}>
                    <div className={styles.track}>
                        <div
                            className={styles.fillAway}
                            style={{ width: `${awayWidth}%` }}
                        ></div>
                    </div>
                    <span className={styles.valRight}>{aVal}</span>
                </div>
            </div>
        </div>
    );
}