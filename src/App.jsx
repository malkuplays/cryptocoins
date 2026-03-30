import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { getTelegramUser, expandTelegramApp } from './telegram';
import { 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Coins, 
  Timer, 
  LayoutDashboard,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sub-components
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import Roadmap from './components/Roadmap';
import PaymentPending from './components/PaymentPending';
import ProfileSetup from './components/ProfileSetup';

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('loading'); // loading, landing, onboarding, pricing, dashboard
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activity, setActivity] = useState({ user: 'cryptoknight', action: 'just upgraded to WHALE' });

  useEffect(() => {
    try {
      expandTelegramApp();
      handleAuth();
    } catch (err) {
      setError(err.message || 'Initialization error');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const activityTimer = setInterval(() => {
      const users = ['alpha_king', 'ton_whale', 'dex_master', 'elon_fan', 'yet_lord', 'sol_ninja', 'bt_boss', 'crypto_queen', 'moon_walker', 'satoshix'];
      const actions = ['just claimed 5,000 $YETC', 'upgraded to FOUNDER', 'secured early slot', 'unlocked 10x multiplier', 'joined the revolution', 'mined 1,000 $YETC'];
      setActivity({
        user: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)]
      });
    }, 5000);

    return () => clearInterval(activityTimer);
  }, []);

  const handleAuth = async () => {
    try {
      const tgUser = getTelegramUser();
      
      // Safety check for supabase connection
      if (!supabase?.from) {
        throw new Error('Supabase keys missing or invalid in Vercel');
      }

      // Upsert user into Supabase
      const { data, error: dbError } = await supabase
        .from('players')
        .upsert({ 
          id: tgUser.id.toString(), 
          username: tgUser.username,
          full_name: `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim()
        }, { onConflict: 'id' })
        .select()
        .single();

      if (dbError) throw dbError;
      
      setUser(data);
      
      // Determine initial view based on manual payment status
      if (data.payment_status === 'pending') {
        setView('payment_pending');
      } else if (data.payment_status === 'approved' && !data.profile_completed) {
        setView('profile_setup');
      } else if (!data.is_onboarded) {
        setView('landing');
      } else if (data.plan_tier && data.plan_tier !== 'free') {
        setView('dashboard');
      } else {
        setView('dashboard'); // Default to dashboard if already onboarded
      }
    } catch (err) {
      console.error('Auth error:', err);
      // If it's a real error (not just mock user), show it
      if (err.message !== 'Supabase keys missing or invalid in Vercel') {
         setError(`Auth/DB Error: ${err.message}`);
      }
      setView('landing');
    } finally {
      setLoading(false);
    }
  };

  const AuraBackground = () => (
    <>
      <div className="aura-blob aura-1"></div>
      <div className="aura-blob aura-2"></div>
      <div className="aura-blob aura-3"></div>
    </>
  );
  if (loading) return (
    <div className="container flex-center">
      <motion.div 
        animate={{ 
          rotateY: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3, 
          ease: "easeInOut" 
        }}
      >
        <img 
          src="/logo.svg" 
          alt="Loading..." 
          style={{ 
            width: '80px', 
            height: '80px', 
            filter: 'drop-shadow(0 0 20px var(--neon-green-glow))' 
          }} 
        />
      </motion.div>
    </div>
  );

  return (
    <div className="app_container">
      <AuraBackground />
      
      <AnimatePresence>
        {!loading && activity && (
          <motion.div 
            key={activity.user}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="live-activity-chip"
            style={{ pointerEvents: 'none' }}
          >
            <div className="live-dot" style={{ background: 'var(--neon-green)', width: '6px', height: '6px', borderRadius: '50%', boxShadow: '0 0 10px var(--neon-green)' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400' }}>@{activity.user}</span>
            <span style={{ color: 'white', fontWeight: '600' }}>{activity.action}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{ 
              position: 'fixed', 
              top: '20px', 
              left: '20px', 
              right: '20px', 
              zIndex: 1000, 
              padding: '15px', 
              background: 'rgba(255, 59, 48, 0.15)',
              border: '1px solid #ff3b30'
            }}
          >
            <h3 style={{ color: '#ff3b30', fontSize: '14px', marginBottom: '4px' }}>Debug Error</h3>
            <p style={{ fontSize: '12px', color: 'white', opacity: 1 }}>{error}</p>
            <button 
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '10px', marginTop: '8px', textDecoration: 'underline' }}
            >
              Dismiss
            </button>
          </motion.div>
        )}
        {view === 'landing' && (
          <LandingPage 
            onNext={() => setView('onboarding')} 
            onRoadmap={() => setView('roadmap')}
          />
        )}
        {view === 'roadmap' && (
          <Roadmap 
            onBack={() => setView('landing')} 
            onJoin={() => setView('onboarding')}
          />
        )}
        {view === 'onboarding' && (
          <Onboarding 
            user={user}
            onComplete={async (updates = {}) => {
              // Merge default onboarded state with passed updates (like utr_id, payment_status)
              try {
                const { data: updatedUser, error: updateError } = await supabase
                  .from('players')
                  .update({ 
                    is_onboarded: true,
                    mining_balance: (user?.mining_balance || 0) + 500,
                    ...updates
                  })
                  .eq('id', user.id)
                  .select()
                  .single();
                
                if (updateError) throw updateError;
                setUser(updatedUser);
                
                if (updatedUser.payment_status === 'pending') {
                   setView('payment_pending');
                } else {
                   setView('dashboard');
                }
              } catch (err) {
                console.error("Onboarding completion error:", err);
                setView('dashboard'); // Fallback
              }
            }} 
          />
        )}
        {view === 'payment_pending' && (
          <PaymentPending 
            user={user} 
            onSuccess={(updatedUser) => {
              setUser({ ...user, ...updatedUser });
              setView('profile_setup');
            }} 
          />
        )}
        {view === 'profile_setup' && (
          <ProfileSetup 
            user={user} 
            onComplete={(updatedUser) => {
              setUser(updatedUser);
              setView('dashboard');
            }} 
          />
        )}
        {view === 'pricing' && (
          <PricingPage 
            user={user} 
            onSuccess={(updatedUser) => {
              setUser(updatedUser);
              setView('dashboard');
            }} 
          />
        )}
        {view === 'dashboard' && (
          <Dashboard user={user} setUser={setUser} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
