import React, { useState, useEffect } from 'react';
import { supabase, setAuthToken } from './supabase';
import { getTelegramUser, expandTelegramApp } from './telegram';
import { 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Coins, 
  Timer, 
  LayoutDashboard,
  CreditCard,
  User,
  Users
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
import Profile from './components/Profile';
import Referrals from './components/Referrals';
import Notifications from './components/Notifications';
import WithdrawalPortal from './components/WithdrawalPortal';
import WithdrawalHistory from './components/WithdrawalHistory';
import MiningWithdrawalPortal from './components/MiningWithdrawalPortal';
import MiningWithdrawalHistory from './components/MiningWithdrawalHistory';
import VerificationPortal from './components/VerificationPortal';

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('loading'); // loading, landing, onboarding, pricing, dashboard
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, profile

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

      // Bypass for local testing (mock user)
      if (window._isMock) {
         // Proceed with anon access for local dev
      } else {
         const initData = window.Telegram?.WebApp?.initData;
         if (!initData) throw new Error('Not running inside Telegram');

         const { data: authData, error: authError } = await supabase.functions.invoke('telegram-auth', {
           body: { initData }
         });

         if (authError || !authData?.access_token) {
           throw new Error(authError?.message || 'Authentication failed');
         }

         setAuthToken(authData.access_token);
      }

      const upsertData = { 
        id: tgUser.id.toString(), 
        username: tgUser.username,
        full_name: `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim()
      };

      if (tgUser.start_param) {
        upsertData.referred_by = tgUser.start_param;
      }

      // Upsert user into Supabase — now authenticated with our Custom JWT
      const { data, error: dbError } = await supabase
        .from('players')
        .upsert(upsertData, { onConflict: 'id' })
        .select()
        .single();

      if (dbError) throw dbError;
      
      setUser(data);
      
      // Determine initial view based on payment + onboarding status
      // SECURITY: Strict checks — dashboard ONLY if payment approved + profile done + is_onboarded
      if (data.payment_status === 'pending') {
        setView('payment_pending');
      } else if (data.payment_status === 'approved' && !data.profile_completed) {
        setView('profile_setup');
      } else if (data.is_onboarded && data.payment_status === 'approved' && data.profile_completed) {
        setView('dashboard');
      } else {
        setView('landing');
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
            <h3 style={{ color: '#ff3b30', fontSize: '14px', marginBottom: '4px' }}>Something went wrong</h3>
            <p style={{ fontSize: '12px', color: 'white', opacity: 1 }}>
              {import.meta.env.DEV ? error : 'Please restart the app or try again later.'}
            </p>
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
              // SECURITY: Use the secure RPC instead of a direct .update()
              // This bypasses the trigger restriction on payment_status for this specific operation.
              try {
                const { data: updatedUser, error: updateError } = await supabase
                  .rpc('submit_payment_utr', {
                    arg_utr_id: updates.utr_id,
                    arg_plan_tier: updates.plan_tier,
                    arg_staking_years: updates.staking_years
                  });
                
                if (updateError) throw updateError;
                setUser(updatedUser);
                
                if (updatedUser.payment_status === 'pending') {
                   setView('payment_pending');
                } else {
                   setView('landing'); // Fallback to landing, not dashboard
                }
              } catch (err) {
                console.error("Onboarding completion error:", err);
                setError('Payment submission failed. Please try again.');
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
          <>
            {activeTab === 'dashboard' && <Dashboard user={user} setUser={setUser} setActiveTab={setActiveTab} />}
            {activeTab === 'profile' && (
              <Profile 
                user={user} 
                onOpenNotifications={() => setActiveTab('notifications')} 
                onOpenWithdrawal={() => setActiveTab('withdrawal')}
                onOpenWithdrawalHistory={() => setActiveTab('withdrawal_history')}
                onOpenMiningWithdrawal={() => setActiveTab('mining_withdrawal')}
                onOpenMiningHistory={() => setActiveTab('mining_history')}
                onOpenVerification={() => setActiveTab('verification')}
              />
            )}
            {activeTab === 'verification' && (
              <VerificationPortal 
                user={user} 
                onBack={() => setActiveTab('profile')} 
                onSuccess={() => {
                  // User successfully applied, profile will refresh its own status check
                  setActiveTab('profile');
                }}
              />
            )}
            {activeTab === 'mining_withdrawal' && (
              <MiningWithdrawalPortal 
                user={user} 
                onBack={() => setActiveTab('profile')} 
                onSuccess={(updatedUser) => setUser(updatedUser)} 
                onOpenHistory={() => setActiveTab('mining_history')}
              />
            )}
            {activeTab === 'mining_history' && (
              <MiningWithdrawalHistory 
                user={user} 
                onBack={() => setActiveTab('profile')} 
              />
            )}
            {activeTab === 'friends' && <Referrals user={user} />}
            {activeTab === 'notifications' && <Notifications user={user} onBack={() => setActiveTab('profile')} />}
            {activeTab === 'withdrawal' && (
              <WithdrawalPortal 
                user={user} 
                onBack={() => setActiveTab('profile')} 
                onSuccess={(updatedUser) => setUser(updatedUser)} 
                onOpenHistory={() => setActiveTab('withdrawal_history')}
              />
            )}
            {activeTab === 'withdrawal_history' && (
              <WithdrawalHistory 
                user={user} 
                onBack={() => setActiveTab('profile')} 
              />
            )}

            {/* Bottom Navigation */}
            <div className="bottom-nav">
              <button 
                className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={22} />
                <span>Dashboard</span>
              </button>
              <button 
                className={`bottom-nav-item ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                <Users size={22} />
                <span>Friends</span>
              </button>
              <button 
                className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={22} />
                <span>Profile</span>
              </button>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
