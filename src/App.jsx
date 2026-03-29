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

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('loading'); // loading, landing, pricing, dashboard
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    expandTelegramApp();
    handleAuth();
  }, []);

  const handleAuth = async () => {
    try {
      const tgUser = getTelegramUser();
      
      // Upsert user into Supabase
      const { data, error } = await supabase
        .from('players')
        .upsert({ 
          id: tgUser.id.toString(), 
          username: tgUser.username,
          full_name: `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim()
        }, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;
      
      setUser(data);
      
      // Determine initial view
      if (data.plan_tier && data.plan_tier !== 'free') {
        setView('dashboard');
      } else {
        setView('landing');
      }
    } catch (err) {
      console.error('Auth error:', err);
      // Fallback to landing if auth fails (e.g. mock user)
      setView('landing');
    } finally {
      setLoading(false);
    }
  };

  const AuraBackground = () => (
    <>
      <div className="aura-blob aura-1"></div>
      <div className="aura-blob aura-2"></div>
    </>
  );

  if (loading) return (
    <div className="container flex-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        <Zap size={48} color="#00d2ff" />
      </motion.div>
    </div>
  );

  return (
    <div className="app-container">
      <AuraBackground />
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingPage onNext={() => setView('pricing')} />
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
