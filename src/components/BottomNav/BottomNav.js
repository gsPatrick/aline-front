'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBroadcastTower, FaTrophy, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from './BottomNav.module.css';

const navItems = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'Ao Vivo', path: '/live', icon: FaBroadcastTower },
    { name: 'Ligas', path: '/leagues', icon: FaTrophy },
    { name: 'Perfil', path: '/profile', icon: FaUser },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.bottomNav}>
            {navItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;

                return (
                    <Link key={item.path} href={item.path} style={{ width: '100%' }}>
                        <motion.div
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Icon className={styles.icon} />
                            <span>{item.name}</span>
                        </motion.div>
                    </Link>
                );
            })}
        </nav>
    );
}
