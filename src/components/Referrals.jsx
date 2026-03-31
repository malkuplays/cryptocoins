import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, Check, Gift, Diamond, Clock, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabase';
import { triggerHaptic } from '../telegram';

const Referrals = ({ user }) => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // You can customize the bot username here
  const BOT_USERNAME = 'yetcoinsbot';
  const inviteLink = `https://t.me/${BOT_USERNAME}/YETC?startapp=${user.id}`;
  
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setReferrals(data || []);
      } catch (err) {
        console.error('Failed to fetch referrals:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id) fetchReferrals();
  }, [user?.id]);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      triggerHaptic('notification_success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for environments where clipboard API is unavailable
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      triggerHaptic('notification_success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const paidReferrals = referrals.filter(r => r.status === 'paid');

  return (
    <motion.div 
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 80px)', paddingBottom: '100px', paddingLeft: '20px', paddingRight: '20px' }}
    >
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(0, 255, 157, 0.1)', border: '1px solid rgba(0, 255, 157, 0.2)', marginBottom: '16px' }}>
          <Users size={32} color="var(--neon-green)" />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Invite Friends</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
          Earn huge cash rewards for every friend who activates a Premium Plan!
        </p>
      </motion.div>

      {/* Rewards Info Box */}
      <motion.div variants={itemVariants} style={{ 
        background: 'var(--bg-card)', 
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>EARNING TIERS</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Starter Plan Referral</span>
            <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--neon-green)' }}>₹500</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Pro Plan Referral</span>
            <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--neon-green)' }}>₹1,200</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Whale Plan Referral</span>
            <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--neon-green)' }}>₹2,500</span>
          </div>
        </div>
      </motion.div>

      {/* Copy Link Section */}
      <motion.div variants={itemVariants} style={{ marginBottom: '32px' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>YOUR INVITE LINK</div>
            <div style={{ fontSize: '14px', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {inviteLink}
            </div>
          </div>
          <button 
            onClick={handleCopy}
            className="btn-primary"
            style={{ padding: '12px 20px', borderRadius: '12px', minWidth: '100px', display: 'flex', justifyContent: 'center' }}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '8px' }}>TOTAL INVITES</div>
          <div style={{ fontSize: '24px', fontWeight: '900' }}>{referrals.length}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0, 255, 157, 0.2)', borderRadius: '20px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--neon-green)', fontWeight: '700', marginBottom: '8px' }}>TOTAL EARNED</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--neon-green)' }}>₹{(user?.total_referral_bonus || 0).toLocaleString('en-IN')}</div>
        </div>
      </motion.div>

      {/* Friends List */}
      <motion.div variants={itemVariants}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Your Friends ({referrals.length})</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading...</div>
        ) : referrals.length === 0 ? (
          <div style={{ 
            background: 'var(--bg-card)', borderRadius: '20px', padding: '32px 20px', 
            textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)'
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>You haven't invited anyone yet.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Copy your link above and share it with friends to start earning!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {referrals.map((ref) => (
              <div key={ref.id} style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>
                    {ref.referred_name || ref.referred_username || 'Anonymous User'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {ref.status === 'paid' ? (
                      <><ShieldCheck size={12} color="var(--neon-green)" /> Premium Activator</>
                    ) : (
                      <><Clock size={12} color="var(--premium-orange)" /> Pending Upgrade...</>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {ref.status === 'paid' ? (
                    <>
                      <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--neon-green)' }}>+₹{ref.bonus_earned}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', background: 'rgba(0,255,157,0.1)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>PAID</div>
                    </>
                  ) : (
                    <div style={{ fontSize: '12px', color: 'var(--premium-orange)', fontWeight: '700', padding: '4px 8px', background: 'rgba(255, 149, 0, 0.1)', borderRadius: '100px' }}>
                      PENDING
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Referrals;
