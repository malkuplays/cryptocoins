import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Map,
  Shield,
  Layers,
  Activity
} from 'lucide-react';
import { triggerHaptic } from '../telegram';

const LandingPage = ({ onNext, onRoadmap }) => {
  const handleStart = () => {
    triggerHaptic('impact');
    onNext();
  };

  const handleRoadmap = () => {
    triggerHaptic('selection');
    onRoadmap();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }
    }
  };

  return (
    <div className="app-container" style={{ background: 'radial-gradient(circle at 50% -20%, var(--neon-green-dim), transparent)' }}>
      {/* Header */}
      <header className="app-header">
        <div className="header-logo-group">
          <div className="icon-box-v2" style={{ width: '40px', height: '40px' }}>
            <img src="/logo.svg" alt="Y" style={{ width: '24px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '900', fontSize: '16px', letterSpacing: '1px' }}>YETCOIN</span>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div className="live-dot" style={{ width: '4px', height: '4px' }} /> PROTOCOL v1.0
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: '900' }}>$46.00</div>
          <div style={{ fontSize: '10px', color: 'var(--neon-green)', fontWeight: '800' }}>+12.4%</div>
        </div>
      </header>

      {/* Main Content */}
      <motion.div 
        className="container" 
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 160px)', paddingBottom: '100px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
          
          <motion.div variants={itemVariants} className="badge-outline" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.03)', borderColor: 'var(--glass-border)' }}>
             <Shield size={12} style={{ marginRight: '6px' }} /> INSTITUTIONAL GRADE
          </motion.div>

          <motion.div
            variants={itemVariants}
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginBottom: '32px' }}
          >
            <div style={{ position: 'relative' }}>
              <img src="/logo.svg" alt="Logo" style={{ width: '120px', height: '120px', filter: 'drop-shadow(0 0 40px var(--neon-green-glow))' }} />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
                transition={{ duration: 4, repeat: Infinity }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '160px', height: '160px', borderRadius: '50%', background: 'var(--neon-green-glow)', zIndex: -1 }}
              />
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} style={{ fontSize: '42px', lineHeight: '1', fontWeight: '900', letterSpacing: '-1px', marginBottom: '16px' }}>
            The Future of<br />
            <span style={{ color: 'var(--neon-green)' }}>Digital Wealth</span>
          </motion.h1>

          <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '300px', marginBottom: '48px', lineHeight: '1.5' }}>
            Secure your spot in the next generation of yield-generating assets. Professional-grade mining, simplified.
          </motion.p>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              onClick={handleStart}
            >
              Start Earning Now <ArrowRight size={20} />
            </motion.button>
            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              className="btn-secondary" 
              onClick={handleRoadmap}
              style={{ padding: '18px', background: 'transparent' }}
            >
              System Roadmap
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '48px' }}
        >
          <div className="step-card-v2" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <Layers size={18} color="var(--text-muted)" />
            <div style={{ fontSize: '12px', fontWeight: '800' }}>1.4M+ USERS</div>
          </div>
          <div className="step-card-v2" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <Activity size={18} color="var(--text-muted)" />
            <div style={{ fontSize: '12px', fontWeight: '800' }}>98% UPTIME</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Ticker Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '48px', background: 'rgba(11, 11, 15, 0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', overflow: 'hidden', borderTop: '1px solid var(--glass-border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <motion.div 
          animate={{ x: [0, -500] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ display: 'flex', gap: '48px', whiteSpace: 'nowrap', padding: '0 24px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', color: 'var(--text-muted)' }}
        >
          <span>$YETC <span style={{ color: '#fff' }}>$46.00</span> <span style={{ color: 'var(--neon-green)' }}>+12.4%</span></span>
          <span>BTC <span style={{ color: '#fff' }}>$68,432</span> <span style={{ color: 'var(--neon-green)' }}>+2.1%</span></span>
          <span>ETH <span style={{ color: '#fff' }}>$3,542</span> <span style={{ color: 'var(--fomo-red)' }}>-0.8%</span></span>
          <span>SOL <span style={{ color: '#fff' }}>$142.50</span> <span style={{ color: 'var(--neon-green)' }}>+5.4%</span></span>
          <span>TON <span style={{ color: '#fff' }}>$5.12</span> <span style={{ color: 'var(--neon-green)' }}>+1.2%</span></span>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;

