import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Map
} from 'lucide-react';

const LandingPage = ({ onNext }) => {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-logo-group">
          <img src="/logo.svg" alt="Yetcoin" className="header-logo" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '900', fontSize: '14px', letterSpacing: '0.5px' }}>YETCOIN</span>
              <div className="live-badge">
                <div className="live-dot" /> LIVE
              </div>
            </div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--neon-green)' }}>
              $YETC <span style={{ color: '#fff' }}>$46.00</span>
            </div>
          </div>
        </div>
        
        <button className="claim-btn-header" onClick={onNext}>
          CLAIM <ArrowRight size={14} />
        </button>
      </header>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
        <div className="flex-center" style={{ flexDirection: 'column', textAlign: 'center' }}>
          
          <div className="badge-outline" style={{ marginBottom: '24px' }}>
            <div className="live-dot" style={{ background: 'var(--neon-green)', boxShadow: '0 0 8px var(--neon-green-glow)' }} />
            PRE-LAUNCH EVENT
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/logo.svg" alt="Logo" className="hero-logo-large" />
          </motion.div>

          <h1 className="hero-title">
            The Biggest<br />
            <span className="glow-text-green">AIRDROP</span><br />
            on Telegram
          </h1>

          <p className="hero-subtitle">
            Yetcoin is launching soon! Secure your early allocation and earn massive rewards before we go live.
          </p>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '20px', borderRadius: '100px', textTransform: 'none', fontWeight: '700' }}
              onClick={onNext}
            >
              Join the Airdrop
            </button>
            <button 
              className="btn-secondary" 
              style={{ padding: '20px', borderRadius: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              View Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Ticker Bar (Optional, seen in screenshot) */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '40px', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', overflow: 'hidden', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', gap: '32px', whiteSpace: 'nowrap', padding: '0 20px', fontSize: '12px', fontWeight: '600' }}>
          <span>$6.42 <span style={{ color: 'var(--fomo-red)' }}>-0.8%</span></span>
          <span>BNB <span style={{ color: '#fff' }}>$612.30</span> <span style={{ color: 'var(--neon-green)' }}>+0.5%</span></span>
          <span>XRP <span style={{ color: '#fff' }}>$0.62</span> <span style={{ color: 'var(--neon-green)' }}>+1.1%</span></span>
          <span>$YETC <span style={{ color: '#fff' }}>$46.00</span> <span style={{ color: 'var(--neon-green)' }}>+12.4%</span></span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
