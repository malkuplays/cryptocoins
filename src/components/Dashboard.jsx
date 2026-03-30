import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  TrendingUp, 
  Coins, 
  Zap, 
  Timer, 
  Info,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../supabase';

const Dashboard = ({ user, setUser }) => {
  const [balance, setBalance] = useState(user.mining_balance || 0);
  const [lastSync, setLastSync] = useState(new Date(user.last_sync || Date.now()));
  const [syncing, setSyncing] = useState(false);

  // Constants
  const miningPower = user.mining_power || 0; // YET per hour
  const powerPerSecond = miningPower / 3600;

  // Real-time increment
  useEffect(() => {
    const timer = setInterval(() => {
      setBalance(prev => prev + powerPerSecond);
    }, 1000);

    return () => clearInterval(timer);
  }, [powerPerSecond]);

  // Sync with database periodically
  const syncBalance = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    
    try {
      const now = new Date();
      const { data, error } = await supabase
        .from('players')
        .update({ 
          mining_balance: balance,
          last_sync: now.toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setLastSync(now);
      setUser(data);
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  }, [balance, user.id, syncing, setUser]);

  // Auto-sync every 60 seconds
  useEffect(() => {
    const syncTimer = setInterval(syncBalance, 60000);
    return () => clearInterval(syncTimer);
  }, [syncBalance]);

  // Staking progress calculation
  const getStakingProgress = () => {
    if (!user.staking_start || !user.staking_end) return 0;
    const start = new Date(user.staking_start).getTime();
    const end = new Date(user.staking_end).getTime();
    const current = Date.now();
    
    const total = end - start;
    const elapsed = current - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getDaysRemaining = () => {
    if (!user.staking_end) return 0;
    const diff = new Date(user.staking_end).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="container" style={{ paddingBottom: '30px' }}>
      <header className="space-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '18px', opacity: 0.7 }}>Miner: @{user.username}</h1>
          <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            <div className="glass flex-center" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4cd964' }} />
            <span style={{ fontSize: '12px' }}>Live Mining</span>
          </div>
        </div>
        <button 
          onClick={syncBalance} 
          disabled={syncing}
          style={{ background: 'none', border: 'none', color: 'white' }}
        >
          <motion.div animate={{ rotate: syncing ? 360 : 0 }} transition={{ repeat: syncing ? Infinity : 0, duration: 1 }}>
            <RefreshCw size={20} opacity={0.6} />
          </motion.div>
        </button>
      </header>

      {/* Main Balance Card */}
      <motion.div 
        className="glass-panel-heavy animate-stagger-1" 
        style={{ marginBottom: '24px', textAlign: 'center', padding: '32px 20px', position: 'relative', overflow: 'hidden' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: 'var(--neon-green-glow)', filter: 'blur(50px)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', opacity: 0.6 }}>Current Balance</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1, fontSize: '46px', fontWeight: '900', margin: '16px 0', textShadow: '0 4px 20px rgba(0, 255, 157, 0.4)' }} className="balance-ticker">
           {balance.toFixed(6)} <span style={{ fontSize: '20px', color: 'var(--premium-blue)', fontWeight: '800' }}>$YETC</span>
        </div>
        <div className="flex-center" style={{ position: 'relative', zIndex: 1, gap: '8px', background: 'rgba(0,255,157,0.1)', display: 'inline-flex', padding: '6px 12px', borderRadius: '100px', border: '1px solid rgba(0,255,157,0.2)' }}>
          <TrendingUp size={16} color="var(--neon-green)" />
          <span style={{ color: 'var(--neon-green)', fontWeight: '700', fontSize: '13px' }}>+{miningPower} YETC / HR</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel-heavy animate-stagger-2 hover-glow" style={{ padding: '20px', borderRadius: '24px' }}>
          <Timer size={24} color="var(--premium-orange)" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Time Active</div>
          <div style={{ fontSize: '20px', fontWeight: '800' }}>3h 12m</div>
        </div>
        <div className="glass-panel-heavy animate-stagger-3 hover-glow" style={{ padding: '20px', borderRadius: '24px' }}>
          <ShieldCheck size={24} color="var(--premium-blue)" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>Security Tier</div>
          <div style={{ fontSize: '20px', fontWeight: '800', textTransform: 'capitalize' }}>{user.plan_tier || 'Starter'}</div>
        </div>
      </div>

      {/* Staking Progress */}
      <div className="glass-panel-heavy animate-stagger-4" style={{ padding: '24px', borderRadius: '24px' }}>
        <div className="space-between" style={{ marginBottom: '16px' }}>
          <div className="flex-center" style={{ gap: '8px' }}>
            <Zap size={18} color="#9d50bb" />
            <h2 style={{ fontSize: '16px' }}>Staking Period</h2>
          </div>
          <span style={{ fontSize: '14px', color: '#9d50bb' }}>{getDaysRemaining()} Days left</span>
        </div>
        
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${getStakingProgress()}%` }}
            transition={{ duration: 1 }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #00d2ff, #9d50bb)', borderRadius: '4px' }}
          />
        </div>
        <p style={{ fontSize: '12px' }}>Progress of your current mining plan's lock-up period.</p>
      </div>

      {/* Info Notice */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px' }}>
          <Info size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          Estimated Listing Price: 1 $YETC = ₹8.42
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
