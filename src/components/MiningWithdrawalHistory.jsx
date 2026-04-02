import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Clock, CheckCircle2, XCircle, AlertTriangle, 
  ShieldAlert, Calendar, RefreshCw, Gem, Wallet, ExternalLink
} from 'lucide-react';
import { supabase } from '../supabase';

const MiningWithdrawalHistory = ({ user, onBack }) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
  }, [user?.id]);

  const fetchWithdrawals = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('mining_withdrawals')
        .select('*')
        .eq('player_id', user.id)
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
      case 'completed':
      case 'approved':
        return { 
          label: 'COMPLETED', icon: <CheckCircle2 size={12} />, 
          color: 'var(--neon-green)', bg: 'rgba(0, 255, 157, 0.1)' 
        };
      case 'rejected':
      case 'failed':
        return { 
          label: 'REJECTED', icon: <XCircle size={12} />, 
          color: 'var(--fomo-red)', bg: 'rgba(255, 77, 77, 0.1)' 
        };
      default:
        return { 
          label: 'PENDING', icon: <RefreshCw size={12} style={{ animation: 'spin 2s linear infinite' }} />, 
          color: 'var(--premium-blue)', bg: 'rgba(0, 209, 255, 0.1)' 
        };
    }
  };

  return (
    <div className="container" style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', width: '40px', height: '40px', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'white', margin: 0 }}>Mining History</h1>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--neon-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--fomo-red)', padding: '40px' }}>
          <AlertTriangle size={48} style={{ marginBottom: '16px' }} />
          <p>{error}</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.5, padding: '40px' }}>
          <Clock size={64} style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '800' }}>No Mining Requests</h2>
          <p style={{ fontSize: '14px', maxWidth: '240px' }}>Your YETC withdrawals will appear here once you make a request.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
          {/* Summary */}
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>TOTAL WITHDRAWN</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--neon-green)', marginTop: '4px' }}>
                  {withdrawals.filter(w => w.status === 'completed' || w.status === 'approved').reduce((acc, w) => acc + Number(w.amount_yetc), 0).toFixed(2)} $YETC
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>TOTAL VALUE</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--premium-blue)', marginTop: '4px' }}>
                  ${withdrawals.filter(w => w.status === 'completed' || w.status === 'approved').reduce((acc, w) => acc + Number(w.amount_usd), 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {withdrawals.map((w, idx) => {
              const config = getStatusConfig(w.status);
              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    padding: '20px', borderRadius: '24px', background: 'var(--bg-card)', 
                    border: '1px solid rgba(255,255,255,0.05)', position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', background: config.bg, color: config.color }}>
                      {config.icon}
                      <span style={{ fontSize: '10px', fontWeight: '900' }}>{config.label}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <Calendar size={12} /> {new Date(w.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>
                        {Number(w.amount_yetc).toLocaleString()} <span style={{ fontSize: '12px', color: 'var(--premium-blue)' }}>$YETC</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>≈ ${Number(w.amount_usd).toFixed(4)} USD</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '4px' }}>{w.network}</div>
                      <div style={{ 
                        fontSize: '11px', fontWeight: '700', color: 'var(--premium-blue)', 
                        background: 'rgba(0, 209, 255, 0.05)', padding: '4px 8px', borderRadius: '6px',
                        maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {w.wallet_address}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MiningWithdrawalHistory;
