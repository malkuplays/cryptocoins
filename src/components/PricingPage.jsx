import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ArrowLeft, 
  Check, 
  CreditCard 
} from 'lucide-react';
import { supabase } from '../supabase';
import { useSettings } from '../SettingsContext';

const PricingPage = ({ user, onSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);
  const { plans } = useSettings();

  const handlePayment = async (plan) => {
    setLoading(true);
    
    const options = {
      key: 'rzp_test_placeholder',
      amount: plan.price * 100,
      currency: 'INR',
      name: 'Yetcoins',
      description: `Purchase ${plan.name} Plan`,
      image: '/src/assets/logo.svg',
      handler: async (response) => {
        await finalizePurchase(plan, response.razorpay_payment_id);
      },
      prefill: {
        name: user?.full_name || user?.username || 'Miner',
        email: user?.email || '',
      },
      theme: { color: '#00FF88' }
    };

    if (!window.Razorpay) {
      alert("Razorpay SDK not found.");
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  const finalizePurchase = async (plan, paymentId) => {
    try {
      const now = new Date();
      const end = new Date();
      
      if (plan.id === 'starter') end.setDate(now.getDate() + 30);
      else if (plan.id === 'pro') end.setDate(now.getDate() + 90);
      else if (plan.id === 'legendary') end.setFullYear(now.getFullYear() + 1);

      const { data, error } = await supabase
        .from('players')
        .update({
          plan_tier: plan.name,
          mining_power: plan.power,
          staking_start: now.toISOString(),
          staking_end: end.toISOString(),
          last_sync: now.toISOString(),
          is_onboarded: true
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      onSuccess(data);
    } catch (err) {
      console.error('Finalize error:', err);
      alert('Failed to activate plan.');
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="circuit-bg" />
      
      <header className="space-between" style={{ padding: '20px', marginBottom: '12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="glow-header" style={{ fontSize: '20px' }}>Upgrade Center</h2>
        <div style={{ width: '24px' }} />
      </header>

      <div style={{ padding: '0 20px 40px' }}>
        <p style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-secondary)' }}>
          Select a Genesis plan to boost your airdrop multiplier.
        </p>

        {plans.map((plan, idx) => (
          <motion.div 
            key={idx}
            className="premium-card"
            style={{ 
              marginBottom: '16px',
              border: plan.id === 'pro' ? '1px solid var(--neon-green)' : '1px solid var(--glass-border)',
              background: plan.id === 'pro' ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="space-between" style={{ alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: plan.id === 'pro' ? 'var(--neon-green)' : 'white' }}>{plan.name}</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{plan.period} Duration</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: plan.id === 'pro' ? 'var(--neon-green)' : 'white' }}>₹{plan.price}</div>
                <div style={{ fontSize: '10px', color: '#00FF88', fontWeight: '700' }}>{plan.power}x BOOST</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="var(--neon-green)" />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                </div>
              ))}
            </div>

            <button 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                background: plan.id === 'pro' ? 'var(--neon-green)' : 'rgba(255,255,255,0.05)',
                color: plan.id === 'pro' ? '#000' : 'white',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '800'
              }}
              onClick={() => handlePayment(plan)}
              disabled={loading}
            >
              {loading ? 'Processing...' : plan.price === 0 ? 'Activate Free' : 'Upgrade Now'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;

