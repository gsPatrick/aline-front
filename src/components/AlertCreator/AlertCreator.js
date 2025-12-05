'use client';
import { useState } from 'react';
import { FaRobot, FaPlus } from 'react-icons/fa';
import styles from './AlertCreator.module.css';
// import api from '@/lib/api'; // Usaremos para salvar no futuro

export default function AlertCreator() {
  const [loading, setLoading] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de delay de API
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <FaRobot className={styles.icon} />
        <h3>Novo Bot</h3>
      </div>

      <form className={styles.form} onSubmit={handleCreate}>
        
        {/* Critério 1: Tempo */}
        <div className={styles.group}>
          <label>Minuto do Jogo</label>
          <div className={styles.rangeWrapper}>
            <input type="number" placeholder="Min" className={styles.input} />
            <span>até</span>
            <input type="number" placeholder="Max" className={styles.input} />
          </div>
        </div>

        {/* Critério 2: Estatística */}
        <div className={styles.group}>
          <label>Condição de Estatística</label>
          <div className={styles.conditionRow}>
            <select className={styles.select}>
              <option>Pressão (Graph)</option>
              <option>Chutes ao Gol</option>
              <option>Escanteios</option>
              <option>Ataques Perigosos</option>
            </select>
            <select className={styles.selectSmall}>
              <option>Maior que</option>
              <option>Menor que</option>
            </select>
            <input type="number" className={styles.input} defaultValue="10" />
          </div>
        </div>

        {/* Critério 3: Situação */}
        <div className={styles.group}>
          <label>Situação da Partida</label>
          <select className={styles.select}>
            <option>Qualquer</option>
            <option>Favorito Perdendo</option>
            <option>Empate</option>
            <option>Visitante Ganhando</option>
          </select>
        </div>

        {/* Canais */}
        <div className={styles.group}>
          <label>Enviar Alerta Via</label>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked /> App
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" /> Telegram
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" /> WhatsApp
            </label>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'CRIANDO...' : <><FaPlus /> CRIAR ESTRATÉGIA</>}
        </button>
      </form>
    </div>
  );
}