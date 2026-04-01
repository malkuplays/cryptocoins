import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  TrendingUp,
  Zap,
  Globe,
  ShieldCheck,
  Layers,
  Activity,
  Users,
  Timer,
  ExternalLink,
  ChevronRight,
  Star,
  Lock,
  ArrowUpRight,
  Map
} from 'lucide-react';
import { triggerHaptic } from '../telegram';

const LandingPage = ({ onNext, onRoadmap }) => {
  const [activeActivity, setActiveActivity] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 4, m: 22, s: 15 });

  const activities = [
    "🐋 New Whale joined from Dubai (10,000 YETC)",
    "🚀 Phase 1 Airdrop: 94.2% Allocated",
    "✅ Verified Contract: Institutional Grade",
    "💎 User 0x...42 claimed 1,200 YETC Bonus",
    "🔥 Listing Price Target: $10.00 USD"
  ];

  useEffect(() => {
    const activityInterval = setInterval(() => {
      setActiveActivity(prev => (prev + 1) % activities.length);
    }, 4000);

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);

    return () => {
      clearInterval(activityInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const handleStart = () => {
    triggerHaptic('impact');
    onNext();
  };

  const handleRoadmap = () => {
    triggerHaptic('selection');
    onRoadmap();
  };

  const trendingCoins = [
    { name: 'BTC', price: '$68,432', change: '+2.4%', color: '#F7931A' },
    { name: 'ETH', price: '$3,842', change: '+1.8%', color: '#627EEA' },
    { name: 'SOL', price: '$144.2', change: '+5.2%', color: '#14F195' },
    { name: 'YETC', price: '$10.00', change: '+12.4%', color: 'var(--neon-green)' }
  ];

  return (
    <div className="app-container" style={{ overflowX: 'hidden' }}>
      {/* Top Professional Ticker */}
      <div style={{ 
        height: '40px', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid var(--glass-border)',
        display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'fixed', top: 0, width: '100%', zIndex: 1001
      }}>
        <motion.div 
          animate={{ x: [0, -500] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ display: 'flex', gap: '40px', whiteSpace: 'nowrap', padding: '0 20px' }}
        >
          {[...trendingCoins, ...trendingCoins].map((coin, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '800' }}>
              <span style={{ color: coin.color }}>{coin.name}</span>
              <span>{coin.price}</span>
              <span style={{ color: coin.change.startsWith('+') ? 'var(--neon-green)' : 'var(--fomo-red)', fontSize: '10px' }}>{coin.change}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating Activity Feed (FOMO) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeActivity}
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.9 }}
          className="live-activity-chip"
          style={{ top: 'calc(env(safe-area-inset-top) + 60px)', right: '16px' }}
        >
          <div className="live-dot" style={{ width: '4px', height: '4px' }} />
          <span style={{ fontWeight: '700' }}>{activities[activeActivity]}</span>
        </motion.div>
      </AnimatePresence>

      <header className="app-header" style={{ top: '40px' }}>
        <div className="header-logo-group">
          <div className="icon-box-v2" style={{ width: '40px', height: '40px' }}>
            <img src="/logo.svg" alt="Y" style={{ width: '24px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '900', fontSize: '16px', letterSpacing: '1px' }}>YETCOIN</span>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
               CORE PROTOCOL <span style={{ color: 'var(--premium-blue)' }}>v1.0</span>
            </div>
          </div>
        </div>
        <div className="live-badge" style={{ background: 'var(--neon-green-dim)', color: 'var(--neon-green)' }}>
          <Globe size={12} /> GLOBAL ICO
        </div>
      </header>

      <div className="container" style={{ paddingTop: '160px', paddingBottom: '120px' }}>
        
        {/* Institutional Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}
        >
          <div className="badge-outline" style={{ background: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <ShieldCheck size={14} style={{ marginRight: '6px' }} /> INSTUTIONAL-GRADE PROTOCOL
          </div>
        </motion.div>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginBottom: '24px', position: 'relative' }}
          >
            <img src="/logo.svg" alt="Logo" style={{ width: '130px', height: '130px', filter: 'drop-shadow(0 0 40px var(--neon-green-glow))' }} />
            <div style={{ 
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
              width: '180px', height: '180px', background: 'radial-gradient(circle, var(--neon-green-glow) 0%, transparent 70%)',
              zIndex: -1, opacity: 0.4
            }} />
          </motion.div>

          <h1 className="hero-title" style={{ fontSize: '46px', marginBottom: '12px' }}>
            The Next <br />
            <span style={{ color: 'var(--neon-green)' }}>Bitcoin</span> Is Here.
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Don't miss the 2024 generational wealth event. Secure your Phase 1 airdrop before exchange listing.
          </p>

          {/* FOMO Counter */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '40px', background: 'rgba(255, 77, 77, 0.03)', borderColor: 'rgba(255, 77, 77, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
               <div style={{ fontSize: '12px', fontWeight: '900', color: 'var(--fomo-red)', letterSpacing: '1px' }}>
                 PHASE 1 CLOSING SOON
               </div>
               <div style={{ fontSize: '13px', fontWeight: '900', color: 'white' }}>
                 94.2% FULL
               </div>
            </div>
            <div className="progress-container" style={{ margin: '0 0 16px' }}>
               <motion.div 
                 initial={{ width: '0%' }}
                 animate={{ width: '94.2%' }}
                 transition={{ duration: 2, delay: 0.5 }}
                 className="progress-bar-fill" 
               />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: 'white' }}>0{timeLeft.h}</span>
                  <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)' }}>HOURS</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: 'white' }}>{timeLeft.m < 10 ? `0${timeLeft.m}` : timeLeft.m}</span>
                  <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)' }}>MINS</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: 'white' }}>{timeLeft.s < 10 ? `0${timeLeft.s}` : timeLeft.s}</span>
                  <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)' }}>SECS</div>
                </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="btn-primary pulse-primary"
              onClick={handleStart}
              style={{ padding: '20px' }}
            >
              Secure Allocation <ArrowRight size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="btn-secondary"
              onClick={handleRoadmap}
              style={{ padding: '18px', background: 'rgba(255,255,255,0.02)' }}
            >
              View System Roadmap <Map size={18} style={{ marginLeft: '8px' }} />
            </motion.button>
          </div>
        </div>

        {/* Professional Comparison Section */}
        <div style={{ marginBottom: '48px' }}>
           <h2 style={{ fontSize: '20px', fontWeight: '900', textAlign: 'center', marginBottom: '24px' }}>
             Why <span className="glow-text-green">YETCOIN</span>?
           </h2>
           <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(255,255,255,0.05)', padding: '12px 16px', fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)' }}>
                 <span>METRIC</span>
                 <span style={{ textAlign: 'center' }}>BITCOIN</span>
                 <span style={{ textAlign: 'right', color: 'var(--neon-green)' }}>YETCOIN</span>
              </div>
              {[
                { label: 'Entry Price', btc: '$0.008', yetc: '$10.00', color: 'var(--neon-green)' },
                { label: 'Staking APY', btc: 'None', yetc: '~100%', color: 'var(--premium-purple)' },
                { label: 'Growth Potential', btc: 'Market Cap', yetc: '10,000x+', color: 'var(--premium-blue)' }
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', fontWeight: '700' }}>
                   <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                   <span style={{ textAlign: 'center', opacity: 0.6 }}>{row.btc}</span>
                   <span style={{ textAlign: 'right', color: row.color }}>{row.yetc}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Social Proof Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div className="step-card-v2" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
            <Users size={20} color="var(--premium-blue)" />
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>1.4M+</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>ACTIVE MINERS</div>
            </div>
          </div>
          <div className="step-card-v2" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
            <Activity size={20} color="var(--neon-green)" />
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>$10.00</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>TGE TARGET</div>
            </div>
          </div>
        </div>

        {/* Footer Trust */}
        <div style={{ textAlign: 'center', opacity: 0.4, fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <Lock size={12} /> SECURE CRYPTOGRAPHY
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <ShieldCheck size={12} /> ANTI-WHALE PROTECTION
              </div>
           </div>
           <p>© 2024 YETCOIN CORE. ALL RIGHTS RESERVED.</p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;


