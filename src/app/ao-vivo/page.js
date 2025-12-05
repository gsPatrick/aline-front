'use client';
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import GamesList from "@/components/GamesList/GamesList";
import styles from './page.module.css';
import { FaSatelliteDish } from 'react-icons/fa';

export default function LivePage() {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className={styles.contentLayout}>
        <Sidebar />
        
        <main className={styles.mainContent}>
          
          {/* Cabeçalho da Página */}
          <div className={styles.pageHeader}>
            <div className={styles.titleWrapper}>
                <FaSatelliteDish className={styles.liveIcon} />
                <h1 className={styles.pageTitle}>
                    Jogos <span className={styles.highlight}>Ao Vivo</span>
                </h1>
            </div>
            <div className={styles.liveIndicator}>
                <span className={styles.pulseDot}></span>
                Atualização em tempo real
            </div>
          </div>

          {/* Lista de Jogos: type="live" aciona o hook useLiveMatches */}
          <div className={styles.listContainer}>
             <GamesList type="live" />
          </div>

        </main>
      </div>
    </div>
  );
}