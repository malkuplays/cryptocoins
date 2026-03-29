import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ArrowLeft, 
  Check, 
  CreditCard 
} from 'lucide-react';
import { supabase } from '../supabase';

const plans = [
  { 
    id: 'starter',
    name: 'Starter Mover', 
    price: 1000, 
    power: 0.5, 
    period: '30 Days',
    features: ['0.5 YET / Hour', 'Basic Dashboard', 'Email Support']
  },
  { 
    id: 'pro',
    name: 'Pro Miner', 
    price: 2999, 
    power: 2.0, 
    period: '90 Days',
    features: ['2.0 YET / Hour', 'Advanced Analytics', 'Priority Support', 'Early Listing Access']
  },
  { 
    id: 'legendary',
    name: 'Legendary Staker', 
    price: 6999, 
    power: 6.0, 
    period: '365 Days',
    features: ['6.0 YET / Hour', 'VIP Community', '24/7 Personal Support', 'Max Staking Period']
  }
];

const PricingPage = ({ user, onSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (plan) => {
    setLoading(true);
    
    // In a real app, you would call your backend to create an order
    // Here we simulate the Razorpay checkout for the test environment
    const options = {
      key: 'rzp_test_placeholder', // User should replace this
      amount: plan.price * 100, // paise
      currency: 'INR',
      name: 'Yetcoins',
      description: `Purchase ${plan.name} Plan`,
      image: 'https://glglxmpxbqeyytxryzxj.supabase.co/storage/v1/object/public/assets/logo.png', // Example
      handler: async (response) => {
        // Handle successful payment
        await finalizePurchase(plan, response.razorpay_payment_id);
      },
      prefill: {
        name: user.full_name || user.username,
        email: user.email || '',
        contact: user.whatsapp || ''
      },
      theme: { color: '#00d2ff' }
    };

    // Simulate script loading if not already there
    if (!window.Razorpay) {
      alert("Please ensure Razorpay SDK is loaded. Check index.html");
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
      
      // Calculate staking end based on period
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
      alert('Failed to activate plan. Please contact support.');
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      <header className="space-between" style={{ marginBottom: '32px' }}>
        <h1>Select Your Plan</h1>
        <Zap color="#00d2ff" size={24} />
      </header>

      {plans.map((plan, idx) => (
        <motion.div 
          key={idx}
          className="glass glass-card"
          style={{ marginBottom: '20px' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className="space-between" style={{ marginBottom: '12px' }}>
            <h2 style={{ color: plan.id === 'legendary' ? '#ff9f43' : 'white' }}>{plan.name}</h2>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>₹{plan.price}</div>
              <div style={{ fontSize: '12px', opacity: 0.6 }}>{plan.period}</div>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            {plan.features.map((f, i) => (
              <div key={i} className="space-between" style={{ marginBottom: '6px', justifyContent: 'flex-start' }}>
                <Check size={14} color="#00d2ff" style={{ marginRight: '8px' }} />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{f}</span>
              </div>
            ))}
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
            onClick={() => handlePayment(plan)}
            disabled={loading}
          >
            <CreditCard size={18} />
            {loading ? 'Processing...' : 'Secure Pay'}
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingPage;
