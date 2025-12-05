'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import styles from '../login/login.module.css'; // Reutilizando estilos do login

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await register(formData.name, formData.email, formData.password);
    if (!res.success) {
      setError(res.error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Criar Conta</h1>
          <p className={styles.subtitle}>Junte-se à elite das estatísticas</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.inputGroup}>
            <label>Nome Completo</label>
            <div className={styles.inputWrapper}>
              <FaUser className={styles.icon} />
              <input 
                type="text" 
                required
                placeholder="Seu Nome"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>E-mail</label>
            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.icon} />
              <input 
                type="email" 
                required
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Senha</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.icon} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? <FaSpinner className={styles.spinner} /> : 'CRIAR CONTA'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Já tem uma conta? <Link href="/login" className={styles.link}>Faça login</Link></p>
        </div>
      </div>
    </div>
  );
}