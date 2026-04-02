import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, 
  ExternalLink, Copy, AlertTriangle, Check
} from 'lucide-react';
import { supabase } from '../supabase';
import { useSettings } from '../SettingsContext';

const VerificationPortal = ({ user, onBack, onSuccess }) => {
  const [utrCode, setUtrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  
  const { paymentQrUrl, paymentUpiId, verification_price_inr = '500' } = useSettings();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUtr = utrCode.trim();
    
    if (trimmedUtr.length < 10) {
      setError('UTR must be at least 10 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from('verification_requests')
        .insert({
          player_id: user.id,
          utr_id: trimmedUtr,
          amount: parseFloat(verification_price_inr),
          status: 'pending'
        });

      if (insertError) {
        if (insertError.code === '23505') throw new Error('This UTR has already been submitted.');
        throw insertError;
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    try {
      navigator.clipboard.writeText(text);
      alert('UPI ID copied!');
    } catch (err) {
      const t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
      alert('UPI ID copied!');
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel"
          style={{ padding: '40px 20px', borderRadius: '32px' }}
        >
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 255, 157, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
          }}>
            <CheckCircle2 size={48} color="var(--neon-green)" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '12px' }}>Request Submitted</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px', lineHeight: '1.5' }}>
            Your verification request is being reviewed. This usually takes 12-24 hours. The blue badge will appear on your profile once approved.
          </p>
          <button onClick={onBack} className="btn-primary" style={{ width: '100%' }}>Back to Profile</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
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
        <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'white', margin: 0 }}>Get Verified</h1>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <ShieldCheck size={24} color="var(--premium-blue)" />
          <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Verification Badge</h3>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
          Gain trust and prestige with the official blue checkmark. Verified accounts stand out in the community and have priority access to listing events.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>COST FOR BADGE</span>
          <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--neon-green)' }}>₹{verification_price_inr}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '20px', width: '200px', height: '200px', position: 'relative' }}>
          {!qrLoaded && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0a0a0', fontSize: '12px' }}>Loading...</div>
          )}
          <img 
            src={paymentQrUrl || "/qr-placeholder.png"} 
            alt="Payment QR" 
            onLoad={() => setQrLoaded(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>
      </div>

      {paymentUpiId && (
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment UPI ID</span>
          <div 
            onClick={() => copyToClipboard(paymentUpiId)}
            style={{ 
              marginTop: '8px', padding: '12px', background: 'rgba(255,255,255,0.05)', 
              borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{paymentUpiId}</span>
            <Copy size={16} opacity={0.5} />
          </div>
        </div>
      )}

      <div style={{ flex: 1 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
              TRANSACTION ID / UTR
            </label>
            <input 
              type="text" 
              placeholder="e.g. 123456789012"
              value={utrCode}
              onChange={(e) => setUtrCode(e.target.value)}
              className="premium-input"
              required
              style={{ paddingLeft: '16px' }}
            />
          </div>

          {error && (
            <div style={{ color: 'var(--fomo-red)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !utrCode.trim()} 
            className="btn-primary"
            style={{ width: '100%', opacity: (loading || !utrCode.trim()) ? 0.6 : 1 }}
          >
            {loading ? 'Submitting...' : 'Apply Now'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <ShieldCheck size={14} /> 
          Verified manually within 24 hours.
        </div>
      </div>
    </div>
  );
};

export default VerificationPortal;
