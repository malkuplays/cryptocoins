import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Coins, 
  Zap, 
  Timer, 
  ShieldCheck,
  RefreshCw,
  ArrowUpRight,
  Lock,
  Gem,
  BarChart3,
  Sparkles,
  Clock,
  Activity,
  Wallet,
  Gift
} from 'lucide-react';
import { supabase } from '../supabase';
import { useSettings } from '../SettingsContext';



const TIER_DISPLAY = {
  whale:   { label: 'Whale', color: '#FFD700', icon: '🐋' },
  pro:     { label: 'Pro',   color: '#00D1FF', icon: '⚡' },
  starter: { label: 'Starter', color: '#00FF9D', icon: '🚀' },
  free:    { label: 'Free',  color: '#626C7A', icon: '🏁' },
};

const Dashboard = ({ user, setUser, setActiveTab }) => {
  const [balance, setBalance] = useState(user?.mining_balance || 0);
  const [syncing, setSyncing] = useState(false);
  const [miningRate, setMiningRate] = useState(0);
  const [sessionEarned, setSessionEarned] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [lastSynced, setLastSynced] = useState(new Date());

  const balanceRef = useRef(user?.mining_balance || 0);
  const { yetcPriceUsd, miningRates } = useSettings();

  const tier = user?.plan_tier || 'free';
  const tierDisplay = TIER_DISPLAY[tier] || TIER_DISPLAY.free;
  const tierRates = miningRates[tier] || { min: 5, max: 10 };
  const tierConfig = { ...tierDisplay, ...tierRates };
  const stakingYears = user?.staking_years || 0;

  // NEW: Secure Server-Side Sync
  // This calculates the drift since the last database update and returns the TRUE balance.
  const syncWithServer = useCallback(async (isInitial = false) => {
    if (syncing || !user?.id) return;
    setSyncing(true);
    try {
      const { data, error } = await supabase.rpc('sync_mining_progress');
      if (error) throw error;
      
      if (data) {
        setBalance(data.mining_balance);
        balanceRef.current = data.mining_balance;
        setUser(data);
        setLastSynced(new Date());
        
        // Use average of tier rates for the visual live tick
        const avgRate = (tierRates.min + tierRates.max) / 2;
        setMiningRate(avgRate);
      }
    } catch (err) {
      console.error('Mining sync error:', err);
    } finally {
      setSyncing(false);
      setInitialized(true);
    }
  }, [user?.id, syncing, tierRates]);

  // Initial Sync on mount
  useEffect(() => {
    if (!initialized) {
      syncWithServer(true);
    }
  }, [user?.id]);

  // Live visual-only mining tick
  // Increments the local state for UX, but syncs with DB periodically for truth.
  useEffect(() => {
    if (!initialized) return;
    
    const rate = miningRate || (tierRates.min + tierRates.max) / 2;
    const coinsPerSecond = rate / 3600; 
    
    const miningTimer = setInterval(() => {
      setBalance(prev => {
        balanceRef.current = prev + coinsPerSecond;
        return balanceRef.current;
      });
      setSessionEarned(prev => prev + coinsPerSecond);
    }, 1000);

    return () => clearInterval(miningTimer);
  }, [initialized, miningRate]);

  // Auto-sync with server every 10 minutes or on visibility change
  useEffect(() => {
    const syncTimer = setInterval(() => syncWithServer(), 600000); // 10 min
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncWithServer(); // Re-sync when user returns to app
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(syncTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncWithServer]);

  // Staking calculations
  const getStakingProgress = () => {
    if (!user?.staking_start || !user?.staking_end) return 0;
    const start = new Date(user.staking_start).getTime();
    const end = new Date(user.staking_end).getTime();
    const current = Date.now();
    return Math.min(100, Math.max(0, ((current - start) / (end - start)) * 100));
  };

  const getDaysRemaining = () => {
    if (!user?.staking_end) return stakingYears * 365;
    const diff = new Date(user.staking_end).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const usdValue = balance * yetcPriceUsd;
  const stakingProgress = getStakingProgress();
  const daysRemaining = getDaysRemaining();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      className="container" 
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 80px)', paddingBottom: '100px' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', padding: '0 4px' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>Welcome back</div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {user?.full_name || `@${user?.username || 'user'}`}
            {user?.is_verified && (
              <ShieldCheck size={18} fill="var(--premium-blue)" color="white" />
            )}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            padding: '6px 14px', borderRadius: '100px', 
            background: `${tierConfig.color}15`, 
            border: `1px solid ${tierConfig.color}40`,
            fontSize: '12px', fontWeight: '800', color: tierConfig.color,
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <span>{tierConfig.icon}</span> {tierConfig.label}
          </div>
          <div style={{ textAlign: 'right' }}>
            <button 
              onClick={() => syncWithServer()} 
              disabled={syncing}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}
            >
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>
                {syncing ? 'Syncing...' : `Synced ${Math.floor((Date.now() - lastSynced.getTime()) / 60000)}m ago`}
              </span>
              <motion.div animate={{ rotate: syncing ? 360 : 0 }} transition={{ repeat: syncing ? Infinity : 0, duration: 1, ease: 'linear' }}>
                <RefreshCw size={16} opacity={0.5} />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>


      {/* Main Balance Card */}
      <motion.div 
        variants={itemVariants}
        style={{ 
          marginBottom: '20px', textAlign: 'center', padding: '32px 20px 28px', 
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(145deg, rgba(14, 14, 20, 0.9), rgba(14, 14, 20, 0.6))',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '28px',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Glow effect */}
        <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '120px', background: 'var(--neon-green-glow)', filter: 'blur(60px)', opacity: 0.4, zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-green)', boxShadow: '0 0 10px var(--neon-green)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1.5px' }}>LIVE MINING</span>
          </div>

          <div style={{ fontSize: '42px', fontWeight: '900', lineHeight: '1', marginBottom: '6px', letterSpacing: '-1px' }}>
            {balance.toFixed(4)}
          </div>
          <div style={{ fontSize: '16px', color: 'var(--premium-blue)', fontWeight: '800', marginBottom: '16px' }}>
            $YETC
          </div>

          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(0,255,157,0.08)', padding: '8px 18px', 
            borderRadius: '100px', border: '1px solid rgba(0,255,157,0.15)'
          }}>
            <Wallet size={14} color="var(--neon-green)" />
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--neon-green)' }}>
              ≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Referral Bonus Card */}
      {(user?.total_referral_bonus > 0 || true) && (
        <motion.div variants={itemVariants} style={{
          marginBottom: '20px', 
          background: 'linear-gradient(145deg, rgba(0, 255, 157, 0.1), rgba(0, 209, 255, 0.05))',
          border: '1px solid rgba(0, 255, 157, 0.2)',
          borderRadius: '20px', padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0, 255, 157, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Gift size={20} color="var(--neon-green)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>REFERRAL BONUS</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--neon-green)' }}>
                ₹{(user?.total_referral_bonus || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab && setActiveTab('friends')}
            style={{ 
              background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.2)',
              color: 'var(--neon-green)', padding: '6px 14px', borderRadius: '100px',
              fontSize: '11px', fontWeight: '800'
            }}
          >
            Invite Friends
          </button>
        </motion.div>
      )}

      {/* Mining Stats Strip */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ 
          background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '20px', padding: '16px 12px', textAlign: 'center' 
        }}>
          <Activity size={18} color="var(--neon-green)" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>RATE</div>
          <div style={{ fontSize: '16px', fontWeight: '900' }}>{miningRate || '—'}/hr</div>
        </div>
        <div style={{ 
          background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '20px', padding: '16px 12px', textAlign: 'center' 
        }}>
          <Sparkles size={18} color="var(--premium-orange)" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>SESSION</div>
          <div style={{ fontSize: '16px', fontWeight: '900' }}>+{sessionEarned.toFixed(1)}</div>
        </div>
        <div style={{ 
          background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '20px', padding: '16px 12px', textAlign: 'center' 
        }}>
          <TrendingUp size={18} color="var(--premium-blue)" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>PRICE</div>
          <div style={{ fontSize: '16px', fontWeight: '900' }}>${yetcPriceUsd.toFixed(4)}</div>
        </div>
      </motion.div>

      {/* Staking Card */}
      <motion.div 
        variants={itemVariants}
        style={{ 
          marginBottom: '20px', padding: '24px',
          background: 'linear-gradient(145deg, rgba(157, 80, 187, 0.08), rgba(0, 209, 255, 0.05))',
          border: '1px solid rgba(157, 80, 187, 0.15)',
          borderRadius: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '14px', 
              background: 'rgba(157, 80, 187, 0.15)', border: '1px solid rgba(157, 80, 187, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Lock size={20} color="var(--premium-purple)" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Staking Period</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stakingYears}-Year Lock</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--premium-purple)' }}>{daysRemaining}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Days Left</div>
          </div>
        </div>

        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', marginBottom: '12px' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${stakingProgress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, #00d2ff, #9d50bb)', 
              borderRadius: '100px',
              boxShadow: '0 0 10px rgba(157, 80, 187, 0.4)'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>{stakingProgress.toFixed(1)}% Complete</span>
          <span>{stakingYears > 0 ? `${stakingYears * 365 - daysRemaining} / ${stakingYears * 365} Days` : 'Not started'}</span>
        </div>
      </motion.div>

      {/* Portfolio Stats */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ 
          background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '20px', padding: '20px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Gem size={16} color="var(--premium-purple)" />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>TIER</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', textTransform: 'capitalize' }}>{tier}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{tierConfig.min}-{tierConfig.max} YETC/hr</div>
        </div>
        <div style={{ 
          background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '20px', padding: '20px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <BarChart3 size={16} color="var(--neon-green)" />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>MULTIPLIER</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900' }}>{stakingYears === 7 ? '7.0x' : stakingYears === 5 ? '3.5x' : '1.0x'}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{stakingYears > 0 ? `${stakingYears}-yr stake bonus` : 'No stake'}</div>
        </div>
      </motion.div>

      {/* Market Info */}
      <motion.div 
        variants={itemVariants}
        style={{ 
          padding: '20px', borderRadius: '20px',
          background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)' }}>YETCOIN Market</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '100px', background: 'rgba(0,255,157,0.08)' }}>
            <ArrowUpRight size={12} color="var(--neon-green)" />
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--neon-green)' }}>+12.4%</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '900' }}>${yetcPriceUsd.toFixed(4)}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>1 $YETC = ₹{(yetcPriceUsd * 84).toFixed(0)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Market Cap</div>
            <div style={{ fontSize: '14px', fontWeight: '800' }}>$250M+</div>
          </div>
        </div>

        {/* Mini chart visual */}
        <div style={{ 
          marginTop: '16px', height: '48px', display: 'flex', alignItems: 'flex-end', gap: '3px',
          opacity: 0.4
        }}>
          {[35, 42, 38, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 88, 82, 92, 88, 95].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              style={{ 
                flex: 1, borderRadius: '2px',
                background: `linear-gradient(to top, var(--neon-green), rgba(0, 255, 157, 0.3))`
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
