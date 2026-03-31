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
  Star,
  Timer,
  Gift,
  Gem,
  Sparkles,
  BadgePercent
} from 'lucide-react';
import { triggerHaptic } from '../telegram';
import { useSettings } from '../SettingsContext';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedTier, setSelectedTier] = useState(1); // Index in plans array
  const [stakingPeriod, setStakingPeriod] = useState(1); // 0: 5 years, 1: 7 years
  const [utrCode, setUtrCode] = useState('');
  const { plans, paymentQrUrl, paymentUpiId } = useSettings();
  const [qrLoaded, setQrLoaded] = useState(false);

  useEffect(() => {
    // Initial progress bar animation
    const timer = setTimeout(() => setProgress(94.2), 500);
    return () => clearTimeout(timer);
  }, []);

  const nextStep = () => {
    triggerHaptic('impact');
    if (step < 5) setStep(s => s + 1);
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
    const selectedPlan = plans[selectedTier] || plans[0];
    const stakingYears = stakingPeriod === 0 ? 5 : 7;
    onComplete({ 
      payment_status: 'pending', 
      utr_id: trimmedUtr, 
      plan_tier: selectedPlan.name.toLowerCase().split(' ')[0], // Extracts 'starter', 'pro', or 'whale'
      staking_years: stakingYears
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
              YETCOIN ICO is live! Participate in our exclusive airdrop to claim tokens before our Tier-1 exchange listing.
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <Trophy size={20} />, label: "AIRDROP POOL", val: "50M YETC", sub: "Community distribution", color: 'var(--premium-orange)' },
                { icon: <Users size={20} />, label: "EARLY ADOPTERS", val: "1.4M+", sub: "Users heavily mining", color: 'var(--neon-green)' },
                { icon: <TrendingUp size={20} />, label: "TARGET LISTING", val: "$10.00", sub: "Estimated TGE value", color: 'var(--premium-blue)' }
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
              Start <br/><span style={{ color: 'var(--neon-green)' }}>Mining</span>
            </motion.h2>

            <motion.p variants={itemVariants} style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
              Join the YETCOIN revolution in seconds. No crypto experience needed—just tap and earn.
            </motion.p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { icon: <Zap size={22} />, title: "Mine Daily", desc: "Auto-generate tokens" },
                { icon: <Users size={22} />, title: "Referrals", desc: "Huge invite bonuses" },
                { icon: <ShieldCheck size={22} />, title: "100% Safe", desc: "Verified ICO Contract" },
                { icon: <ArrowRight size={22} />, title: "Yield", desc: "Direct to your wallet" },
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
              ICO <span style={{ color: 'var(--neon-green)' }}>Closing!</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', marginBottom: '40px', padding: '0 20px', textAlign: 'center' }}>
              The Phase 1 Airdrop is nearly full. Secure your allocation before we list on major exchanges.
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
              Supercharge <span style={{ color: 'var(--neon-green)' }}>Airdrop</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-secondary)' }}>
              Upgrade your mining tier to multiply your daily YETCOIN airdrop allocation!
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {plans.map((plan, i) => {
                const badge = plan.id === 'pro' ? 'POPULAR' : plan.id === 'legendary' ? 'MAX YIELD' : null;
                const multiplier = (plan.power + 1).toFixed(1);
                
                return (
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
                    {badge && <div className="price-badge">{badge}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '18px', fontWeight: '900', marginBottom: '4px' }}>{plan.name}</div>
                        <div style={{ fontSize: '12px', color: selectedTier === i ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
                           {plan.id === 'legendary' ? 'Maximum daily airdrop' : plan.id === 'pro' ? 'Faster token generation' : 'Basic earning speed'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: '900' }}>₹{plan.price.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '11px', color: 'var(--neon-green)', fontWeight: '800' }}>{multiplier}x Multiplier</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
              Choose Staking Period <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        );


      case 4: // Staking Period Selection
        return (
          <motion.div 
            key="step4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(157, 80, 187, 0.15)', border: '1px solid rgba(157, 80, 187, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Timer size={32} color="var(--premium-purple)" />
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} style={{ fontSize: '30px', fontWeight: '900', textAlign: 'center', marginBottom: '8px', lineHeight: '1.1' }}>
              Stake for <span style={{ color: 'var(--premium-purple)' }}>TGE</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Maximize your rewards by staking ahead of the Token Generation Event (TGE).
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {[
                { 
                  years: 5, 
                  title: '5-Year Stake', 
                  multiplier: '3.5x', 
                  apy: '~70% APY',
                  totalReturn: '350%',
                  features: ['Steady long-term growth', 'Early unlock after 3 years', 'Priority withdrawal queue'],
                  color: 'var(--premium-blue)',
                  bgColor: 'rgba(0, 209, 255, 0.08)',
                  borderColor: 'rgba(0, 209, 255, 0.25)'
                },
                { 
                  years: 7, 
                  title: '7-Year Stake', 
                  badge: 'MAX RETURNS',
                  multiplier: '7.0x', 
                  apy: '~100% APY',
                  totalReturn: '700%',
                  features: ['Maximum compounding returns', 'ICO bonus tokens every year', 'VIP whale privileges', 'Exclusive governance rights'],
                  color: 'var(--premium-purple)',
                  bgColor: 'rgba(157, 80, 187, 0.08)',
                  borderColor: 'rgba(157, 80, 187, 0.3)'
                }
              ].map((plan, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStakingPeriod(i);
                    triggerHaptic('selection');
                  }}
                  style={{
                    background: stakingPeriod === i ? plan.bgColor : 'var(--bg-card)',
                    border: `2px solid ${stakingPeriod === i ? plan.color : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '24px',
                    padding: '24px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    boxShadow: stakingPeriod === i ? `0 0 30px ${plan.borderColor}` : 'none'
                  }}
                >
                  {plan.badge && (
                    <div style={{ 
                      position: 'absolute', top: '-12px', right: '20px', 
                      background: 'linear-gradient(135deg, var(--premium-purple), #c471ed)', 
                      color: 'white', padding: '4px 14px', borderRadius: '100px', 
                      fontSize: '10px', fontWeight: '900', letterSpacing: '1px',
                      boxShadow: '0 4px 12px rgba(157, 80, 187, 0.4)'
                    }}>{plan.badge}</div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ 
                          width: '10px', height: '10px', borderRadius: '50%', 
                          border: `2px solid ${stakingPeriod === i ? plan.color : 'rgba(255,255,255,0.2)'}`,
                          background: stakingPeriod === i ? plan.color : 'transparent',
                          transition: 'all 0.2s'
                        }} />
                        <span style={{ fontSize: '20px', fontWeight: '900' }}>{plan.title}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '18px' }}>{plan.apy}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '28px', fontWeight: '900', color: plan.color, lineHeight: '1' }}>{plan.multiplier}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Return</div>
                    </div>
                  </div>

                  <div style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '14px', padding: '14px',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    {plan.features.map((feat, fi) => (
                      <div key={fi} style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px', 
                        fontSize: '13px', color: stakingPeriod === i ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)',
                        padding: '5px 0'
                      }}>
                        <Check size={14} color={stakingPeriod === i ? plan.color : 'rgba(255,255,255,0.2)'} />
                        {feat}
                      </div>
                    ))}
                  </div>

                  {stakingPeriod === i && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{ 
                        marginTop: '14px', padding: '12px 16px', 
                        background: `linear-gradient(135deg, ${plan.borderColor}, transparent)`,
                        borderRadius: '12px', textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '800', color: 'white' }}>
                        <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                        Total return: <span style={{ color: plan.color }}>{plan.totalReturn}</span> over {plan.years} years
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} style={{ 
              padding: '14px 16px', marginBottom: '24px', borderRadius: '14px',
              background: 'rgba(255, 149, 0, 0.08)', border: '1px solid rgba(255, 149, 0, 0.2)',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <Lock size={16} color="var(--premium-orange)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Your selected staking period begins after admin verification. Returns are compounded yearly.
              </span>
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              onClick={nextStep}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              Proceed to Payment <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        );


      case 5: // Manual Payment QR Code
        const selectedPlan = plans[selectedTier];
        const stakingLabel = stakingPeriod === 0 ? '5-Year' : '7-Year';
        return (
          <motion.div 
            key="step5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <motion.h1 variants={itemVariants} style={{ fontSize: '28px', fontWeight: '900', textAlign: 'center', marginBottom: '8px' }}>
              Complete <span style={{ color: 'var(--neon-green)' }}>Payment</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Scan to pay ₹{selectedPlan.price.toLocaleString('en-IN')} for {selectedPlan.name} Tier.
            </motion.p>

            <motion.div variants={itemVariants} style={{ 
              display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' 
            }}>
              <div style={{ padding: '6px 14px', borderRadius: '100px', background: 'rgba(0, 255, 157, 0.1)', border: '1px solid rgba(0, 255, 157, 0.2)', fontSize: '12px', fontWeight: '800', color: 'var(--neon-green)' }}>
                {selectedPlan.name} Tier
              </div>
              <div style={{ padding: '6px 14px', borderRadius: '100px', background: 'rgba(157, 80, 187, 0.1)', border: '1px solid rgba(157, 80, 187, 0.2)', fontSize: '12px', fontWeight: '800', color: 'var(--premium-purple)' }}>
                {stakingLabel} Stake
              </div>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '16px', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                
                {!qrLoaded && paymentQrUrl && (
                  <motion.div 
                    initial={{ opacity: 0.5 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ repeat: Infinity, duration: 0.8, direction: 'alternate' }}
                    style={{ 
                      position: 'absolute', inset: 0, 
                      background: '#f5f5f5', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#a0a0a0', fontSize: '12px', fontWeight: '800', zIndex: 1
                    }}
                  >
                    Loading QR...
                  </motion.div>
                )}

                <img 
                  src={paymentQrUrl || "/qr-placeholder.png"} 
                  alt="QR Code" 
                  onLoad={() => setQrLoaded(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: qrLoaded ? 1 : 0, transition: 'opacity 0.3s' }} 
                  onError={(e) => { e.target.style.display = 'none'; setQrLoaded(true); }}
                />
                {!paymentQrUrl && (
                  <div style={{ position: 'absolute', color: 'black', textAlign: 'center', opacity: 0.5, fontSize: '14px', pointerEvents: 'none' }}>
                     QR Code <br /> Goes Here
                  </div>
                )}
              </div>
            </motion.div>

            {paymentUpiId && (
              <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>UPI ID</span>
                <div 
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(paymentUpiId);
                    } catch (e) {
                      const t = document.createElement('textarea');
                      t.value = paymentUpiId;
                      t.style.position = 'fixed';
                      t.style.opacity = '0';
                      document.body.appendChild(t);
                      t.select();
                      document.execCommand('copy');
                      document.body.removeChild(t);
                    }
                    alert('UPI ID copied to clipboard!');
                  }}
                  style={{ 
                    display: 'inline-block',
                    padding: '8px 16px', 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    border: '1px dashed rgba(255,255,255,0.2)'
                  }}
                >
                  {paymentUpiId}
                </div>
              </motion.div>
            )}

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
    <div className="container" style={{ padding: 'calc(env(safe-area-inset-top) + 80px) 24px env(safe-area-inset-bottom)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      <div style={{ paddingTop: '40px', paddingBottom: '20px' }}>
        <div className="step-indicator" style={{ marginBottom: '32px' }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
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
