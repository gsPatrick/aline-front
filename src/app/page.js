'use client';
import { useState } from 'react';
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import DateNavbar from "@/components/DateNavbar/DateNavbar";
import GamesList from "@/components/GamesList/GamesList";
import styles from './page.module.css';

export default function HomePage() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);

  return (
    <div className={styles.mainWrapper}>
      <Header />

      <div className={styles.contentLayout}>
        <Sidebar />

        <main className={styles.mainContent}>
          {/* Date Navigation */}
          <DateNavbar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Matches List */}
          <div className={styles.matchesContainer}>
            <GamesList type="daily" selectedDate={selectedDate} />
          </div>
        </main>
      </div>
    </div>
  );
}