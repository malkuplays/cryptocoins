import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Coins 
} from 'lucide-react';

const LandingPage = ({ onNext }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="container glass-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header section */}
      <motion.div className="flex-center" style={{ margin: '40px 0' }} variants={itemVariants}>
        <div style={{ position: 'relative' }}>
          <Coins size={80} color="#00d2ff" className="mining-glow" />
          <motion.div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%',
              border: '2px solid rgba(0, 210, 255, 0.5)'
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </motion.div>

      <motion.div style={{ textAlign: 'center', marginBottom: '32px' }} variants={itemVariants}>
        <h1>Welcome to Yetcoins</h1>
        <p style={{ marginTop: '12px', fontSize: '16px' }}>
          The world's first "Yet-to-be-Launched" crypto ecosystem. 
          Start mining YETCOIN before the official listing!
        </p>
      </motion.div>

      {/* Feature section */}
      <motion.div className="glass card" style={{ padding: '20px', marginBottom: '24px' }} variants={itemVariants}>
        <div className="space-between" style={{ marginBottom: '16px' }}>
          <ShieldCheck color="#00d2ff" size={24} />
          <div style={{ flex: 1, marginLeft: '16px' }}>
            <h2 style={{ fontSize: '16px' }}>Secure Mining</h2>
            <p>Your earnings are tracked securely in the cloud via Supabase.</p>
          </div>
        </div>
        <div className="space-between">
          <TrendingUp color="#9d50bb" size={24} />
          <div style={{ flex: 1, marginLeft: '16px' }}>
            <h2 style={{ fontSize: '16px' }}>Scalable Earnings</h2>
            <p>Upgrade your plan to increase your mining power instantly.</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="glass card" style={{ padding: '20px', marginBottom: '40px' }} variants={itemVariants}>
          <div className="space-between">
            <Zap color="#ff9f43" size={24} />
            <div style={{ flex: 1, marginLeft: '16px' }}>
              <h2 style={{ fontSize: '16px' }}>Rapid Unlocking</h2>
              <p>YETCOIN is built for the future. Don't wait, get in now.</p>
            </div>
          </div>
      </motion.div>

      <motion.div style={{ marginTop: 'auto' }} variants={itemVariants}>
        <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} onClick={onNext}>
          Get Started
          <ArrowRight size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
