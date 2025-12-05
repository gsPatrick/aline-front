'use client';
import { useState } from 'react';
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import AlertCreator from "@/components/AlertCreator/AlertCreator";
import ActiveAlertsList from "@/components/ActiveAlertsList/ActiveAlertsList";
import styles from './page.module.css';

export default function BotsPage() {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <div className={styles.contentLayout}>
        <Sidebar />
        
        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Central de <span className="text-green">Automação</span></h1>
            <p className={styles.subtitle}>Crie robôs para monitorar jogos 24/7 e receba alertas no Telegram/WhatsApp.</p>
          </div>

          <div className={styles.gridContainer}>
            {/* Criador de Alertas */}
            <div className={styles.creatorSection}>
              <AlertCreator />
            </div>
            
            {/* Lista de Alertas Ativos */}
            <div className={styles.listSection}>
              <ActiveAlertsList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}