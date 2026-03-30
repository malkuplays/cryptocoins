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
  const [utrCode, setUtrCode] = useState('');

  useEffect(() => {
    // Initial progress bar animation
    const timer = setTimeout(() => setProgress(94.2), 500);
    return () => clearTimeout(timer);
  }, []);

  const nextStep = () => {
    triggerHaptic('impact');
    if (step < 4) setStep(s => s + 1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const trimmedUtr = utrCode.trim();
    
    // SECURITY: Validate UTR format - must be at least 10 alphanumeric characters
    if (!trimmedUtr) return;
    if (trimmedUtr.length < 10) {
      alert('UTR/Transaction ID must be at least 10 characters long.');
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(trimmedUtr)) {
      alert('UTR/Transaction ID must contain only letters and numbers.');
      return;
    }

    triggerHaptic('notification_success');
    const tiers = ['Starter', 'Pro', 'Whale'];
    onComplete({ 
      payment_status: 'pending', 
      utr_id: trimmedUtr, 
      plan_tier: tiers[selectedTier].toLowerCase() 
    });
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
      case 0: // Step 1: Airdrop & FOMO
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
                <Star size={32} />
              </div>
            </motion.div>

            <motion.h2 variants={itemVariants} style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', lineHeight: '1.1', marginBottom: '16px' }}>
              Massive <br/><span style={{ color: 'var(--neon-green)' }}>AIRDROP</span>
            </motion.h2>
            
            <motion.p variants={itemVariants} style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
              YETCOIN is launching on major exchanges soon! Claim your free tokens before the ICO ends.
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <Trophy size={20} />, label: "TOTAL POOL", val: "500M YETC", sub: "Community distribution", color: 'var(--premium-orange)' },
                { icon: <Users size={20} />, label: "REGISTERED", val: "1.4M+", sub: "Users already claiming", color: 'var(--neon-green)' },
                { icon: <TrendingUp size={20} />, label: "LISTING PRICE", val: "$10.00", sub: "Estimated TGE value", color: 'var(--premium-blue)' }
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} className="step-card-v2" whileTap={{ scale: 0.98 }}>
                  <div className="icon-box-v2" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>{stat.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>{stat.val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 1: // Step 2: Simple steps
        return (
          <motion.div 
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: '100%' }}
          >
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
               <span className="badge-outline">HOW IT WORKS</span>
            </motion.div>

            <motion.h2 variants={itemVariants} style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', lineHeight: '1.1', marginBottom: '16px' }}>
              Simple & <br/><span style={{ color: 'var(--neon-green)' }}>Easy</span>
            </motion.h2>

            <motion.p variants={itemVariants} style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
              Start earning in seconds. No technical knowledge required at all!
            </motion.p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { icon: <Zap size={22} />, title: "Claim Daily", desc: "Just one tap a day" },
                { icon: <Users size={22} />, title: "Invite", desc: "Earn from friends" },
                { icon: <ShieldCheck size={22} />, title: "100% Safe", desc: "Risk-free airdrop" },
                { icon: <ArrowRight size={22} />, title: "Withdraw", desc: "Direct to wallet" },
              ].map((item, i) => (
                <motion.div key={i} variants={itemVariants} className="glass-panel" style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} whileTap={{ scale: 0.98 }}>
                  <div style={{ color: 'var(--neon-green)', marginBottom: '12px' }}>{item.icon}</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 2: // Step 3: Launch Countdown / FOMO
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
                  <TrendingUp size={48} className="glow-text-green" />
               </div>
            </motion.div>

            <motion.h1 variants={itemVariants} style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px', textAlign: 'center' }}>
              Launching <span style={{ color: 'var(--neon-green)' }}>Soon!</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', marginBottom: '40px', padding: '0 20px', textAlign: 'center' }}>
              The token sale is filling up fast. Don't be left behind in the biggest launch of 2024.
            </motion.p>

            <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '24px', marginBottom: '40px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px', fontWeight: '900', letterSpacing: '1px' }}>
                 <span>AIRDROP ALLOCATED</span>
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
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-green)' }} /> Limited Spots Left
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--fomo-red, #ff4c4c)' }} /> Closing Soon
                 </div>
              </div>
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              onClick={nextStep}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              Secure My Spot <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        );

      case 3: // THE SELECTION (Boosters)
        return (
          <motion.div 
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <motion.h1 variants={itemVariants} style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', marginBottom: '12px' }}>
              Boost <span style={{ color: 'var(--neon-green)' }}>Earnings</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-secondary)' }}>
              Upgrade your tier to get a massive multiplier on your daily airdrop!
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {[
                { name: "Starter", price: "₹1,000", cap: "1.2x Multiplier", sub: "Basic earning speed" },
                { name: "Pro", price: "₹2,999", badge: "POPULAR", cap: "2.5x Multiplier", sub: "Faster token generation" },
                { name: "Whale", price: "₹6,999", badge: "MAX YIELD", cap: "5.0x Multiplier", sub: "Maximum daily airdrop" }
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
                    <div style={{ textAlign: 'left' }}>
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
              <div style={{ fontSize: '13px', fontWeight: '900', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Check size={16} color="var(--neon-green)" /> ALL TIERS INCLUDE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {["Daily Airdrop", "Withdrawals", "Premium Support", "ICO Presale Access"].map((b, i) => (
                  <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} /> {b}
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              onClick={nextStep}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              Start Earning <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        );


      case 4: // Manual Payment QR Code
        const tierNames = ['Starter', 'Pro', 'Whale'];
        const prices = ['₹1,000', '₹2,999', '₹6,999'];
        return (
          <motion.div 
            key="step4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <motion.h1 variants={itemVariants} style={{ fontSize: '28px', fontWeight: '900', textAlign: 'center', marginBottom: '8px' }}>
              Complete <span style={{ color: 'var(--neon-green)' }}>Payment</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Scan to pay {prices[selectedTier]} for {tierNames[selectedTier]} Tier.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '16px', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <img 
                  src="/qr-placeholder.png" 
                  alt="QR Code" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div style={{ position: 'absolute', color: 'black', textAlign: 'center', opacity: 0.5, fontSize: '14px', pointerEvents: 'none' }}>
                   QR Code <br /> Goes Here
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <form onSubmit={handlePaymentSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                    ENTER UTR / TRANSACTION ID
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 123456789012" 
                    value={utrCode}
                    onChange={(e) => setUtrCode(e.target.value)}
                    required
                    className="premium-input"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
                <motion.button 
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  className="btn-primary" 
                  disabled={!utrCode.trim()}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: !utrCode.trim() ? 0.5 : 1 }}
                >
                  Verify Payment <Check size={20} />
                </motion.button>
              </form>
            </motion.div>
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
          {[0, 1, 2, 3, 4].map(i => (
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
