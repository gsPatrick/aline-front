'use client';
import { FaTrash, FaPause, FaPlay, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import styles from './ActiveAlertsList.module.css';

// Mock de alertas salvos
const alerts = [
  { id: 1, name: "Canto Limite HT", criteria: "Pressão > 70, Min 35-45", active: true, channels: ['app', 'telegram'] },
  { id: 2, name: "Gol Favorito Perdendo", criteria: "Chutes > 10, Placar 0-1", active: true, channels: ['whatsapp'] },
  { id: 3, name: "Over 0.5 HT", criteria: "Min 20-45, Placar 0-0", active: false, channels: ['app'] },
];

export default function ActiveAlertsList() {
  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Meus Bots Ativos</h3>
      
      <div className={styles.list}>
        {alerts.map(alert => (
          <div key={alert.id} className={`${styles.alertItem} ${alert.active ? styles.activeItem : styles.pausedItem}`}>
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <span className={styles.alertName}>{alert.name}</span>
                {alert.active ? <span className={styles.statusOn}>ON</span> : <span className={styles.statusOff}>PAUSED</span>}
              </div>
              <p className={styles.criteria}>{alert.criteria}</p>
              <div className={styles.channels}>
                {alert.channels.includes('telegram') && <FaTelegram className={styles.channelIcon} />}
                {alert.channels.includes('whatsapp') && <FaWhatsapp className={styles.channelIcon} />}
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.actionBtn} title={alert.active ? "Pausar" : "Ativar"}>
                {alert.active ? <FaPause /> : <FaPlay />}
              </button>
              <button className={`${styles.actionBtn} ${styles.delete}`} title="Excluir">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}