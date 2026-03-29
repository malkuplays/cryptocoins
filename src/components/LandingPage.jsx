import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Coins,
  Play,
  AlertTriangle
} from 'lucide-react';

const LandingPage = ({ onNext }) => {
  return (
    <div className="container" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="circuit-bg" />
      
      {/* Dynamic Aura */}
      <div className="aura-blob" style={{ background: 'var(--neon-green)', top: '-50px', right: '-50px', opacity: 0.1 }} />
      <div className="aura-blob" style={{ background: 'var(--neon-green)', bottom: '-50px', left: '-50px', opacity: 0.1 }} />

      <div className="flex-center" style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '40px 20px 32px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', textAlign: 'center' }}
        >
          <div className="price-ticker mb-8" style={{ marginBottom: '32px', display: 'inline-flex' }}>
            <TrendingUp size={14} />
            $YETC Price: $0.124 <span style={{ color: '#00FF88' }}>+12.4%</span>
          </div>
          
          <motion.img 
            src="/src/assets/logo.svg" 
            alt="Yetcoins" 
            style={{ width: '140px', marginBottom: '32px', display: 'block', margin: '0 auto 32px' }}
            animate={{ filter: ['drop-shadow(0 0 10px var(--neon-green-glow))', 'drop-shadow(0 0 25px var(--neon-green-glow))', 'drop-shadow(0 0 10px var(--neon-green-glow))'] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          
          <h1 className="glow-header" style={{ fontSize: '38px', marginBottom: '16px', lineHeight: '1.1' }}>
            Earn <span style={{ color: 'var(--neon-green)' }}>Real Crypto</span><br/>While You Sleep
          </h1>
          
          <p style={{ maxWidth: '300px', margin: '0 auto 48px', fontSize: '16px', color: 'var(--text-secondary)' }}>
            The premier Telegram mining ecosystem. Launching on Tier-1 exchanges Q2 2024.
          </p>

          <div className="premium-card flex-center" style={{ gap: '20px', padding: '20px 32px' }}>
            <div className="stat-item">
              <span className="stat-label">Miners Active</span>
              <span className="stat-value">1.24M+</span>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
            <div className="stat-item">
              <span className="stat-label">Trust Score</span>
              <span className="stat-value">98.4%</span>
            </div>
          </div>
        </motion.div>

        <div style={{ width: '100%' }}>
          <button 
            className="btn-primary pulse-primary" 
            style={{ 
              width: '100%', 
              padding: '20px',
              background: 'var(--neon-green)',
              color: '#000',
              fontWeight: '900',
              fontSize: '18px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 12px 32px var(--neon-green-glow)'
            }} 
            onClick={onNext}
          >
            Get Started Now
            <ArrowRight size={24} />
          </button>
          
          <div className="flex-center" style={{ marginTop: '20px', gap: '8px', opacity: 0.6 }}>
            <ShieldCheck size={14} color="var(--neon-green)" />
            <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px' }}>AUDITED BY CERTIK • GENESIS PHASE 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
