'use client';
import styles from './BookmakerFilter.module.css';
import { FaCheck } from 'react-icons/fa';

const BOOKMAKERS = [
  { id: 2, name: 'Bet365' }
];

export default function BookmakerFilter({ selected, onSelect }) {
  return (
    <div className={styles.filterContainer}>
      <span className={styles.label}>Cotações:</span>
      <div className={styles.list}>
        {BOOKMAKERS.map((bookie) => (
          <button
            key={bookie.id}
            className={`${styles.pill} ${selected === bookie.id ? styles.active : ''}`}
            onClick={() => onSelect(bookie.id)}
          >
            {selected === bookie.id && <FaCheck className={styles.icon} />}
            {bookie.name}
          </button>
        ))}
      </div>
    </div>
  );
}