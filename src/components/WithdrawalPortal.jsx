import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CreditCard, Banknote, Wallet, Info, 
  CheckCircle2, AlertCircle, ChevronRight, IndianRupee,
  ShieldCheck, ArrowRight, Hash, Mail
} from 'lucide-react';
import { supabase } from '../supabase';

const WithdrawalPortal = ({ user, onBack, onSuccess, onOpenHistory }) => {
  const [step, setStep] = useState(1); // 1: Method, 2: Details, 3: Review, 4: Success
  const [method, setMethod] = useState(null);
  const [details, setDetails] = useState({});
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bonusBalance = user?.total_referral_bonus || 0;

  const methods = [
    { id: 'UPI', label: 'UPI Transfer', icon: <CreditCard size={22} />, gst: 10, color: 'var(--premium-blue)', desc: 'Secure & Instant' },
    { id: 'BANK', label: 'Bank Transfer', icon: <Banknote size={22} />, gst: 15, color: 'var(--premium-purple)', desc: 'Direct to Account' },
    { id: 'CRYPTO', label: 'Crypto Wallet', icon: <Wallet size={22} />, gst: 0, color: 'var(--neon-green)', desc: 'Zero Fees (Recommended)' },
  ];

  const selectedMethod = methods.find(m => m.id === method);
  const gstAmount = amount ? (parseFloat(amount) * (selectedMethod?.gst || 0)) / 100 : 0;
  const netAmount = amount ? parseFloat(amount) - gstAmount : 0;

  const validateStep = () => {
    if (step === 2) {
      if (!amount || parseFloat(amount) <= 0) return "Please enter a valid amount";
      if (parseFloat(amount) > bonusBalance) return "Insufficient referral bonus";
      if (method === 'UPI' && !details.upi_id) return "Please enter UPI ID";
      if (method === 'BANK' && (!details.account_no || !details.ifsc)) return "Account NO and IFSC are required";
      if (method === 'CRYPTO' && !details.address) return "Please enter wallet address";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('process_withdrawal', {
        arg_amount_gross: parseFloat(amount),
        arg_gst_rate: selectedMethod.gst,
        arg_method: method,
        arg_details: details
      });

      if (rpcError) throw rpcError;
      
      onSuccess(data); // Sync user state
      setStep(4);
    } catch (err) {
      setError(err.message || "Withdrawal failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Rendering Steps
  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ marginBottom: '8px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>Choose Payout Method</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>How would you like to receive your bonus?</p>
      </div>
      
      {methods.map((m) => (
        <motion.button
          key={m.id}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setMethod(m.id); setStep(2); }}
          className="step-card-v2"
          style={{
            width: '100%', border: `1px solid ${method === m.id ? m.color : 'rgba(255,255,255,0.04)'}`,
            background: method === m.id ? `${m.color}08` : 'var(--bg-card)',
            position: 'relative', overflow: 'hidden'
          }}
        >
          <div className="icon-box-v2" style={{ color: m.color, background: `${m.color}15` }}>
            {m.icon}
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'white' }}>{m.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.desc}</div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: '900', color: m.gst === 0 ? 'var(--neon-green)' : 'var(--fomo-red)' }}>
              {m.gst}% Fees
            </div>
            <ChevronRight size={16} opacity={0.3} />
          </div>
          {method === m.id && (
            <motion.div 
              layoutId="glow"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: `1px solid ${m.color}`, borderRadius: '20px', pointerEvents: 'none', opacity: 0.5 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '100px', background: `${selectedMethod.color}15`, marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: '900', color: selectedMethod.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {selectedMethod.label}
          </span>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>Enter Payout Details</h3>
      </div>

      {/* Balance Summary Tooltip */}
      <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>AVAILABLE BONUS</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--neon-green)', marginTop: '4px' }}>₹{bonusBalance.toLocaleString('en-IN')}</div>
          </div>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0, 255, 157, 0.1)' }}>
            <IndianRupee size={20} color="var(--neon-green)" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>WITHDRAWAL AMOUNT</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
              <IndianRupee size={16} />
            </div>
            <input 
              type="number" 
              placeholder="Min. ₹500"
              className="premium-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ fontSize: '18px', fontWeight: '800' }}
            />
          </div>
        </div>

        {method === 'UPI' && (
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>UPI ID (VPA)</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                 <Hash size={16} />
              </div>
              <input 
                placeholder="example@upi"
                className="premium-input"
                value={details.upi_id || ''}
                onChange={(e) => setDetails({ ...details, upi_id: e.target.value })}
              />
            </div>
          </div>
        )}

        {method === 'BANK' && (
          <>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>ACCOUNT NUMBER</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                  <Hash size={16} />
                </div>
                <input 
                  placeholder="Enter Bank A/C No"
                  className="premium-input"
                  value={details.account_no || ''}
                  onChange={(e) => setDetails({ ...details, account_no: e.target.value })}
                />
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>IFSC CODE</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                  <ShieldCheck size={16} />
                </div>
                <input 
                  placeholder="SBIN0001234"
                  className="premium-input"
                  value={details.ifsc || ''}
                  onChange={(e) => setDetails({ ...details, ifsc: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        {method === 'CRYPTO' && (
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>USDT TRC20 / BEP20 ADDRESS</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                <Wallet size={16} />
              </div>
              <input 
                placeholder="0x... or T..."
                className="premium-input"
                value={details.address || ''}
                onChange={(e) => setDetails({ ...details, address: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF4D4D', fontSize: '13px', fontWeight: '600', padding: '12px', background: 'rgba(255, 77, 77, 0.1)', borderRadius: '12px' }}
        >
          <AlertCircle size={16} /> {error}
        </motion.div>
      )}

      <button className="btn-primary" onClick={handleNext} style={{ width: '100%', marginTop: 'auto' }}>
        Review Withdrawal <ArrowRight size={18} />
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>Review Withdrawal</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Please verify everything is correct.</p>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Withdraw Amount</span>
            <span style={{ fontWeight: '800', fontSize: '16px' }}>₹{parseFloat(amount).toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Platform Fees ({selectedMethod.gst}%)</span>
            <span style={{ fontWeight: '800', fontSize: '16px', color: '#FF4D4D' }}>- ₹{gstAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>Net Payable</span>
            <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--neon-green)' }}>₹{netAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        <div style={{ padding: '16px 24px', background: 'rgba(255, 255, 255, 0.04)', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '4px' }}>PAYOUT TO</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--premium-blue)', wordBreak: 'break-all' }}>
            {method === 'UPI' && details.upi_id}
            {method === 'BANK' && `${details.account_no} (${details.ifsc})`}
            {method === 'CRYPTO' && details.address}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', gap: '12px', padding: '16px', borderRadius: '16px', 
        background: 'rgba(0, 209, 255, 0.05)', border: '1px solid rgba(0, 209, 255, 0.1)'
      }}>
        <ShieldCheck size={24} color="var(--premium-blue)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          By confirming, you authorize YETCOIN to process this withdrawal. Funds will be credited to your account within <span style={{ color: 'white', fontWeight: '700' }}>24-48 hours</span>.
        </p>
      </div>

      {error && <div style={{ color: '#FF4D4D', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

      <button 
        className="btn-primary" 
        onClick={handleSubmit} 
        disabled={loading}
        style={{ width: '100%', height: '56px' }}
      >
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            Processing...
          </div>
        ) : (
          <><ShieldCheck size={20} /> Confirm Payout</>
        )}
      </button>
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <motion.div 
        initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{ width: '100px', height: '100px', borderRadius: '32px', background: 'rgba(0,255,157,0.1)', border: '1px solid var(--neon-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 0 30px var(--neon-green-dim)' }}
      >
        <CheckCircle2 size={54} color="var(--neon-green)" />
      </motion.div>
      <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>Request Success!</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px', maxWidth: '300px', margin: '0 auto 40px' }}>
        Your withdrawal of <span style={{ color: 'white', fontWeight: '700' }}>₹{netAmount.toLocaleString('en-IN')}</span> has been queued for manual verification.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button className="btn-primary" onClick={onOpenHistory} style={{ width: '100%' }}>View Status</button>
        <button className="btn-secondary" onClick={onBack} style={{ width: '100%', border: 'none' }}>Return to Profile</button>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {step < 4 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : onBack()}
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
              borderRadius: '14px', width: '44px', height: '44px', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="step-indicator">
            {[1, 2, 3].map(s => (
              <div key={s} className={`step-dot ${step === s ? 'active' : ''}`} />
            ))}
          </div>
          
          <div style={{ width: '44px' }} /> {/* Spacer */}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, cubicBezier: [0.2, 0.8, 0.2, 1] }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WithdrawalPortal;
