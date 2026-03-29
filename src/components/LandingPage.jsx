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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="container glass-page flex-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ overflow: 'hidden', justifyContent: 'flex-start', paddingTop: '20px' }}
    >
      {/* FOMO Banner Component */}
      <motion.div 
        className="glass" 
        style={{ 
          width: '100%', 
          padding: '24px 20px', 
          marginBottom: '32px',
          background: 'linear-gradient(180deg, rgba(255, 59, 48, 0.1) 0%, rgba(20, 20, 25, 0.7) 100%)',
          border: '1px solid rgba(255, 59, 48, 0.3)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        variants={itemVariants}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #ff3b30, #ff9f43)' }} />
        
        <div className="flex-center" style={{ marginBottom: '16px' }}>
          <div style={{ 
            background: 'rgba(255, 59, 48, 0.15)', 
            border: '1px solid rgba(255, 59, 48, 0.3)',
            color: '#ff3b30',
            padding: '6px 16px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            <AlertTriangle size={14} /> CRITICAL DEADLINE
          </div>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: '800', lineHeight: '1.2', marginBottom: '8px' }}>
          The <span style={{ color: '#ff3b30' }}>Largest Airdrop</span> Ends Soon
        </h2>
        
        <p style={{ fontSize: '14px', opacity: 0.8, color: '#ffffff' }}>
          The official $YETC allocation snapshot is closing.
        </p>
      </motion.div>
      {/* Visual Hook */}
      <motion.div 
        className="flex-center" 
        style={{ marginBottom: '20px' }} 
        variants={itemVariants}
      >
        <div style={{ position: 'relative' }}>
          <div className="mining-glow" style={{ 
            width: '120px', 
            height: '120px', 
            background: 'radial-gradient(circle, rgba(0, 210, 255, 0.4) 0%, transparent 70%)',
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            zIndex: -1
          }} />
          <Coins size={100} color="#00d2ff" style={{ filter: 'drop-shadow(0 0 10px rgba(0,210,255,0.5))' }} />
        </div>
      </motion.div>

      {/* Main Copy */}
      <motion.div style={{ textAlign: 'center', marginBottom: '40px' }} variants={itemVariants}>
        <motion.div 
          style={{ 
            background: 'rgba(255, 159, 67, 0.15)', 
            color: '#ff9f43', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '11px', 
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '16px'
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Zap size={12} fill="#ff9f43" /> EARLY ACCESS: 92% GENESIS FULL
        </motion.div>
        
        <h1 style={{ fontSize: '36px', lineHeight: '1.1' }}>
          The Next Big Thing <br/> 
          <span className="text-gradient">is finally here.</span>
        </h1>
        
        <p style={{ marginTop: '16px', fontSize: '17px', opacity: 0.8, padding: '0 20px' }}>
          Stop tapping, start earning. Join 1.2M+ miners building the future of <strong>$YETC</strong>.
        </p>
      </motion.div>

      {/* Social Trust Proofs */}
      <motion.div 
        className="glass" 
        style={{ 
          width: '100%', 
          padding: '20px', 
          marginBottom: '40px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)' 
        }}
        variants={itemVariants}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', margin: 0 }}>₹8.42</h3>
            <span style={{ fontSize: '10px', opacity: 0.6 }}>Est. Listing Price</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', margin: 0 }}>1.2M+</h3>
            <span style={{ fontSize: '10px', opacity: 0.6 }}>Active Miners</span>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div style={{ width: '100%', marginTop: 'auto', paddingBottom: '20px' }} variants={itemVariants}>
        <button className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '18px' }} onClick={onNext}>
          🚀 Claim Your Spot Now
        </button>
        <p style={{ textAlign: 'center', fontSize: '12px', opacity: 0.5, marginTop: '12px' }}>
          Limited invitations available today.
        </p>
      </motion.div>

      {/* Background decoration */}
      <div style={{ 
        position: 'absolute', 
        bottom: '-100px', 
        left: '-100px', 
        width: '300px', 
        height: '300px', 
        background: 'radial-gradient(circle, rgba(157, 80, 187, 0.1) 0%, transparent 70%)',
        zIndex: -1
      }} />
    </motion.div>
  );
};

export default LandingPage;
