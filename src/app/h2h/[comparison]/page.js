// app/h2h/[comparison]/page.js
import Header from "@/components/Header/Header";
import H2HHeader from "@/components/H2HHeader/H2HHeader";
import RecentMeetings from "@/components/RecentMeetings/RecentMeetings";
import StatsComparison from "@/components/StatsComparison/StatsComparison";
import styles from './page.module.css';

export default function H2HPage({ params }) {
  // O `params.comparison` ("time-a-vs-time-b") será usado para buscar os dados
  return (
    <>
      <Header />
      <main className={styles.main}>
        <H2HHeader />
        <div className={styles.contentGrid}>
          <RecentMeetings />
          <StatsComparison />
        </div>
      </main>
    </>
  );
}