import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Gem, Lock, ShieldCheck, 
  Clock, TrendingUp, Copy, CheckCircle2, Star, Bell,
  IndianRupee, Wallet, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useSettings } from '../SettingsContext';
import { AnimatePresence } from 'framer-motion';



const Profile = ({ 
  user, 
  onOpenNotifications, 
  onOpenWithdrawal, 
  onOpenWithdrawalHistory,
  onOpenMiningWithdrawal,
  onOpenMiningHistory,
  onOpenVerification
}) => {
  const [copied, setCopied] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // null, 'pending', 'verified'
  const { yetcPriceUsd, verification_price_inr } = useSettings();

  useEffect(() => {
    if (user?.id) {
      checkNewNotifications();
      checkVerificationStatus();
    }
  }, [user?.id, user?.is_verified]);

  const checkVerificationStatus = async () => {
    if (user?.is_verified) {
      setVerificationStatus('verified');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('status')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setVerificationStatus(data[0].status);
      }
    } catch (err) {
      console.error("Error checking verification status:", err);
    }
  };

  const checkNewNotifications = async () => {
    try {
      const lastSeen = localStorage.getItem('yetc_last_notif_seen');
      
      // 1. Check latest Personal Alert
      const { data: latestAlert } = await supabase
        .from('alerts')
        .select('created_at')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // 2. Check latest Global Notification
      const { data: latestGlobal } = await supabase
        .from('global_notifications')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      const latestTime = Math.max(
        latestAlert ? new Date(latestAlert.created_at).getTime() : 0,
        latestGlobal ? new Date(latestGlobal.created_at).getTime() : 0
      );

      if (latestTime > 0) {
        if (!lastSeen || latestTime > new Date(lastSeen).getTime()) {
          setHasUnread(true);
        }
      }
    } catch (err) {
      console.error("Error checking notifications:", err);
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
      {/* Profile Header Block */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-20px', position: 'relative', zIndex: 10 }}>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onOpenNotifications}
          style={{ 
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '10px', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            position: 'relative' // For absolute badge placement
          }}
        >
          <motion.div
            animate={hasUnread ? { 
              rotate: [0, -10, 10, -10, 10, 0] 
            } : {}}
            transition={{ 
              repeat: hasUnread ? Infinity : 0, 
              duration: 2, 
              repeatDelay: 3 
            }}
          >
            <Bell size={20} className={hasUnread ? "glow-text-blue" : ""} />
          </motion.div>

          {/* Red Dot Badge */}
          {hasUnread && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                background: '#FF3B30',
                borderRadius: '50%',
                border: '2px solid rgba(0,0,0,0.6)',
                zIndex: 1
              }}
            >
              <motion.div 
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: '#FF3B30', borderRadius: '50%'
                }}
              />
            </motion.div>
          )}
        </motion.button>
      </div>

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
        <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          {user?.full_name || user?.username || 'User'}
          {user?.is_verified && (
            <ShieldCheck size={20} fill="var(--premium-blue)" color="white" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
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
        <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '4px' }}>{balance.toFixed(4)} <span style={{ fontSize: '16px', color: 'var(--premium-blue)' }}>$YETC</span></div>
        <div style={{ fontSize: '14px', color: 'var(--neon-green)', fontWeight: '700', marginBottom: '20px' }}>
          ≈ ${(balance * yetcPriceUsd).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} USD
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onOpenMiningWithdrawal}
            style={{ 
              background: 'var(--neon-green)', color: 'black', border: 'none',
              padding: '12px', borderRadius: '14px', fontSize: '13px', fontWeight: '800',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: '0 4px 15px rgba(0, 255, 157, 0.2)'
            }}
          >
            <Wallet size={16} /> Withdraw
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onOpenMiningHistory}
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', padding: '12px', borderRadius: '14px', fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            <Clock size={16} /> History
          </motion.button>
        </div>
      </motion.div>

      {/* Verification Ad/Status Card */}
      {!user?.is_verified && (
        <motion.div 
          variants={itemVariants}
          style={{ 
            padding: '20px', borderRadius: '24px', marginBottom: '16px',
            background: 'linear-gradient(135deg, rgba(0, 209, 255, 0.1), rgba(157, 80, 187, 0.05))',
            border: '1px solid rgba(0, 209, 255, 0.2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              width: '44px', height: '44px', borderRadius: '14px', 
              background: 'rgba(0, 209, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ShieldCheck size={22} color="var(--premium-blue)" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'white' }}>
                {verificationStatus === 'pending' ? 'Verification Pending' : (verificationStatus === 'approved' ? 'Verified ✓' : 'Get Verified')}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {verificationStatus === 'pending' ? 'Currently under review' : (verificationStatus === 'approved' ? 'Reload app to see badge' : `Premium badge for ₹${verification_price_inr}`)}
              </div>
            </div>
          </div>
          
          {verificationStatus !== 'pending' && verificationStatus !== 'approved' && (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={onOpenVerification}
              style={{ 
                background: 'var(--premium-blue)', color: 'white', border: 'none',
                padding: '10px 18px', borderRadius: '100px', fontSize: '12px', fontWeight: '800',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 4px 15px rgba(0, 209, 255, 0.3)', position: 'relative', zIndex: 1
              }}
            >
              Apply <ChevronRight size={14} />
            </motion.button>
          )}

          {(verificationStatus === 'pending' || verificationStatus === 'approved') && (
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--premium-blue)', padding: '8px 12px', background: 'rgba(0, 209, 255, 0.1)', borderRadius: '100px' }}>
              {verificationStatus === 'pending' ? 'Pending...' : 'Approved ✓'}
            </div>
          )}
        </motion.div>
      )}

      {/* Withdrawal Card */}
      <motion.div 
        variants={itemVariants}
        style={{ 
          padding: '20px', borderRadius: '24px', marginBottom: '16px',
          background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1), rgba(0, 209, 255, 0.05))',
          border: '1px solid rgba(0, 255, 157, 0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '44px', height: '44px', borderRadius: '14px', 
            background: 'rgba(0, 255, 157, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <IndianRupee size={22} color="var(--neon-green)" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>REFERRAL BONUS</div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'white' }}>₹{(user?.total_referral_bonus || 0).toLocaleString('en-IN')}</div>
          </div>
        </div>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onOpenWithdrawal}
          style={{ 
            background: 'var(--neon-green)', color: 'black', border: 'none',
            padding: '10px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: '800',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 4px 15px rgba(0, 255, 157, 0.3)'
          }}
        >
          <Wallet size={16} /> Withdraw Bonus
        </motion.button>
      </motion.div>

      {/* Transaction History Card */}
      <motion.div 
        variants={itemVariants}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenWithdrawalHistory}
        style={{ 
          padding: '20px', borderRadius: '24px', marginBottom: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px', 
            background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Clock size={20} color="var(--text-muted)" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'white' }}>Transaction History</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>View your payout logs & status</div>
          </div>
        </div>
        <ChevronRight size={18} opacity={0.3} />
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
