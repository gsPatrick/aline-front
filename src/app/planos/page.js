'use client';
import { useEffect, useState } from 'react';
import Header from "@/components/Header/Header";
import { FaCheck } from 'react-icons/fa';
import api from '@/lib/api'; // Usando nosso api.js
import styles from './planos.module.css';

export default function PlanosPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca planos do backend
    api.get('/plans')
      .then(res => setPlans(res.data))
      .catch(err => console.error("Erro ao buscar planos", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      const { data } = await api.post('/subscriptions/subscribe', { planId });
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl; // Redireciona para Mercado Pago
      }
    } catch (error) {
      alert("Erro ao iniciar assinatura. Faça login primeiro.");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Escolha seu <span className="text-green">Plano</span></h1>
          <p className={styles.subtitle}>Desbloqueie dados em tempo real, bots ilimitados e análise avançada.</p>
        </div>

        <div className={styles.plansGrid}>
          {plans.length > 0 ? plans.map((plan) => (
            <div key={plan.id} className={styles.planCard}>
              <h3 className={styles.planName}>{plan.title}</h3>
              <div className={styles.priceWrapper}>
                <span className={styles.currency}>R$</span>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.period}>/{plan.frequency === 1 ? 'mês' : 'ano'}</span>
              </div>
              
              <ul className={styles.features}>
                <li><FaCheck className={styles.check} /> Acesso completo aos jogos</li>
                <li><FaCheck className={styles.check} /> Bots ilimitados</li>
                <li><FaCheck className={styles.check} /> Dados de Pressão (Live)</li>
                <li><FaCheck className={styles.check} /> Suporte Prioritário</li>
              </ul>

              <button 
                className={styles.subscribeBtn}
                onClick={() => handleSubscribe(plan.id)}
              >
                ASSINAR AGORA
              </button>
            </div>
          )) : (
            <p>Carregando planos...</p>
          )}
        </div>
      </main>
    </div>
  );
}