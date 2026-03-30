import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Users, 
  ArrowRight,
  Clock,
  Flame,
  ShieldCheck,
  Activity,
  Check,
  Star,
  Trophy,
  Crown
} from 'lucide-react';
import { triggerHaptic } from '../telegram';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 2, mins: 14, secs: 42 });
  const [spotsLeft, setSpotsLeft] = useState(142);
  const [selectedTier, setSelectedTier] = useState(1); // 0: Starter, 1: Founder, 2: Whale

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);

    const spotsTimer = setInterval(() => {
      setSpotsLeft(prev => prev > 12 ? prev - Math.floor(Math.random() * 2) : prev);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(spotsTimer);
    };
  }, []);

  const nextStep = () => {
    triggerHaptic('impact');
    if (step < 3) setStep(s => s + 1);
    else {
      triggerHaptic('notification_success');
      onComplete();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.08,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const renderStep = () => {
    switch(step) {
      case 0: // THE MOMENTUM (Bento Stats)
        return (
          <motion.div 
            key="step0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: '100%' }}
          >
            <motion.div variants={itemVariants} className="badge-outline" style={{ display: 'flex', margin: '0 auto 12px' }}>
              PROTOCOL STATUS: OPERATIONAL
            </motion.div>
            <motion.h1 variants={itemVariants} style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px', fontWeight: '900' }}>
              The momentum is <span className="text-gradient">Unstoppable</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Join 1.4M+ visionaries securing the future of Yetcoins.
            </motion.p>
            
            <div className="bento-grid">
              <motion.div variants={itemVariants} className="bento-item bento-large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="stat-label">TOTAL PROTOCOL VALUE</div>
                    <div className="stat-value" style={{ fontSize: '42px', marginTop: '8px' }}>$142<span style={{ fontSize: '24px' }}>M+</span></div>
                  </div>
                  <div className="live-badge">
                    <div className="live-dot" /> LIVE
                  </div>
                </div>
                <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--neon-green)', fontWeight: '700' }}>
                  ↑ 12.4% last 24h
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-item">
                <Users size={18} color="var(--premium-blue)" style={{ marginBottom: '12px' }} />
                <div className="stat-label">HOLDERS</div>
                <div className="stat-value" style={{ fontSize: '24px' }}>1.4M</div>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-item">
                <TrendingUp size={18} color="var(--premium-orange)" style={{ marginBottom: '12px' }} />
                <div className="stat-label">MKT CAP</div>
                <div className="stat-value" style={{ fontSize: '24px' }}>$1.2B</div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 1: // THE ADVANTAGE (Elite Privileges)
        return (
          <motion.div 
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: '100%' }}
          >
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Star size={32} color="var(--premium-blue)" fill="var(--premium-blue)" style={{ opacity: 0.5 }} />
            </motion.div>
            <motion.h1 variants={itemVariants} style={{ fontSize: '34px', textAlign: 'center', marginBottom: '12px', fontWeight: '900' }}>
              Elite <span style={{ color: 'var(--premium-blue)' }}>Privileges</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-secondary)' }}>
              Why do 92% of early members upgrade to Founder?
            </motion.p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <Zap size={20} />, title: "300% Yield Boost", desc: "Triple your daily $YETC mining output instantly.", color: '#00FF9D' },
                { icon: <ShieldCheck size={20} />, title: "Exit Protection", desc: "Guaranteed buy-back at pre-launch floor price.", color: '#00D1FF' },
                { icon: <Trophy size={20} />, title: "VC Alfa Access", desc: "Direct allocations in Tier 1 Solana & TON projects.", color: '#FFB800' }
              ].map((item, i) => (
                <motion.div key={i} variants={itemVariants} className="step-card" style={{ padding: '18px', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: '#fff' }}>{item.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 2: // THE URGENCY (Live Scarcity)
        return (
          <motion.div 
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: '100%', textAlign: 'center' }}
          >
            <motion.div variants={itemVariants} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.2)', borderRadius: '100px', marginBottom: '24px' }}>
              <Flame size={16} color="var(--fomo-red)" />
              <span style={{ color: 'var(--fomo-red)', fontSize: '11px', fontWeight: '900', letterSpacing: '1px' }}>DEMAND: AT CAPACITY</span>
            </motion.div>

            <motion.h1 variants={itemVariants} style={{ fontSize: '38px', fontWeight: '900', marginBottom: '12px', lineHeight: 1.1 }}>
              Only <span className="glow-text-red">{spotsLeft} Slots</span> Remaining
            </motion.h1>
            <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              The pre-launch snapshot is approaching. Once global slots are filled, public access closes.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '40px' }}>
              {[
                { val: countdown.hours, label: "HRS" },
                { val: countdown.mins, label: "MINS" },
                { val: countdown.secs, label: "SECS" }
              ].map((t, i) => (
                <div key={i} className="timer-box" style={{ padding: '12px 8px' }}>
                  <span className="timer-val conversion-timer" style={{ fontSize: '32px' }}>{String(t.val).padStart(2, '0')}</span>
                  <span className="timer-label" style={{ fontSize: '9px' }}>{t.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="glass" style={{ padding: '20px', textAlign: 'left', borderLeft: '4px solid var(--fomo-red)' }}>
              <div style={{ fontSize: '12px', color: 'var(--fomo-red)', fontWeight: '900', marginBottom: '4px' }}>SYSTEM ALERT</div>
              <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>High traffic detected. 42 users currently viewing this slot.</div>
            </motion.div>
          </motion.div>
        );

      case 3: // THE SELECTION (Membership Passes)
        return (
          <motion.div 
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <motion.h1 variants={itemVariants} style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px', fontWeight: '900' }}>
              Select Your <span className="text-gradient">Access Pass</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-secondary)' }}>
              One-time payment. Lifetime elite protocol access.
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { name: "Starter Pass", price: "₹1,000", badge: "BASIC", icon: <Star size={18} /> },
                { name: "Founder Pass", price: "₹2,999", badge: "BEST VALUE", icon: <Trophy size={18} />, active: true, color: 'var(--neon-green)' },
                { name: "Whale Pass", price: "₹6,999", badge: "MAX YIELD", icon: <Crown size={18} />, color: '#FFB800', isWhale: true }
              ].map((tier, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants} 
                  className={`pass-card ${tier.isWhale ? 'whale' : ''} ${selectedTier === i ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTier(i);
                    triggerHaptic('selection');
                  }}
                >
                  <div className="metallic-shine" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ color: tier.color || 'var(--text-secondary)' }}>{tier.icon}</div>
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: '900', color: '#fff' }}>{tier.name}</div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ fontSize: '12px', color: tier.color || 'var(--text-muted)', fontWeight: '800' }}>{tier.badge}</span>
                        {tier.active && <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', padding: '2px 4px', borderRadius: '4px' }}>RECOMMENDED</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '900' }}>{tier.price}</div>
                    <div className="pass-check">
                      {selectedTier === i && <Check size={14} strokeWidth={4} />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="glass" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,255,157,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Zap size={20} color="var(--neon-green)" />
                 </div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '14px', fontWeight: '800' }}>Instant Mining Unlock</div>
                   <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>You will receive an immediate bonus of 5,000 $YETC upon activation.</div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        );

      default: return null;
    }
  };

  return (
    <div className="app-container" style={{ padding: 'calc(env(safe-area-inset-top) + 125px) 20px env(safe-area-inset-bottom)' }}>
      <div className="mesh-background" />
      
      {/* Progress Line */}
      <div style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top) + 145px)', left: '20px', right: '20px', zIndex: 100 }}>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', width: '100%', borderRadius: '4px' }}>
          <motion.div 
            initial={{ width: '25%' }}
            animate={{ width: `${(step + 1) * 25}%` }}
            style={{ height: '100%', background: 'var(--neon-green)', borderRadius: '4px', boxShadow: '0 0 10px var(--neon-green-glow)' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      <div style={{ margin: 'auto 0 40px', width: '100%' }}>
        <motion.button 
          whileTap={{ scale: 0.96 }}
          className="btn-primary" 
          onClick={nextStep}
          style={{ height: '64px' }}
        >
          {step === 3 ? 'ACTIVATE MY ACCOUNT' : 'CONTINUE'}
          <ArrowRight size={20} />
        </motion.button>
        
        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px', fontWeight: '600', letterSpacing: '0.5px' }}>
          SECURE ENCRYPTED PROTOCOL ENTRY • VER 2.4.0
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
