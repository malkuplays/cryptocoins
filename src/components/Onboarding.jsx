import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Users, 
  Gift, 
  ArrowRight,
  Globe,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Clock,
  Flame
} from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 14, mins: 42, secs: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextStep = () => {
    if (step < 4) setStep(s => s + 1);
    else onComplete();
  };

  const renderStep = () => {
    switch(step) {
      case 0: // Step 1: Main Landing
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-center"
            style={{ flexDirection: 'column', textAlign: 'center' }}
          >
            <div className="price-ticker mb-8" style={{ marginBottom: '32px' }}>
              <TrendingUp size={14} />
              $YETC Price: $0.124 <span style={{ color: '#00FF88' }}>+12.4%</span>
            </div>
            
            <motion.img 
              src="/src/assets/logo.svg" 
              alt="Yetcoins" 
              style={{ width: '120px', marginBottom: '24px' }}
              animate={{ filter: ['drop-shadow(0 0 10px var(--neon-green-glow))', 'drop-shadow(0 0 25px var(--neon-green-glow))', 'drop-shadow(0 0 10px var(--neon-green-glow))'] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            
            <h1 className="glow-header" style={{ fontSize: '32px', marginBottom: '12px' }}>
              The Biggest <span style={{ color: 'var(--neon-green)' }}>AIRDROP</span><br/>on Telegram
            </h1>
            
            <p style={{ maxWidth: '280px', marginBottom: '40px' }}>
              Join 1.2M+ miners in the most anticipated crypto launch of 2024.
            </p>

            <div className="premium-card flex-center" style={{ gap: '12px', padding: '16px 24px' }}>
              <div className="stat-item">
                <span className="stat-label">Listing Price</span>
                <span className="stat-value">$1.42</span>
              </div>
              <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
              <div className="stat-item">
                <span className="stat-label">Launch Date</span>
                <span className="stat-value">Q2 2024</span>
              </div>
            </div>
          </motion.div>
        );

      case 1: // Step 2: Premium Advantage
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%' }}
          >
            <h2 className="glow-header" style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>
              Why Join <span style={{ color: 'var(--neon-green)' }}>Yetcoins?</span>
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: <Zap size={20} />, title: "Instant Yield", desc: "Start earning from the first minute." },
                { icon: <ShieldCheck size={20} />, title: "Secure & Verified", desc: "Contract audited by CertiK engineers." },
                { icon: <TrendingUp size={20} />, title: "10x Multipliers", desc: "Early adopters get exclusive boost cards." },
                { icon: <Users size={20} />, title: "Viral Referral", desc: "Earn 15% from your friends' mining output." },
                { icon: <Globe size={20} />, title: "Global Access", desc: "The first truly borderless crypto ecosystem." }
              ].map((item, i) => (
                <div key={i} className="premium-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--neon-green)', background: 'rgba(0,255,136,0.1)', padding: '10px', borderRadius: '12px' }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '600' }}>{item.title}</h3>
                    <p style={{ fontSize: '12px' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 2: // Step 3: Network Stats
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            style={{ width: '100%', textAlign: 'center' }}
          >
            <div className="flex-center mb-6" style={{ marginBottom: '24px' }}>
              <div className="glass flex-center float-anim" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,255,136,0.1)', border: '1px solid var(--neon-green)' }}>
                <Globe size={40} color="var(--neon-green)" />
              </div>
            </div>
            
            <h2 className="glow-header" style={{ fontSize: '28px', marginBottom: '8px' }}>Join the Network</h2>
            <p style={{ marginBottom: '32px' }}>Our community is growing exponentially.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: "Total Value Logged", val: "$42.5M", sub: "+$2.1M today" },
                { label: "Active Miners", val: "1.24M", sub: "Global reach" },
                { label: "Daily Transactions", val: "842K+", sub: "High liquidity" },
                { label: "Community Trust", val: "98.4%", sub: "Verified score" }
              ].map((stat, i) => (
                <div key={i} className="premium-card" style={{ padding: '20px 10px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--neon-green)', display: 'block' }}>{stat.val}</span>
                  <span style={{ fontSize: '10px', color: var(--text-secondary), textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</span>
                  <span style={{ fontSize: '10px', color: '#00FF88', fontWeight: '600', marginTop: '4px', display: 'block' }}>{stat.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 3: // Step 4: Critical Deadline
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ width: '100%', textAlign: 'center' }}
          >
            <div className="flex-center" style={{ marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,59,48,0.1)', padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(255,59,48,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={14} color="#FF3B30" />
                <span style={{ color: '#FF3B30', fontSize: '12px', fontWeight: '700' }}>CRITICAL DEADLINE</span>
              </div>
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>
              Snapshot <span style={{ color: '#FF3B30' }}>Closing</span>
            </h2>
            <p style={{ marginBottom: '32px' }}>Final chance to secure your Genesis Airdrop allocation before public listing.</p>

            <div className="flex-center" style={{ gap: '12px', marginBottom: '40px' }}>
              <div className="countdown-block">
                <span className="countdown-val">00</span>
                <span className="countdown-unit">Days</span>
              </div>
              <div className="countdown-block">
                <span className="countdown-val">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="countdown-unit">Hours</span>
              </div>
              <div className="countdown-block">
                <span className="countdown-val">{String(countdown.mins).padStart(2, '0')}</span>
                <span className="countdown-unit">Mins</span>
              </div>
              <div className="countdown-block">
                <span className="countdown-val">{String(countdown.secs).padStart(2, '0')}</span>
                <span className="countdown-unit">Secs</span>
              </div>
            </div>

            <div className="premium-card" style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Allocation Progress</span>
                <span style={{ fontSize: '13px', color: 'var(--neon-green)' }}>94% Claimed</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ height: '100%', background: 'var(--neon-green)', boxShadow: '0 0 10px var(--neon-green-glow)' }} 
                />
              </div>
            </div>
          </motion.div>
        );

      case 4: // Step 5: Tier Selection
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ width: '100%' }}
          >
            <h2 className="glow-header" style={{ fontSize: '24px', marginBottom: '12px', textAlign: 'center' }}>Choose Your Genesis Plan</h2>
            <p style={{ textAlign: 'center', marginBottom: '32px', fontSize: '13px' }}>Maximize your initial airdrop multiplier.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { id: 'starter', name: "Starter Miner", price: "FREE", color: '#FFF' },
                { id: 'pro', name: "Pro Miner", price: "₹2,999", color: 'var(--neon-green)', best: true },
                { id: 'elite', name: "Elite Genesis", price: "₹6,999", color: '#FFD700' }
              ].map((plan) => (
                <div 
                  key={plan.id} 
                  className="premium-card" 
                  style={{ 
                    padding: '16px 20px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    border: plan.best ? '1px solid var(--neon-green)' : '1px solid var(--glass-border)',
                    background: plan.best ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${plan.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {plan.best && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: plan.color }} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px' }}>{plan.name}</h4>
                      {plan.best && <span style={{ fontSize: '9px', background: 'var(--neon-green)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>RECOMMENDED</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: plan.color }}>{plan.price}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '0 8px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <CheckCircle2 size={16} color="var(--neon-green)" />
                <span style={{ fontSize: '13px' }}>1.5x Mining Multiplier Guaranteed</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <CheckCircle2 size={16} color="var(--neon-green)" />
                <span style={{ fontSize: '13px' }}>Instant Token Snapshot Eligibility</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--neon-green)" />
                <span style={{ fontSize: '13px' }}>Priority Listing Withdrawal Access</span>
              </div>
            </div>
          </motion.div>
        );

      default: return null;
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="circuit-bg" />
      
      {/* Dynamic Aura */}
      <div className="aura-blob" style={{ background: step === 3 ? 'var(--fomo-red)' : 'var(--neon-green)', top: '-50px', right: '-50px', opacity: 0.1 }} />
      <div className="aura-blob" style={{ background: 'var(--neon-green)', bottom: '-50px', left: '-50px', opacity: 0.1 }} />

      <div className="flex-center" style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '40px 20px 32px' }}>
        <div style={{ width: '100%' }}>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        <div style={{ width: '100%' }}>
          <div className="step-indicator" style={{ marginBottom: '32px' }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`step-dot ${i === step ? 'active' : ''}`} />
            ))}
          </div>
          
          <button 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '12px',
              background: step === 3 ? 'var(--fomo-red)' : 'var(--neon-green)',
              color: '#000',
              boxShadow: step === 3 ? '0 8px 24px rgba(255, 59, 48, 0.3)' : '0 8px 24px var(--neon-green-glow)'
            }} 
            onClick={nextStep}
          >
            <span style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {step === 4 ? 'Confirm & Start Mining' : 'Continue'}
            </span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
