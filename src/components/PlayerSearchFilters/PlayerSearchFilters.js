'use client';
import { FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import styles from './PlayerSearchFilters.module.css';

export default function PlayerSearchFilters() {
  return (
    <aside className={styles.filtersContainer}>
      <div className={styles.header}>
        <FaFilter className={styles.icon} />
        <h2>Filtros Avançados</h2>
      </div>
      
      <form className={styles.form}>
        {/* Busca por Nome */}
        <div className={styles.inputGroup}>
          <label>Nome do Jogador</label>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Ex: Haaland, Vini Jr..." 
              className={styles.input} 
            />
          </div>
        </div>

        {/* Ligas */}
        <div className={styles.inputGroup}>
          <label>Competição</label>
          <select className={styles.select}>
            <option>Todas as Ligas</option>
            <option>Premier League</option>
            <option>La Liga</option>
            <option>Bundesliga</option>
            <option>Série A (Brasil)</option>
          </select>
        </div>

        {/* Mercado de Estatística */}
        <div className={styles.inputGroup}>
          <label>Mercado</label>
          <select className={styles.select}>
            <option>Chutes ao Gol</option>
            <option>Finalizações Totais</option>
            <option>Faltas Cometidas</option>
            <option>Desarmes</option>
            <option>Passes</option>
          </select>
        </div>

        {/* Linha e Operador */}
        <div className={styles.rowGroup}>
          <div className={styles.inputGroup}>
            <label>Linha</label>
            <input type="number" defaultValue="1.5" className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label>Condição</label>
            <select className={styles.select}>
              <option>Over (&gt;)</option>
              <option>Under (&lt;)</option>
            </select>
          </div>
        </div>

        {/* Período */}
        <div className={styles.inputGroup}>
          <label>Analisar Últimos</label>
          <div className={styles.toggleGroup}>
            <button type="button" className={styles.toggleBtn}>5 J</button>
            <button type="button" className={`${styles.toggleBtn} ${styles.active}`}>10 J</button>
            <button type="button" className={styles.toggleBtn}>Temporada</button>
          </div>
        </div>

        <button type="button" className={styles.searchButton}>
          BUSCAR OPORTUNIDADES
        </button>
      </form>
    </aside>
  );
}