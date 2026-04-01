import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Globe,
  ShieldCheck,
  Layers,
  Activity,
  Users,
  Timer,
  ChevronRight,
  Lock,
  Hexagon,
  Cpu,
  BarChart2,
  Zap,
  TrendingUp
} from 'lucide-react';
import { triggerHaptic } from '../telegram';

const LandingPage = ({ onNext, onRoadmap }) => {
  const [activeActivity, setActiveActivity] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 4, m: 22, s: 15 });

  const testimonials = [
    { user: "@whale_watcher", text: "The most transparent protocol I've used this year.", platform: "X" },
    { user: "@sol_alpha", text: "YETC is the only gem I'm holding through 2024.", platform: "X" },
    { user: "@node_runner", text: "Aggressive yields, institutional-grade security. Top tier.", platform: "Discord" }
  ];

  const activities = [
    { text: "Whale joined from Dubai (10K+ YETC)", icon: <Zap size={14} color="var(--neon-green)" /> },
    { text: "Phase 1 Airdrop: 94.2% Allocated", icon: <BarChart2 size={14} color="var(--premium-blue)" /> },
    { text: "Smart Contract Audited successfully", icon: <ShieldCheck size={14} color="var(--neon-green)" /> },
    { text: "User 0x...42 claimed 1,200 Bonus", icon: <Hexagon size={14} color="var(--premium-purple)" /> },
    { text: "Live APR spiked to 14,240%", icon: <Activity size={14} color="var(--fomo-red)" /> }
  ];

  useEffect(() => {
    const activityInterval = setInterval(() => {
      setActiveActivity(prev => (prev + 1) % activities.length);
    }, 3500);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

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
      clearInterval(testimonialInterval);
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

  const trustedPartners = [
    { name: 'CertiK', icon: <ShieldCheck size={16} /> },
    { name: 'Binance Labs', icon: <Layers size={16} /> },
    { name: 'Polygon', icon: <Hexagon size={16} /> },
    { name: 'Animoca Brands', icon: <Cpu size={16} /> }
  ];

  return (
    <div className="app_container" style={{ overflowX: 'hidden', background: '#030305' }}>
      
      {/* 1. Ultra-Premium Header */}
      <header className="app-header" style={{ 
        top: 0, height: 'calc(64px + 100px)', background: 'rgba(3, 3, 5, 0.9)', 
        borderBottom: '1px solid rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', padding: '100px 24px 0' 
      }}>
        <div className="header-logo-group">
          <div className="icon-box-v2" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
            <img src="/logo.svg" alt="Y" style={{ width: '20px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '900', fontSize: '13px', letterSpacing: '1px', color: '#fff' }}>YETCOIN</span>
            <div style={{ fontSize: '8px', fontWeight: '800', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '1px' }}>
               CORE v1.0
            </div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
           <div className="live-badge" style={{ background: 'rgba(0, 209, 255, 0.1)', color: 'var(--premium-blue)', border: '1px solid rgba(0, 209, 255, 0.2)', fontSize: '9px', padding: '4px 8px' }}>
             <Globe size={8} /> NETWORK LIVE
           </div>
        </div>
      </header>

      {/* 2. Market Ticker - Positioned Just Below Header */}
      <div style={{ 
        height: '32px', background: 'rgba(5, 5, 8, 1)', borderBottom: '1px solid rgba(255,255,255,0.02)',
        display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'fixed', top: 'calc(64px + 100px)', width: '100%', zIndex: 1001,
        backdropFilter: 'blur(10px)'
      }}>
        <motion.div 
          animate={{ x: [0, -600] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          style={{ display: 'flex', gap: '44px', whiteSpace: 'nowrap', padding: '0 20px' }}
        >
          {[...trendingCoins, ...trendingCoins, ...trendingCoins].map((coin, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: '800', fontFamily: 'monospace' }}>
              <span style={{ color: coin.color, opacity: 0.8 }}>{coin.name}</span>
              <span style={{ color: '#fff' }}>{coin.price}</span>
              <span style={{ color: coin.change.startsWith('+') ? 'var(--neon-green)' : 'var(--fomo-red)', opacity: 0.9, letterSpacing: '0.5px' }}>{coin.change}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="container" style={{ paddingTop: 'calc(160px + 100px)', paddingBottom: '100px' }}>
        
        {/* 3. High-Impact Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 32px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {/* Pulsing Core Animation */}
            <motion.div 
              animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', width: '100%', height: '100%', border: '1px dashed rgba(0,255,157,0.3)', borderRadius: '50%' }}
            />
            <motion.div 
              animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', width: '80%', height: '80%', border: '1px solid rgba(0,255,157,0.1)', borderRadius: '50%' }}
            />
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', width: '60%', height: '60%', background: 'var(--neon-green)', filter: 'blur(30px)', borderRadius: '50%' }}
            />
            <img src="/logo.svg" alt="YETCOIN" style={{ width: '60px', position: 'relative', zIndex: 10, filter: 'drop-shadow(0 0 20px rgba(0,255,157,0.5))' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1.05', color: '#fff', marginBottom: '16px' }}>
              The Next<br/>Generation of<br/>
              <span style={{ background: 'linear-gradient(90deg, #00FF9D, #00D1FF)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Digital Wealth</span>
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '300px', margin: '0 auto 32px', lineHeight: '1.6', fontWeight: '500' }}>
              Institutional-grade automated yields. Secure your allocation before the global Tier-1 exchange listing.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 10px' }}>
            <button className="btn-primary pulse-primary" onClick={handleStart} style={{ padding: '20px', borderRadius: '16px', fontSize: '16px', letterSpacing: '0.5px' }}>
              Secure Allocation <ArrowRight size={18} />
            </button>
            <button onClick={handleRoadmap} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '16px', fontSize: '14px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              View Protocol Architecture <ChevronRight size={16} />
            </button>
          </motion.div>
        </div>

        {/* 4. "Trusted By" Strip (Social Proof) */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginBottom: '40px', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: '800', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase' }}>
            Infrastructure Partners
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', opacity: 0.6 }}>
            {trustedPartners.map((partner, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '13px', fontWeight: '700' }}>
                {partner.icon} {partner.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 5. Modern Bento Box Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bento-grid" style={{ marginBottom: '40px' }}>
          
          {/* Main FOMO Countdown Box */}
          <div className="bento-item bento-large" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'var(--glass-border-bright)', padding: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Timer size={16} color="var(--neon-green)" />
                   <span style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '1px', color: '#fff', textTransform: 'uppercase' }}>Phase 1 Closing</span>
                </div>
                <div style={{ background: 'var(--neon-green-dim)', color: 'var(--neon-green)', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '900' }}>
                   94.2% FULL
                </div>
             </div>
             <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginBottom: '24px' }}>
                {[ { v: timeLeft.h, l: 'HOURS' }, { v: timeLeft.m, l: 'MINS' }, { v: timeLeft.s, l: 'SECS' } ].map((t, i) => (
                  <div key={i} style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px 0', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', fontFamily: 'monospace', letterSpacing: '-2px' }}>
                       {t.v < 10 ? `0${t.v}` : t.v}
                     </div>
                     <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px', marginTop: '4px' }}>{t.l}</div>
                  </div>
                ))}
             </div>
             <div className="progress-container" style={{ margin: 0, height: '6px', background: 'rgba(255,255,255,0.1)' }}>
                <motion.div initial={{ width: '0%' }} animate={{ width: '94.2%' }} transition={{ duration: 2, delay: 1 }} style={{ height: '100%', background: 'var(--neon-green)', borderRadius: '100px', boxShadow: '0 0 10px var(--neon-green)' }} />
             </div>
          </div>

          {/* NEW: Live Growth Chart Card (Large) */}
          <div className="bento-item bento-large" style={{ background: 'rgba(0,255,157,0.02)', padding: '24px', position: 'relative' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                   <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--neon-green)', letterSpacing: '1.5px', marginBottom: '4px' }}>
                      YETC / USD MOMENTUM
                   </div>
                   <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>$10.00 <span style={{ color: 'var(--neon-green)', fontSize: '14px' }}>+1,240%</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <Activity size={20} color="var(--neon-green)" />
                </div>
             </div>
             <div style={{ height: '80px', width: '100%', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                   <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="var(--neon-green)" stopOpacity="0.2" />
                         <stop offset="100%" stopColor="var(--neon-green)" stopOpacity="0" />
                      </linearGradient>
                   </defs>
                   <motion.path
                       d="M0,80 Q50,70 80,90 T140,40 T220,60 T300,10"
                       fill="none"
                       stroke="var(--neon-green)"
                       strokeWidth="3"
                       initial={{ pathLength: 0 }}
                       animate={{ pathLength: 1 }}
                       transition={{ duration: 2.5, ease: "easeInOut" }}
                   />
                   <path d="M0,80 Q50,70 80,90 T140,40 T220,60 T300,10 V100 H0 Z" fill="url(#chartGradient)" />
                </svg>
             </div>
          </div>

          {/* Stat Box 1 */}
          <div className="bento-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px' }}>
             <Users size={18} color="var(--premium-blue)" style={{ marginBottom: '12px' }} />
             <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>1.4M+</div>
             <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.5px', marginTop: '4px' }}>ACTIVE MINERS</div>
          </div>

          {/* NEW: Testimonial Card (Small) */}
          <div className="bento-item" style={{ background: 'rgba(157,80,187,0.03)', padding: '20px' }}>
             <div style={{ fontSize: '8px', fontWeight: '900', color: 'var(--premium-purple)', letterSpacing: '1px', marginBottom: '8px' }}>USER VERDICT</div>
             <div style={{ height: '44px', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    style={{ fontSize: '11px', fontWeight: '600', color: '#fff', fontStyle: 'italic', lineHeight: '1.4' }}
                   >
                     "{testimonials[activeTestimonial].text}"
                  </motion.div>
                </AnimatePresence>
             </div>
             <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={8} /> {testimonials[activeTestimonial].user}
             </div>
          </div>

          {/* Stat Box 2 */}
          <div className="bento-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px' }}>
             <TrendingUp size={18} color="var(--premium-purple)" style={{ marginBottom: '12px' }} />
             <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>14.2K%</div>
             <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.5px', marginTop: '4px' }}>MOCK NETWORK APY</div>
          </div>

          {/* Embedded Live Activity Feed (High Tech Terminal look) */}
          <div className="bento-item bento-large" style={{ background: 'rgba(0,10,5,0.5)', borderColor: 'rgba(0,255,157,0.1)', padding: '20px' }}>
             <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--neon-green)', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="live-dot" style={{ width: '6px', height: '6px', background: 'var(--neon-green)', boxShadow: '0 0 8px var(--neon-green)' }} /> 
                PROTOCOL EVENT LOG
             </div>
             <div style={{ height: '40px', overflow: 'hidden', position: 'relative' }}>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeActivity}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}
                  >
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '8px' }}>
                       {activities[activeActivity].icon}
                    </div>
                    {activities[activeActivity].text}
                  </motion.div>
                </AnimatePresence>
             </div>
          </div>

        </motion.div>

        {/* Footer */}
        <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Lock size={12} /> ENTERPRISE SECURITY
              </div>
           </div>
           <p style={{ fontWeight: '500' }}>© 2024 YETCOIN CORE TECHNOLOGIES. ALL RIGHTS RESERVED.</p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;


