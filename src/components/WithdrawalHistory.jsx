import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Clock, CheckCircle2, XCircle, AlertTriangle, 
  ShieldAlert, IndianRupee, Calendar, ExternalLink, RefreshCw
} from 'lucide-react';
import { supabase } from '../supabase';

const WithdrawalHistory = ({ user, onBack }) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('player_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setWithdrawals(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { 
          label: 'APPROVED', icon: <CheckCircle2 size={12} />, 
          color: 'var(--neon-green)', bg: 'rgba(0, 255, 157, 0.1)' 
        };
      case 'rejected':
        return { 
          label: 'REJECTED', icon: <XCircle size={12} />, 
          color: 'var(--fomo-red)', bg: 'rgba(255, 77, 77, 0.1)' 
        };
      case 'hold':
        return { 
          label: 'ON HOLD', icon: <Clock size={12} />, 
          color: '#FF8A00', bg: 'rgba(255, 138, 0, 0.1)' 
        };
      case 'kyc_required':
        return { 
          label: 'KYC NEEDED', icon: <ShieldAlert size={12} />, 
          color: '#9D50BB', bg: 'rgba(157, 80, 187, 0.1)' 
        };
      default:
        return { 
          label: 'PENDING', icon: <RefreshCw size={12} className="spinning" />, 
          color: 'var(--premium-blue)', bg: 'rgba(0, 209, 255, 0.1)' 
        };
    }
  };

  return (
    <div className="container" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
            borderRadius: '12px', width: '40px', height: '40px', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'white', margin: 0 }}>Payout History</h1>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-spinner" />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--fomo-red)', padding: '40px' }}>
          <AlertTriangle size={48} style={{ marginBottom: '16px' }} />
          <p>{error}</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.5, padding: '40px' }}>
          <Clock size={64} style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '800' }}>No Requests Yet</h2>
          <p style={{ fontSize: '14px', maxWidth: '240px' }}>Your referral bonus withdrawals will appear here once you make a request.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
          {withdrawals.map((w, idx) => {
            const config = getStatusConfig(w.status);
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card"
                style={{
                  padding: '20px', borderRadius: '24px', background: 'var(--bg-card)', 
                  border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', background: config.bg, color: config.color }}>
                    {config.icon}
                    <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.5px' }}>{config.label}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {new Date(w.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px', marginBottom: '2px' }}>NET PAYABLE</div>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>₹{w.amount_net.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px', marginBottom: '2px' }}>METHOD</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--premium-blue)' }}>{w.method}</div>
                  </div>
                </div>

                {/* Optional Detail Expansion could go here if needed */}
                <style>{`
                  .spinning { animation: spin 2s linear infinite; }
                  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                `}</style>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;
