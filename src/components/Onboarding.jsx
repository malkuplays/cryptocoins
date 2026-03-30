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
    if (step < 3) setStep(s => s + 1);
    else onComplete();
  };

  const renderStep = () => {
    switch(step) {
      case 0: // Step 1: Network Effect (Image 1)
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%' }}
          >
            <h2 style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '2px', marginBottom: '32px' }}>
              THE NETWORK EFFECT IS UNSTOPPABLE
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <ShieldCheck size={20} />, label: "TOTAL VALUE LOCKED", val: "$42.5", unit: "M", sub: "Growing 12.4% weekly", color: 'var(--premium-blue)' },
                { icon: <Users size={20} />, label: "ACTIVE TOKEN HOLDERS", val: "148", unit: "K+", sub: "+2,000 upgrades daily", color: 'var(--neon-green)' },
                { icon: <Activity size={20} />, label: "DAILY PRE-MARKET VOL", val: "$12.8", unit: "M", sub: "Insane ecosystem velocity", color: 'var(--premium-orange)' }
              ].map((stat, i) => (
                <div key={i} className="step-card">
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
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 1: // Step 2: Why Upgrade (Image 4)
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%' }}
          >
            <div className="badge-outline" style={{ display: 'flex', margin: '0 auto 16px', color: 'var(--neon-green)', borderColor: 'rgba(0,255,157,0.1)' }}>
              THE PREMIUM ADVANTAGE
            </div>
            <h1 style={{ fontSize: '34px', fontWeight: '900', textAlign: 'center', marginBottom: '12px' }}>
              Why You Must <span className="glow-text-green">Upgrade Now</span>
            </h1>
            <p style={{ textAlign: 'center', marginBottom: '32px', padding: '0 20px' }}>
              Free users get pennies. Premium members historically secure generational wealth. Here is exactly what you unlock instantly.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: <Zap size={18} fill="currentColor" />, title: "100x Airdrop Multipliers", desc: "Premium members lock in massive multipliers for the upcoming $YETC Airdrop. Free users risk getting diluted, while you maximize your stack.", color: 'var(--premium-orange)' },
                { icon: <TrendingUp size={18} />, title: "The First-Mover Advantage", desc: "Get in before the masses. Secure your position at the absolutely lowest entry point before our Tier 1 Exchange listings.", color: 'var(--neon-green)' },
                { icon: <Clock size={18} />, title: "Instant Daily Yield", desc: "Your premium status activates immediate, passive $YETC accrual directly inside your Telegram app. Wake up richer every single day.", color: 'var(--premium-blue)' },
                { icon: <Users size={18} />, title: "The VIP Inner Circle", desc: "Unlock the private Alpha channel, get direct line access to the core team, and receive inside info before the public knows.", color: 'var(--premium-purple)' },
                { icon: <ShieldCheck size={18} />, title: "100% Verified & Secure", desc: "Our allocation smart contracts are fully audited. Your tier position is cryptographically guaranteed.", color: '#fff' }
              ].map((item, i) => (
                <div key={i} className="step-card" style={{ padding: '16px', gap: '16px', alignItems: 'flex-start' }}>
                  <div className="step-icon-box" style={{ width: '40px', height: '40px', background: item.color, color: '#000', borderRadius: '8px' }}>
                    {item.icon}
                  </div>
                  <div className="step-content">
                    <h3 style={{ fontSize: '15px' }}>{item.title}</h3>
                    <p style={{ fontSize: '12px', marginTop: '4px' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 2: // Step 3: Critical Deadline (Image 3)
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.2)', padding: '8px 20px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={16} color="var(--fomo-red)" />
                <span style={{ color: 'var(--fomo-red)', fontSize: '12px', fontWeight: '900', letterSpacing: '1px' }}>CRITICAL DEADLINE</span>
              </div>
            </div>

            <h1 style={{ fontSize: '38px', fontWeight: '900', marginBottom: '12px' }}>
              The <span className="glow-text-red">Largest Airdrop</span> Ends Soon
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', padding: '0 20px' }}>
              The official $YETC allocation snapshot is closing. Unclaimed tokens will be burned forever.
            </p>

            <div className="countdown-grid" style={{ marginBottom: '40px' }}>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
              <div className="timer-box" style={{ textAlign: 'left', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--neon-green)' }}>
                  <Users size={16} />
                  <span style={{ fontSize: '18px', fontWeight: '900' }}>148.5K+</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', marginTop: '4px', letterSpacing: '0.5px' }}>CLAIMED SPOTS</div>
              </div>
              <div className="timer-box" style={{ textAlign: 'left', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--premium-orange)' }}>
                  <TrendingUp size={16} />
                  <span style={{ fontSize: '18px', fontWeight: '900' }}>89%</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', marginTop: '4px', letterSpacing: '0.5px' }}>CAPACITY FULL</div>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '24px', borderRadius: '16px', background: 'linear-gradient(90deg, #FF0000, #FF5C00)', boxShadow: '0 0 20px rgba(255,0,0,0.4)', fontSize: '18px', fontWeight: '900' }} onClick={nextStep}>
              CLAIM YOUR SPOT NOW
            </button>
            
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '11px' }}>
               <Clock size={12} /> Secure your tier before capacity reaches 100%
            </div>
          </motion.div>
        );

      case 3: // Step 4: Tier Selection (Image 2)
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ width: '100%' }}
          >
            <h1 style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', marginBottom: '8px' }}>
              Upgrade Tier
            </h1>
            <p style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-secondary)' }}>
              Unlock your maximum earning potential in<br />the Yetcoin ecosystem.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { name: "Starter", price: "₹1,000", active: true },
                { name: "Pro", price: "₹2,999", badge: "BEST VALUE" },
                { name: "Elite", price: "₹6,999" }
              ].map((tier, i) => (
                <div key={i} className={`pricing-item ${tier.active ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: '700' }}>{tier.name}</span>
                    {tier.badge && <span className="benefit-pill">{tier.badge}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '900' }}>{tier.price}</span>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid' + (tier.active ? ' var(--premium-blue)' : ' var(--text-muted)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {tier.active && <div style={{ width: '10px', height: '10px', background: 'var(--premium-blue)', borderRadius: '50%' }} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
               <ShieldCheck size={18} color="var(--neon-green)" />
               <span style={{ fontWeight: '700', fontSize: '15px' }}>Starter Benefits</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px', marginBottom: '40px' }}>
              {[
                "Access to basic features",
                "Standard referral bonuses",
                "Community group access",
                "Email support"
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'white' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid var(--neon-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--neon-green)" />
                  </div>
                  {b}
                </div>
              ))}
            </div>
            
            <button className="btn-primary" style={{ width: '100%', padding: '20px', borderRadius: '100px', background: 'var(--neon-green)', color: '#000', fontSize: '16px', fontWeight: '900', boxShadow: '0 0 20px var(--neon-green-glow)' }} onClick={onComplete}>
              CLAIM YOUR MULTIPLIERS <ArrowRight size={18} />
            </button>
          </motion.div>
        );

      default: return null;
    }
  };

  return (
    <div className="app-container" style={{ padding: '40px 20px' }}>
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      {/* Persistence Controls */}
      <div style={{ marginTop: '40px', width: '100%' }}>
        <div className="step-indicator" style={{ marginBottom: '32px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`step-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
        
        {step < 3 && (
          <button 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              background: step === 2 ? 'var(--fomo-red)' : 'var(--neon-green)',
              color: '#000',
              fontWeight: '900',
              padding: '20px',
              borderRadius: '100px'
            }} 
            onClick={nextStep}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
