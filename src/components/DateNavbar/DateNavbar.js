'use client';
import { useState, useMemo } from 'react';
import styles from './DateNavbar.module.css';

export default function DateNavbar({ selectedDate, onDateChange }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate dates: 2 days before today + today + 7 days after
    const dates = useMemo(() => {
        const result = [];
        for (let i = -2; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            result.push(date);
        }
        return result;
    }, []);

    const formatDayName = (date, isToday, isTomorrow, isYesterday) => {
        if (isToday) return 'HOJE';
        if (isTomorrow) return 'AMANHÃ';
        if (isYesterday) return 'ONTEM';

        const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
        return dayNames[date.getDay()];
    };

    const getDateKey = (date) => {
        return date.toISOString().split('T')[0];
    };

    const isToday = (date) => {
        return getDateKey(date) === getDateKey(today);
    };

    const isTomorrow = (date) => {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return getDateKey(date) === getDateKey(tomorrow);
    };

    const isYesterday = (date) => {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return getDateKey(date) === getDateKey(yesterday);
    };

    const isSelected = (date) => {
        return selectedDate && getDateKey(date) === selectedDate;
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.dateList}>
                {dates.map((date) => {
                    const dateKey = getDateKey(date);
                    const todayCheck = isToday(date);
                    const tomorrowCheck = isTomorrow(date);
                    const yesterdayCheck = isYesterday(date);
                    const selectedCheck = isSelected(date);

                    return (
                        <button
                            key={dateKey}
                            className={`${styles.dateItem} ${selectedCheck ? styles.active : ''} ${todayCheck ? styles.today : ''}`}
                            onClick={() => onDateChange(dateKey)}
                        >
                            <span className={styles.dayName}>
                                {formatDayName(date, todayCheck, tomorrowCheck, yesterdayCheck)}
                            </span>
                            <span className={styles.dayNumber}>
                                {date.getDate()}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
