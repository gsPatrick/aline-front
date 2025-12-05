import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import PlayerSearchFilters from "@/components/PlayerSearchFilters/PlayerSearchFilters";
import PlayerStatsTable from "@/components/PlayerStatsTable/PlayerStatsTable";
import styles from './page.module.css';

export default function EstatisticasPage() {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className={styles.contentLayout}>
        <Sidebar />
        
        <main className={styles.mainContent}>
          <div className={styles.gridContainer}>
            {/* Coluna da Esquerda: Filtros */}
            <div className={styles.leftColumn}>
              <PlayerSearchFilters />
            </div>

            {/* Coluna da Direita: Tabela de Resultados */}
            <div className={styles.rightColumn}>
              <PlayerStatsTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}