import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCcw, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabase';
import { triggerHaptic } from '../telegram';

const PaymentPending = ({ user, onSuccess }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkStatus = async () => {
    if (!user?.id) return;
    triggerHaptic('impact');
    setIsRefreshing(true);
    
    try {
      const { data, error } = await supabase
        .from('players')
        .select('payment_status, profile_completed')
        .eq('id', user.id)
        .single();
        
      if (!error && data) {
        // If approved, trigger onSuccess to navigate forward
        if (data.payment_status === 'approved') {
          triggerHaptic('notification_success');
          onSuccess(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container flex-center" style={{ padding: '24px', minHeight: '100vh', flexDirection: 'column' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', maxWidth: '300px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div className="icon-box-v2" style={{ width: '80px', height: '80px', background: 'rgba(255, 149, 0, 0.1)', border: '1px solid rgba(255, 149, 0, 0.3)' }}>
            <Clock size={40} color="#ff9500" />
          </div>
        </div>
        
        <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '12px' }}>
          Payment <span style={{ color: '#ff9500' }}>Pending</span>
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.5', marginBottom: '32px' }}>
          Your payment is currently being verified by our team. This usually takes a few minutes. 
          Please hold tight!
        </p>

        <div className="glass-panel-heavy animate-stagger-1" style={{ padding: '20px', marginBottom: '32px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <ShieldCheck size={28} color="var(--neon-green)" style={{ flexShrink: 0 }} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>100% Secure</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Your transaction ID is securely logged. You will be onboarded as soon as it's approved.</div>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.96 }}
          className="btn-primary" 
          onClick={checkStatus}
          disabled={isRefreshing}
          style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '8px',
            background: isRefreshing ? 'var(--neon-green-dim)' : 'var(--neon-green)',
            color: isRefreshing ? 'var(--text-muted)' : '#000'
          }}
        >
          {isRefreshing ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <RefreshCcw size={20} />
              </motion.div>
              Checking...
            </>
          ) : (
            <>
              <RefreshCcw size={20} />
              Refresh Status
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaymentPending;
