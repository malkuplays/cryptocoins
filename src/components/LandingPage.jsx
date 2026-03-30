import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Map
} from 'lucide-react';
import { triggerHaptic } from '../telegram';

const LandingPage = ({ onNext }) => {
  const handleStart = () => {
    triggerHaptic('impact');
    onNext();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-logo-group">
          <img src="/logo.svg" alt="Yetcoin" className="header-logo" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '900', fontSize: '15px', letterSpacing: '0.5px' }}>YETCOIN</span>
              <div className="live-badge">
                <div className="live-dot" /> LIVE
              </div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--neon-green)' }}>
              $YETC <span style={{ color: '#fff' }}>$46.00</span>
            </div>
          </div>
        </div>
        
        <button className="claim-btn-header" onClick={handleStart}>
          CLAIM <ArrowRight size={14} />
        </button>
      </header>

      {/* Main Content */}
      <motion.div 
        className="container" 
        style={{ paddingTop: '120px', paddingBottom: '60px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex-center" style={{ flexDirection: 'column', textAlign: 'center' }}>
          
          <motion.div variants={itemVariants} className="badge-outline" style={{ marginBottom: '32px' }}>
            <div className="live-dot" style={{ background: 'var(--neon-green)', boxShadow: '0 0 10px var(--neon-green-glow)' }} />
            PRE-LAUNCH EVENT
          </motion.div>

          <motion.div
            variants={itemVariants}
            animate={{ 
              y: [0, -10, 0],
              filter: [
                'drop-shadow(0 0 20px var(--neon-green-glow))',
                'drop-shadow(0 0 40px var(--neon-green-glow))',
                'drop-shadow(0 0 20px var(--neon-green-glow))'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/logo.svg" alt="Logo" className="hero-logo-large" />
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-title">
            The Biggest<br />
            <span className="glow-text-green">AIRDROP</span><br />
            on Telegram
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-subtitle">
            Yetcoin is launching soon! Secure your early allocation and earn massive rewards before we go live.
          </motion.p>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: 'auto' }}>
            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              onClick={handleStart}
            >
              Join the Airdrop
            </motion.button>
            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-secondary" 
              onClick={() => triggerHaptic('selection')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <Map size={20} /> View Roadmap
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Ticker Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '48px', background: 'rgba(11, 11, 15, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', overflow: 'hidden', borderTop: '1px solid var(--glass-border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <motion.div 
          animate={{ x: [0, -500] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ display: 'flex', gap: '40px', whiteSpace: 'nowrap', padding: '0 24px', fontSize: '13px', fontWeight: '800' }}
        >
          <span>$YETC <span style={{ color: '#fff' }}>$46.00</span> <span className="glow-text-green">+12.4%</span></span>
          <span>BTC <span style={{ color: '#fff' }}>$68,432</span> <span className="glow-text-green">+2.1%</span></span>
          <span>ETH <span style={{ color: '#fff' }}>$3,542</span> <span className="glow-text-red">-0.8%</span></span>
          <span>SOL <span style={{ color: '#fff' }}>$142.50</span> <span className="glow-text-green">+5.4%</span></span>
          <span>$YETC <span style={{ color: '#fff' }}>$46.00</span> <span className="glow-text-green">+12.4%</span></span>
          <span>BTC <span style={{ color: '#fff' }}>$68,432</span> <span className="glow-text-green">+2.1%</span></span>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
