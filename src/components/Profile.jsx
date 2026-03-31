import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Gem, Lock, ShieldCheck, 
  Clock, TrendingUp, Copy, CheckCircle2, Star, AlertCircle, X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useSettings } from '../SettingsContext';
import { AnimatePresence } from 'framer-motion';



const Profile = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const [latestAlert, setLatestAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { yetcPriceUsd } = useSettings();

  useEffect(() => {
    if (user?.id) {
      fetchLatestAlert();
    }
  }, [user?.id]);

  const fetchLatestAlert = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('message, created_at')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) setLatestAlert(data);
    } catch (e) {
      console.error("Alerts fetching failure:", e);
    }
  };

  const tier = user?.plan_tier || 'free';
  const stakingYears = user?.staking_years || 0;
  const balance = user?.mining_balance || 0;

  const tierColors = {
    whale: { bg: 'rgba(255, 215, 0, 0.1)', border: 'rgba(255, 215, 0, 0.3)', color: '#FFD700', label: 'Whale', icon: '🐋' },
    pro: { bg: 'rgba(0, 209, 255, 0.1)', border: 'rgba(0, 209, 255, 0.3)', color: '#00D1FF', label: 'Pro', icon: '⚡' },
    starter: { bg: 'rgba(0, 255, 157, 0.1)', border: 'rgba(0, 255, 157, 0.3)', color: '#00FF9D', label: 'Starter', icon: '🚀' },
    free: { bg: 'rgba(100, 100, 100, 0.1)', border: 'rgba(100, 100, 100, 0.3)', color: '#626C7A', label: 'Free', icon: '🏁' },
  };
  const tc = tierColors[tier] || tierColors.free;

  const copyId = () => {
    try {
      navigator.clipboard.writeText(user?.id || '');
    } catch (e) {
      const t = document.createElement('textarea');
      t.value = user?.id || '';
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div 
      className="container" 
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 80px)', paddingBottom: '100px' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Alert Header Section */}
      <AnimatePresence>
        {latestAlert && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ marginBottom: '20px', overflow: 'hidden' }}
          >
            <div 
              onClick={() => setShowAlert(!showAlert)}
              style={{ 
                background: 'linear-gradient(90deg, rgba(255, 107, 107, 0.15), rgba(255, 185, 0, 0.15))',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                borderRadius: '16px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <AlertCircle size={20} className="glow-text-orange" style={{ color: '#FF6B6B' }} />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ 
                      position: 'absolute', top: '-2px', right: '-2px', 
                      width: '6px', height: '6px', borderRadius: '50%', background: '#FF6B6B' 
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#FF6B6B', letterSpacing: '0.5px' }}>NEW NOTIFICATION</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'white', lineBreak: 'anywhere' }}>
                    {showAlert ? latestAlert.message : (latestAlert.message.substring(0, 40) + (latestAlert.message.length > 40 ? '...' : ''))}
                  </div>
                </div>
              </div>
              {showAlert ? <X size={16} /> : <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>VIEW</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <motion.div 
        variants={itemVariants}
        style={{ textAlign: 'center', marginBottom: '28px' }}
      >
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 16px',
          background: `linear-gradient(135deg, ${tc.bg}, ${tc.border})`,
          border: `2px solid ${tc.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px'
        }}>
          {tc.icon}
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '4px' }}>
          {user?.full_name || user?.username || 'User'}
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          @{user?.username || 'unknown'}
        </div>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 16px', borderRadius: '100px',
          background: tc.bg, border: `1px solid ${tc.border}`,
          fontSize: '13px', fontWeight: '800', color: tc.color
        }}>
          <Star size={14} /> {tc.label} Member
        </div>
      </motion.div>

      {/* Balance Summary */}
      <motion.div 
        variants={itemVariants}
        style={{ 
          padding: '24px', borderRadius: '24px', marginBottom: '16px',
          background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1px', marginBottom: '8px' }}>PORTFOLIO VALUE</div>
        <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '4px' }}>{balance.toFixed(2)} <span style={{ fontSize: '16px', color: 'var(--premium-blue)' }}>$YETC</span></div>
        <div style={{ fontSize: '14px', color: 'var(--neon-green)', fontWeight: '700' }}>
          ≈ ${(balance * yetcPriceUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </div>
      </motion.div>

      {/* Account Details */}
      <motion.div 
        variants={itemVariants}
        style={{ 
          padding: '20px', borderRadius: '24px', marginBottom: '16px',
          background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '16px' }}>ACCOUNT DETAILS</div>
        
        {[
          { icon: <User size={16} />, label: 'Full Name', value: user?.full_name || '—' },
          { icon: <Mail size={16} />, label: 'Email', value: user?.email || '—' },
          { icon: <Phone size={16} />, label: 'WhatsApp', value: user?.whatsapp_number || '—' },
          { icon: <Calendar size={16} />, label: 'Date of Birth', value: formatDate(user?.dob) },
          { icon: <Clock size={16} />, label: 'Member Since', value: formatDate(user?.created_at) },
        ].map((item, i) => (
          <div key={i} style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0',
            borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              {item.icon}
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.label}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>{item.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Plan & Staking */}
      <motion.div 
        variants={itemVariants}
        style={{ 
          padding: '20px', borderRadius: '24px', marginBottom: '16px',
          background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '16px' }}>PLAN & STAKING</div>
        
        {[
          { icon: <Gem size={16} color={tc.color} />, label: 'Active Plan', value: tc.label },
          { icon: <Lock size={16} color="var(--premium-purple)" />, label: 'Staking Period', value: stakingYears > 0 ? `${stakingYears} Years` : 'None' },
          { icon: <TrendingUp size={16} color="var(--neon-green)" />, label: 'Return Multiplier', value: stakingYears === 7 ? '7.0x' : stakingYears === 5 ? '3.5x' : '1.0x' },
          { icon: <ShieldCheck size={16} color="var(--premium-blue)" />, label: 'Payment Status', value: user?.payment_status === 'approved' ? 'Verified ✓' : user?.payment_status || '—' },
        ].map((item, i) => (
          <div key={i} style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0',
            borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              {item.icon}
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.label}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{item.value}</span>
          </div>
        ))}
      </motion.div>

      {/* User ID */}
      <motion.div 
        variants={itemVariants}
        style={{ 
          padding: '16px 20px', borderRadius: '16px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px' }}>USER ID</div>
          <div style={{ fontSize: '13px', fontWeight: '600', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{user?.id || '—'}</div>
        </div>
        <button onClick={copyId} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}>
          {copied ? <CheckCircle2 size={18} color="var(--neon-green)" /> : <Copy size={18} />}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
