import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Users, 
  ArrowRight,
  Clock,
  ShieldCheck,
  Activity,
  ChevronRight,
  Check,
  Globe,
  Lock,
  Cpu,
  BarChart3,
  Trophy,
  Crown,
  Star
} from 'lucide-react';
import { triggerHaptic } from '../telegram';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedTier, setSelectedTier] = useState(1); // 0: Starter, 1: Founder, 2: Whale

  useEffect(() => {
    // Initial progress bar animation
    const timer = setTimeout(() => setProgress(94.2), 500);
    return () => clearTimeout(timer);
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
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const renderStep = () => {
    switch(step) {
      case 0: // Step 1: Institutional Vision
        return (
          <motion.div 
            key="step0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: '100%' }}
          >
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div className="icon-box-v2" style={{ width: '64px', height: '64px', background: 'var(--neon-green-dim)', border: '1px solid var(--neon-green-glow)' }}>
                <Globe size={32} />
              </div>
            </motion.div>

            <motion.h2 variants={itemVariants} style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', lineHeight: '1.1', marginBottom: '16px' }}>
              Protocol <br/><span style={{ color: 'var(--neon-green)' }}>Ecosystem</span>
            </motion.h2>
            
            <motion.p variants={itemVariants} style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
              Built on Tier-1 infrastructure, providing institutional-grade access to yield markets.
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <ShieldCheck size={20} />, label: "PROTOCOL TVL", val: "$142M", sub: "Fully audited smart contracts", color: 'var(--premium-blue)' },
                { icon: <Activity size={20} />, label: "MINING UPTIME", val: "99.9%", sub: "High-performing node clusters", color: 'var(--neon-green)' },
                { icon: <Users size={20} />, label: "GLOBAL NODES", val: "1,240", sub: "Decentralized across 40+ regions", color: 'var(--premium-orange)' }
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} className="step-card-v2" whileTap={{ scale: 0.98 }}>
                  <div className="icon-box-v2" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>{stat.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>{stat.val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 1: // Step 2: Advanced Yield Architecture
        return (
          <motion.div 
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: '100%' }}
          >
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '24px' }}>
               <span className="badge-outline">ARCHITECTURE</span>
            </motion.div>

            <motion.h2 variants={itemVariants} style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', lineHeight: '1.1', marginBottom: '16px' }}>
              Yield <br/><span style={{ color: 'var(--neon-green)' }}>Optimization</span>
            </motion.h2>

            <motion.p variants={itemVariants} style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
              Our proprietary AI engine optimizes allocations across multiple chains for maximum efficiency.
            </motion.p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { icon: <Zap size={22} />, title: "Instant", desc: "Real-time rewards" },
                { icon: <Lock size={22} />, title: "Secure", desc: "Non-custodial" },
                { icon: <Cpu size={22} />, title: "AI-Driven", desc: "Auto-balancing" },
                { icon: <BarChart3 size={22} />, title: "Alpha", desc: "Exclusive access" },
              ].map((item, i) => (
                <motion.div key={i} variants={itemVariants} className="glass-panel" style={{ padding: '20px', textAlign: 'left' }} whileTap={{ scale: 0.98 }}>
                  <div style={{ color: 'var(--neon-green)', marginBottom: '12px' }}>{item.icon}</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 2: // Step 3: Scaling & Security
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
               <div className="icon-box-v2" style={{ width: '80px', height: '80px', border: 'none', background: 'transparent' }}>
                  <Activity size={48} className="glow-text-green" />
               </div>
            </motion.div>

            <motion.h1 variants={itemVariants} style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>
              Network <span style={{ color: 'var(--neon-green)' }}>Scaling</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', marginBottom: '40px', padding: '0 20px' }}>
              We are currently at capacity for Stage 1. Scaling infrastructure to support the next wave of users.
            </motion.p>

            <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '24px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px', fontWeight: '900', letterSpacing: '1px' }}>
                 <span>NETWORK LOAD</span>
                 <span style={{ color: 'var(--neon-green)' }}>{progress}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{ height: '100%', background: 'var(--neon-green)', boxShadow: '0 0 15px var(--neon-green-glow)' }}
                />
              </div>
              <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-green)' }} /> 18k active nodes
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-green)' }} /> 0.4ms latency
                 </div>
              </div>
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              onClick={nextStep}
            >
              Verify Connection <ArrowRight size={20} />
            </motion.button>
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
            <motion.h1 variants={itemVariants} style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', marginBottom: '12px' }}>
              Select <span style={{ color: 'var(--neon-green)' }}>Tier</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-secondary)' }}>
              Choose your allocation strategy based on your wealth goals.
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {[
                { name: "Starter", price: "₹1,000", cap: "1.2x Multiplier", sub: "Basic yield access" },
                { name: "Founder", price: "₹2,999", badge: "POPULAR", cap: "2.5x Multiplier", sub: "Early access perks" },
                { name: "Whale", price: "₹6,999", badge: "MAX YIELD", cap: "5.0x Multiplier", sub: "Institutional benefits" }
              ].map((tier, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants} 
                  className={`price-card ${selectedTier === i ? 'active' : ''}`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedTier(i);
                    triggerHaptic('selection');
                  }}
                >
                  {tier.badge && <div className="price-badge">{tier.badge}</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '900', marginBottom: '4px' }}>{tier.name}</div>
                      <div style={{ fontSize: '12px', color: selectedTier === i ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{tier.sub}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: '900' }}>{tier.price}</div>
                      <div style={{ fontSize: '11px', color: 'var(--neon-green)', fontWeight: '800' }}>{tier.cap}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', marginBottom: '32px' }}>
              <div style={{ fontSize: '13px', fontWeight: '900', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="var(--neon-green)" /> INCLUDED WITH ALL TIERS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {["Daily Payouts", "Audit Reports", "24/7 Support", "Network Access"].map((b, i) => (
                  <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} /> {b}
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              onClick={onComplete}
            >
              Confirm Selection <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        );

      default: return null;
    }
  };

  return (
    <div className="container" style={{ padding: 'calc(env(safe-area-inset-top) + 20px) 24px env(safe-area-inset-bottom)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      <div style={{ paddingTop: '40px', paddingBottom: '20px' }}>
        <div className="step-indicator" style={{ marginBottom: '32px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`step-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
        
        {step < 2 && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="btn-primary" 
            onClick={nextStep}
            style={{ width: '100%' }}
          >
            Continue
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
