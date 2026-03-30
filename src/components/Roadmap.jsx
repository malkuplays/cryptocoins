import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Circle, 
  Rocket, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Coins, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { triggerHaptic } from '../telegram';

const Roadmap = ({ onBack, onJoin }) => {
  const roadmapData = [
    {
      year: '2020 - 2022',
      title: 'Genesis Phase',
      status: 'completed',
      description: 'Initial architectural design, whitepaper development, and core protocol research.',
      milestones: ['Concept Whitepaper', 'Team Assembly', 'Core Engine R&D'],
      icon: <Zap size={20} className="text-muted" />,
    },
    {
      year: '2023 - 2024',
      title: 'Infrastructure & Testing',
      status: 'completed',
      description: 'Private beta testing, security audits, and Telegram Mini App initial integration.',
      milestones: ['Security Audits', 'Beta Launch', 'Telegram Bot v1'],
      icon: <ShieldCheck size={20} className="glow-text-green" />,
    },
    {
      year: '2025',
      title: 'The Great Airdrop',
      status: 'current',
      description: 'Global community expansion through the massive $YETC Airdrop and staking rewards.',
      milestones: ['Public Mining App', 'Referral Engine', 'Staking v1.0'],
      icon: <Coins size={20} className="glow-text-green fomo-pulse" />,
      highlight: true
    },
    {
      year: '2026 - 2028',
      title: 'Ecosystem Expansion',
      status: 'future',
      description: 'Strategic partnerships with major crypto platforms and implementation of YetPay.',
      milestones: ['YetPay Launch', 'Mainnet Pilot', 'Tier-1 Exchange Listings'],
      icon: <Globe size={20} className="text-secondary" />,
      cta: true
    },
    {
      year: '2029',
      title: 'GLOBAL LAUNCH',
      status: 'future',
      description: 'The monumental $YETC Mainnet Launch and listing on Top 5 Global Exchanges.',
      milestones: ['Mainnet Launch', 'Cross-chain Bridge', 'DAO Governance'],
      icon: <Rocket size={24} color="var(--neon-green)" className="fomo-pulse" />,
      cta: true,
      mega: true
    },
    {
      year: '2030 - 2035',
      title: 'Hyper-Growth & Vision',
      status: 'future',
      description: 'Becoming the dominant ecosystem for decentralized social finance and AI integrations.',
      milestones: ['AI Trading Tools', 'Global Merchant Ads', 'Web3 OS Integration'],
      icon: <TrendingUp size={20} className="text-secondary" />,
      cta: true
    }
  ];

  const handleBack = () => {
    triggerHaptic('selection');
    onBack();
  };

  const handleJoin = () => {
    triggerHaptic('impact');
    onJoin();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="app-container" style={{ background: '#0B0B0F' }}>
      {/* Header */}
      <header className="app-header" style={{ height: 'calc(env(safe-area-inset-top) + 80px)', alignItems: 'center', paddingBottom: '10px' }}>
        <button 
          onClick={handleBack}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '800', position: 'absolute', left: '50%', transform: 'translateX(-50%)', letterSpacing: '1px' }}>PROJECT ROADMAP</h2>
      </header>

      {/* Main Content */}
      <motion.div 
        className="container"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 100px)', paddingBottom: '100px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div style={{ padding: '0 10px', position: 'relative' }}>
          {/* Vertical Line */}
          <div style={{ position: 'absolute', left: '25px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(180deg, var(--glass-border) 0%, var(--neon-green) 20%, var(--neon-green) 60%, var(--glass-border) 100%)', zIndex: 0, opacity: 0.3 }} />

          {roadmapData.map((item, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className={`roadmap-card ${item.mega ? 'mega-card' : ''}`}
              style={{ 
                position: 'relative', 
                marginBottom: '32px', 
                paddingLeft: '50px',
                zIndex: 1
              }}
            >
              {/* Marker */}
              <div style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '0', 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                background: item.status === 'completed' ? 'var(--neon-green)' : (item.status === 'current' ? '#fff' : '#1A1A22'),
                border: item.status === 'future' ? '2px solid var(--glass-border)' : 'none',
                boxShadow: item.status === 'completed' || item.status === 'current' ? '0 0 15px var(--neon-green-glow)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.status === 'completed' && <CheckCircle2 size={12} color="#000" />}
                {item.status === 'current' && <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: '6px', height: '6px', background: 'var(--neon-green)', borderRadius: '50%' }} />}
              </div>

              {/* Date Label */}
              <div style={{ fontSize: '12px', fontWeight: '900', color: item.status === 'current' ? 'var(--neon-green)' : 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {item.year} {item.status === 'current' && '• ACTIVE NOW'}
              </div>

              {/* Content Card */}
              <div className="glass" style={{ 
                padding: '24px', 
                borderRadius: '24px', 
                background: item.mega ? 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, rgba(0, 210, 255, 0.05) 100%)' : 'var(--glass-bg)',
                border: item.mega ? '1px solid var(--neon-green)' : '1px solid var(--glass-border)',
                boxShadow: item.mega ? '0 0 40px var(--neon-green-dim), inset 0 0 20px rgba(0, 255, 157, 0.05)' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {item.mega && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', top: '-100px', right: '-100px', width: '200px', height: '200px', background: 'var(--neon-green)', filter: 'blur(80px)', opacity: 0.1, pointerEvents: 'none' }}
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: item.mega ? '#fff' : 'inherit' }}>{item.title}</h3>
                </div>

                <p style={{ fontSize: '14px', marginBottom: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {item.milestones.map((m, i) => (
                    <span key={i} style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                      • {m}
                    </span>
                  ))}
                </div>

                {item.cta && (
                  <button 
                    onClick={handleJoin}
                    className="btn-primary" 
                    style={{ 
                      marginTop: '20px', 
                      padding: '12px', 
                      fontSize: '14px',
                      background: 'linear-gradient(135deg, var(--neon-green), #00d2ff)'
                    }}
                  >
                    Join Pre-Launch <Rocket size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating CTA for Conversion */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        style={{ 
          position: 'fixed', 
          bottom: 'max(30px, env(safe-area-inset-bottom))', 
          left: '20px', 
          right: '20px', 
          zIndex: 100 
        }}
      >
        <button 
          onClick={handleJoin}
          className="btn-primary pulse-primary" 
          style={{ width: '100%', borderRadius: '20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '18px' }}
        >
          SECURE $YETC ALLOCATION <TrendingUp size={24} />
        </button>
      </motion.div>
    </div>
  );
};

export default Roadmap;
