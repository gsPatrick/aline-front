// app/jogos/page.js

import Header from "@/components/Header/Header";
import SideBar from "@/components/Sidebar/Sidebar";
import GamesList from "@/components/GamesList/GamesList";
import styles from './page.module.css';

export default function JogosPage() {
  return (
    <>
      <Header />
      <div className={styles.pageLayout}>
        <SideBar />
        <main className={styles.mainContent}>
          {/* Aqui entrarão os filtros e header da lista no futuro */}
          <GamesList />
        </main>
      </div>
    </>
  )
}