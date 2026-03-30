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
  const [countdown, setCountdown] = useState({ days: 2, hours: 14, mins: 42, secs: 18 });
  const [activity, setActivity] = useState({ user: 'cryptoknight', action: 'just upgraded to WHALE' });

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

    const activityTimer = setInterval(() => {
      const users = ['alpha_king', 'ton_whale', 'dex_master', 'elon_fan', 'yet_lord', 'sol_ninja'];
      const actions = ['just claimed 5,000 $YETC', 'upgraded to FOUNDER', 'secured early slot', 'unlocked 10x multiplier'];
      setActivity({
        user: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)]
      });
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(activityTimer);
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
                { icon: <ShieldCheck size={20} />, label: "TOTAL PROTOCOL VALUE", val: "$142", unit: "M+", sub: "Secure Tier 1 Infrastructure", color: 'var(--premium-blue)' },
                { icon: <Users size={20} />, label: "VERIFIED HOLDERS", val: "1.4", unit: "M", sub: "Viral adoption in 140+ countries", color: 'var(--neon-green)' },
                { icon: <Activity size={20} />, label: "PROJECTED MARKET CAP", val: "$1.2", unit: "B", sub: "High-conviction institutional backing", color: 'var(--premium-orange)' }
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
            <motion.div variants={itemVariants} className="badge-outline" style={{ display: 'flex', margin: '0 auto 16px', color: 'var(--premium-orange)', borderColor: 'rgba(255,138,0,0.2)' }}>
              THE RETIREMENT STRATEGY
            </motion.div>
            <motion.h1 variants={itemVariants} style={{ fontSize: '34px', fontWeight: '900', textAlign: 'center', marginBottom: '12px' }}>
              Wealth <span className="glow-text-orange">Exclusivity</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '32px', padding: '0 20px', color: 'var(--text-secondary)', fontSize: '15px' }}>
              While others play for pennies, our Whale members secure <span style={{ color: '#fff', fontWeight: '700' }}>generational wealth</span>. Stop working, start dominating.
            </motion.p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: <Zap size={18} fill="currentColor" />, title: "Unlock Whale Tier APR", desc: "Access the highest possible mining yields. Reserved for the early 1%.", color: 'var(--premium-orange)' },
                { icon: <TrendingUp size={18} />, title: "Avoid Token Dilution", desc: "Whale members receive priority snapshots and anti-dilution protection.", color: 'var(--neon-green)' },
                { icon: <Clock size={18} />, title: "Instant Withdrawal Access", desc: "Get priority listed for liquidity events before the general public.", color: 'var(--premium-blue)' },
                { icon: <Users size={18} />, title: "The Founder's Network", desc: "Direct access to Tier 1 VC allocations and private alpha channels.", color: 'var(--premium-purple)' },
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
              Pool is <span className="glow-text-red">98.4% Full</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', marginBottom: '24px', padding: '0 20px' }}>
              The official $YETC allocation snapshot for the 1.4M users is concluding. Secure your slice before the burn.
            </motion.p>

            <motion.div variants={itemVariants} className="scarcity-container" style={{ margin: '0 24px 32px' }}>
              <motion.div 
                className="scarcity-fill" 
                initial={{ width: '60%' }}
                animate={{ width: '98.4%' }}
                transition={{ duration: 3, delay: 0.5 }}
              >
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', fontWeight: '900', color: '#fff' }}>
                  98.4% CLAIMED
                </div>
              </motion.div>
            </motion.div>

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
                { name: "Starter", price: "₹1,000" },
                { name: "Founder", price: "₹2,999", badge: "LIMITED SPOTS", active: true },
                { name: "Whale", price: "₹6,999", badge: "MAX YIELD" }
              ].map((tier, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants} 
                  className={`pricing-item ${tier.active ? 'active' : ''} ${tier.name === 'Whale' ? 'whale-glow' : ''}`}
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
    <div className="app-container" style={{ padding: 'calc(env(safe-area-inset-top) + 125px) 20px env(safe-area-inset-bottom)' }}>
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div 
          key={activity.user}
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="live-activity-chip"
        >
          <div className="live-dot" style={{ background: 'var(--neon-green)', width: '8px', height: '8px' }} />
          <span style={{ color: 'var(--text-secondary)' }}>@{activity.user}</span>
          <span style={{ fontWeight: '700' }}>{activity.action}</span>
        </motion.div>
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
