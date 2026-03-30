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
  ChevronRight,
  Check
} from 'lucide-react';
import { triggerHaptic } from '../telegram';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState({ days: 14, hours: 12, mins: 36, secs: 6 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
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
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const renderStep = () => {
    switch(step) {
      case 0: // Step 1: Network Effect
        return (
          <motion.div 
            key="step0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: '100%' }}
          >
            <motion.h2 variants={itemVariants} style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '2px', marginBottom: '32px' }}>
              THE NETWORK EFFECT IS UNSTOPPABLE
            </motion.h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <ShieldCheck size={20} />, label: "TOTAL VALUE LOCKED", val: "$42.5", unit: "M", sub: "Growing 12.4% weekly", color: 'var(--premium-blue)' },
                { icon: <Users size={20} />, label: "ACTIVE TOKEN HOLDERS", val: "148", unit: "K+", sub: "+2,000 upgrades daily", color: 'var(--neon-green)' },
                { icon: <Activity size={20} />, label: "DAILY PRE-MARKET VOL", val: "$12.8", unit: "M", sub: "Insane ecosystem velocity", color: 'var(--premium-orange)' }
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} className="step-card" whileTap={{ scale: 0.98 }}>
                  <div className="step-icon-box" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    {stat.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>{stat.label}</div>
                    <div style={{ fontSize: '11px', color: stat.color, fontWeight: '700', marginTop: '2px' }}>
                      <span style={{ fontSize: '14px', marginRight: '2px' }}>•</span> {stat.sub}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '32px', fontWeight: '900' }}>{stat.val}</span>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: stat.color }}>{stat.unit}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 1: // Step 2: Why Upgrade
        return (
          <motion.div 
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: '100%' }}
          >
            <motion.div variants={itemVariants} className="badge-outline" style={{ display: 'flex', margin: '0 auto 16px', color: 'var(--neon-green)', borderColor: 'rgba(0,255,157,0.1)' }}>
              THE PREMIUM ADVANTAGE
            </motion.div>
            <motion.h1 variants={itemVariants} style={{ fontSize: '34px', fontWeight: '900', textAlign: 'center', marginBottom: '12px' }}>
              Why You Must <span className="glow-text-green">Upgrade Now</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '32px', padding: '0 20px', color: 'var(--text-secondary)' }}>
              Free users get pennies. Premium members historically secure generational wealth. Unlock your stacks instantly.
            </motion.p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: <Zap size={18} fill="currentColor" />, title: "100x Airdrop Multipliers", desc: "Lock in massive multipliers for the upcoming $YETC Airdrop. Avoid dilution.", color: 'var(--premium-orange)' },
                { icon: <TrendingUp size={18} />, title: "First-Mover Advantage", desc: "Secure the lowest entry point before Tier 1 Exchange listings.", color: 'var(--neon-green)' },
                { icon: <Clock size={18} />, title: "Instant Daily Yield", desc: "Passively accrue $YETC inside your app starting today.", color: 'var(--premium-blue)' },
                { icon: <Users size={18} />, title: "The VIP Inner Circle", desc: "Unlock the private Alpha channel and direct core team line.", color: 'var(--premium-purple)' },
              ].map((item, i) => (
                <motion.div key={i} variants={itemVariants} className="step-card" style={{ padding: '16px', gap: '16px' }} whileTap={{ scale: 0.98 }}>
                  <div className="step-icon-box" style={{ width: '40px', height: '40px', background: item.color, color: '#000', borderRadius: '10px' }}>
                    {item.icon}
                  </div>
                  <div className="step-content">
                    <h3 style={{ fontSize: '15px' }}>{item.title}</h3>
                    <p style={{ fontSize: '13px', marginTop: '2px' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 2: // Step 3: Critical Deadline
        return (
          <motion.div 
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: '100%', textAlign: 'center' }}
          >
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.2)', padding: '8px 20px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={16} color="var(--fomo-red)" />
                <span style={{ color: 'var(--fomo-red)', fontSize: '12px', fontWeight: '900', letterSpacing: '1px' }}>CRITICAL DEADLINE</span>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} style={{ fontSize: '38px', fontWeight: '900', marginBottom: '12px' }}>
              The <span className="glow-text-red">Largest Airdrop</span> Ends Soon
            </motion.h1>
            <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', marginBottom: '40px', padding: '0 20px' }}>
              The official $YETC allocation snapshot is closing. Unclaimed tokens will be burned forever.
            </motion.p>

            <motion.div variants={itemVariants} className="countdown-grid" style={{ marginBottom: '40px' }}>
              {[
                { val: countdown.days, label: "DAYS" },
                { val: countdown.hours, label: "HOURS" },
                { val: countdown.mins, label: "MINS" },
                { val: countdown.secs, label: "SECS" }
              ].map((t, i) => (
                <div key={i} className="timer-box">
                  <span className="timer-val">{String(t.val).padStart(2, '0')}</span>
                  <span className="timer-label">{t.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
              <div className="timer-box" style={{ textAlign: 'left', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--neon-green)' }}>
                  <Users size={16} />
                  <span style={{ fontSize: '18px', fontWeight: '900' }}>148.5K+</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', marginTop: '4px' }}>CLAIMED SPOTS</div>
              </div>
              <div className="timer-box" style={{ textAlign: 'left', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--premium-orange)' }}>
                  <TrendingUp size={16} />
                  <span style={{ fontSize: '18px', fontWeight: '900' }}>89%</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', marginTop: '4px' }}>CAPACITY FULL</div>
              </div>
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              style={{ padding: '24px', background: 'linear-gradient(90deg, #FF0000, #FF5C00)', boxShadow: '0 0 20px rgba(255,0,0,0.4)', fontSize: '18px' }} 
              onClick={nextStep}
            >
              CLAIM YOUR SPOT NOW
            </motion.button>
          </motion.div>
        );

      case 3: // Step 4: Tier Selection
        return (
          <motion.div 
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <motion.h1 variants={itemVariants} style={{ fontSize: '36px', fontWeight: '900', textAlign: 'center', marginBottom: '8px' }}>
              Upgrade Tier
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-secondary)' }}>
              Unlock your maximum earning potential.
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { name: "Starter", price: "₹1,000", active: true },
                { name: "Pro", price: "₹2,999", badge: "BEST VALUE" },
                { name: "Elite", price: "₹6,999" }
              ].map((tier, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants} 
                  className={`pricing-item ${tier.active ? 'active' : ''}`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => triggerHaptic('selection')}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800' }}>{tier.name}</span>
                    {tier.badge && <span className="benefit-pill">{tier.badge}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '900' }}>{tier.price}</span>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid' + (tier.active ? ' var(--premium-blue)' : ' var(--glass-border)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {tier.active && <div style={{ width: '12px', height: '12px', background: 'var(--premium-blue)', borderRadius: '50%' }} />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
               <ShieldCheck size={20} color="var(--neon-green)" />
               <span style={{ fontWeight: '800', fontSize: '17px' }}>Starter Benefits</span>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '0 8px', marginBottom: '40px' }}>
              {[
                "Access to basic features",
                "Standard referral bonuses",
                "Community group access",
                "Email support"
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '15px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,255,157,0.1)', border: '1px solid var(--neon-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--neon-green)" strokeWidth={3} />
                  </div>
                  {b}
                </div>
              ))}
            </motion.div>
            
            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              onClick={onComplete}
            >
              CLAIM YOUR MULTIPLIERS <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        );

      default: return null;
    }
  };

  return (
    <div className="app-container" style={{ padding: 'calc(env(safe-area-inset-top) + 40px) 20px env(safe-area-inset-bottom)' }}>
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      {/* Persistence Controls */}
      <div style={{ margin: 'auto 0 40px', width: '100%' }}>
        <div className="step-indicator" style={{ marginBottom: '40px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`step-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
        
        {step < 2 && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="btn-primary" 
            style={{ 
              background: 'var(--neon-green)',
              color: '#000',
              fontWeight: '900',
              padding: '20px'
            }} 
            onClick={nextStep}
          >
            Continue
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
