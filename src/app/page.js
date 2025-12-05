import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import GamesList from "@/components/GamesList/GamesList";
import styles from './page.module.css';

export default function HomePage() {
  const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  return (
    <div className={styles.mainWrapper}>
      <Header />
      
      <div className={styles.contentLayout}>
        <Sidebar />
        
        <main className={styles.mainContent}>
          <div className={styles.contentHeader}>
            <h1 className={styles.pageTitle}>Jogos <span className="text-green">em Destaque</span></h1>
            <div className={styles.dateFilter}>Hoje, {todayStr}</div>
          </div>

          {/* Aqui definimos type="daily" para puxar todos os jogos */}
          <GamesList type="daily" />
        </main>
      </div>
    </div>
  );
}