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

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('loading'); // loading, landing, onboarding, pricing, dashboard
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      expandTelegramApp();
      handleAuth();
    } catch (err) {
      setError(err.message || 'Initialization error');
      setLoading(false);
    }
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
      
      // Determine initial view
      if (!data.is_onboarded) {
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
          <LandingPage onNext={() => setView('onboarding')} />
        )}
        {view === 'onboarding' && (
          <Onboarding 
            onComplete={async () => {
              // Mark as onboarded and give bonus
              try {
                const { data: updatedUser, error: updateError } = await supabase
                  .from('players')
                  .update({ 
                    is_onboarded: true,
                    mining_balance: (user?.mining_balance || 0) + 500
                  })
                  .eq('id', user.id)
                  .select()
                  .single();
                
                if (updateError) throw updateError;
                setUser(updatedUser);
                setView('dashboard');
              } catch (err) {
                console.error("Onboarding completion error:", err);
                setView('dashboard'); // Fallback
              }
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
