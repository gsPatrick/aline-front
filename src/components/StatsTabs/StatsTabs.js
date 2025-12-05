'use client';
import { motion } from 'framer-motion';
import styles from './StatsTabs.module.css';

export default function StatsTabs({ activeTab, setActiveTab, matchStatus }) {
  // Define as abas baseado no status do jogo
  const isUpcoming = matchStatus === 'NS';

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    // Se o jogo não começou, mostra 'Projeções', senão 'Estatísticas'
    isUpcoming 
        ? { id: 'predictions', label: 'Projeções' }
        : { id: 'stats', label: 'Estatísticas' },
    { id: 'lineups', label: 'Escalações' },
    { id: 'h2h', label: 'H2H' },
  ];

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className={styles.underline}
                layoutId="activeTabUnderline"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}