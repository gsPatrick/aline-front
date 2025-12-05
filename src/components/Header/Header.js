'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaRegFutbol, FaBolt, FaChartLine, FaRobot, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import styles from './Header.module.css';
import { useAuth } from '@/context/AuthContext'; // Importar Auth

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Usar o hook

  const navItems = [
    { name: 'Ao Vivo', href: '/ao-vivo', icon: <FaBolt /> },
    { name: 'Jogos', href: '/', icon: <FaRegFutbol /> },
    { name: 'Estatísticas', href: '/estatisticas', icon: <FaChartLine /> },
    { name: 'Bots & Alertas', href: '/bots', icon: <FaRobot /> },
  ];

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="10Stats" className={styles.headerLogoImg} />
        </Link>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className={styles.activeIndicator}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className={styles.controls}>
          {/* Badge removida conforme solicitado */}

          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>Olá, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className={styles.logoutBtn} title="Sair">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.profileBtn}>
              <FaUserCircle size={22} />
              <span>Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}