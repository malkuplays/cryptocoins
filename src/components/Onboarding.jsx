import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Users, 
  Gift, 
  ArrowRight,
  Globe,
  BarChart3
} from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "The Future of Mining",
      subtitle: "YETCOIN is going viral.",
      description: "Early miners are already seeing 10x yields. Don't let this opportunity slip away like Bitcoin in 2010.",
      icon: <TrendingUp size={48} color="#00d2ff" />,
      color: "#00d2ff",
      fomo: "🔥 84% of Genesis supply already claimed!"
    },
    {
      title: "Real Proof, Real Trust",
      subtitle: "Join the Global Movement.",
      description: "Over 1.2M+ miners active worldwide. Estimated listing price: ₹8.42 on Tier-1 exchanges.",
      icon: <Users size={48} color="#9d50bb" />,
      color: "#9d50bb",
      fomo: "✨ Trusted by 14,000+ Telegram Communities"
    },
    {
      title: "Instant Reward",
      subtitle: "Start with a Bang.",
      description: "We've reserved a special Welcome Bonus for you. Claim it now and start your journey with a head start.",
      icon: <Gift size={48} color="#ff9f43" />,
      color: "#ff9f43",
      fomo: "🎁 500 $YETC Bonus waiting for you"
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '90vh', justifyContent: 'space-between' }}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}
        >
          <div className="flex-center" style={{ marginBottom: '32px' }}>
            <motion.div 
              className="glass flex-center" 
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '30px',
                background: `rgba(${step === 0 ? '0, 210, 255' : step === 1 ? '157, 80, 187' : '255, 159, 67'}, 0.1)`,
                border: `1px solid ${steps[step].color}`
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              {steps[step].icon}
            </motion.div>
          </div>

          <h1 style={{ marginBottom: '8px' }}>{steps[step].title}</h1>
          <h2 style={{ color: steps[step].color, fontSize: '18px', marginBottom: '16px' }}>{steps[step].subtitle}</h2>
          <p style={{ padding: '0 20px', marginBottom: '24px' }}>{steps[step].description}</p>

          <div 
            className="glass" 
            style={{ 
              padding: '12px 20px', 
              display: 'inline-block', 
              fontSize: '13px', 
              fontWeight: '600',
              background: 'rgba(255,255,255,0.03)',
              color: '#4cd964'
            }}
          >
            {steps[step].fomo}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ width: '100%', padding: '20px' }}>
        <div className="flex-center" style={{ gap: '8px', marginBottom: '24px' }}>
          {steps.map((_, i) => (
            <div 
              key={i} 
              style={{ 
                width: i === step ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                background: i === step ? steps[step].color : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease'
              }} 
            />
          ))}
        </div>
        
        <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={nextStep}>
          {step === steps.length - 1 ? 'Claim 500 $YETC Now' : 'Continue'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
