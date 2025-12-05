// components/RecentMeetings/RecentMeetings.js
import styles from './RecentMeetings.module.css';

// Dados mocados
const meetings = [
  { date: '21/04/2023', home: 'Hamburger SV', away: 'St. Pauli', score: '4 - 3' },
  { date: '14/10/2022', home: 'St. Pauli', away: 'Hamburger SV', score: '3 - 0' },
  { date: '21/01/2022', home: 'Hamburger SV', away: 'St. Pauli', score: '2 - 1' },
  { date: '13/08/2021', home: 'St. Pauli', away: 'Hamburger SV', score: '3 - 2' },
  { date: '01/03/2021', home: 'St. Pauli', away: 'Hamburger SV', score: '1 - 0' },
];

export default function RecentMeetings() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Últimos 5 Confrontos</h2>
      <ul className={styles.meetingList}>
        {meetings.map((meeting, index) => (
          <li key={index} className={styles.meetingItem}>
            <span className={styles.date}>{meeting.date}</span>
            <span className={styles.teams}>{meeting.home} vs {meeting.away}</span>
            <span className={styles.score}>{meeting.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}