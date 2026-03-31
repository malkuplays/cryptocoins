import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CreditCard, Banknote, Wallet, Info, 
  CheckCircle2, AlertCircle, ChevronRight, IndianRupee,
  ShieldCheck, ArrowRight
} from 'lucide-react';
import { supabase } from '../supabase';

const WithdrawalPortal = ({ user, onBack, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Method, 2: Details, 3: Review, 4: Success
  const [method, setMethod] = useState(null);
  const [details, setDetails] = useState({});
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bonusBalance = user?.total_referral_bonus || 0;

  const methods = [
    { id: 'UPI', label: 'UPI Transfer', icon: <CreditCard size={24} />, gst: 10, color: '#00D1FF', desc: 'Secure & Instant' },
    { id: 'BANK', label: 'Bank Transfer', icon: <Banknote size={24} />, gst: 15, color: '#9D50BB', desc: 'Direct to Account' },
    { id: 'CRYPTO', label: 'Crypto Wallet', icon: <Wallet size={24} />, gst: 0, color: '#00FF9D', desc: 'Zero Fees (Recommended)' },
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
      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Select Payout Method</h3>
      {methods.map((m) => (
        <motion.button
          key={m.id}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setMethod(m.id); setStep(2); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
            background: 'var(--bg-card)', border: `1px solid ${method === m.id ? m.color : 'rgba(255,255,255,0.05)'}`,
            borderRadius: '24px', textAlign: 'left', cursor: 'pointer', color: 'white', position: 'relative'
          }}
        >
          <div style={{ padding: '12px', borderRadius: '16px', background: `${m.color}15`, color: m.color }}>
            {m.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '800' }}>{m.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.desc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: '900', color: m.gst === 0 ? 'var(--neon-green)' : 'var(--text-muted)' }}>
              {m.gst}% GST
            </div>
          </div>
          <ChevronRight size={18} opacity={0.3} />
        </motion.button>
      ))}
    </div>
  );

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Payout Details</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Selected: <span style={{ color: selectedMethod.color }}>{selectedMethod.label}</span></p>
      </div>

      {/* Balance Preview */}
      <div style={{ padding: '16px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px' }}>AVAILABLE BONUS</div>
        <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--neon-green)' }}>₹{bonusBalance.toLocaleString('en-IN')}</div>
      </div>

      <div className="input_group">
        <label>Withdrawal Amount (INR)</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', opacity: 0.5 }}>₹</span>
          <input 
            type="number" 
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ paddingLeft: '32px' }}
          />
        </div>
      </div>

      {method === 'UPI' && (
        <div className="input_group">
          <label>VPA / UPI ID</label>
          <input 
            placeholder="username@bank"
            value={details.upi_id || ''}
            onChange={(e) => setDetails({ ...details, upi_id: e.target.value })}
          />
        </div>
      )}

      {method === 'BANK' && (
        <>
          <div className="input_group">
            <label>Account Number</label>
            <input 
              placeholder="000000000000"
              value={details.account_no || ''}
              onChange={(e) => setDetails({ ...details, account_no: e.target.value })}
            />
          </div>
          <div className="input_group">
            <label>IFSC Code</label>
            <input 
              placeholder="SBIN000123"
              value={details.ifsc || ''}
              onChange={(e) => setDetails({ ...details, ifsc: e.target.value })}
            />
          </div>
        </>
      )}

      {method === 'CRYPTO' && (
        <div className="input_group">
          <label>Wallet Address (USDT-TRC20 / ETH)</label>
          <input 
            placeholder="0x... or T..."
            value={details.address || ''}
            onChange={(e) => setDetails({ ...details, address: e.target.value })}
          />
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF3B30', fontSize: '13px', fontWeight: '600' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <button className="primary_button" onClick={handleNext}>Review Withdrawal</button>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px' }}>Review Request</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Confirm your transaction details below.</p>
      </div>

      <div style={{ padding: '20px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Withdraw Amount</span>
          <span style={{ fontWeight: '800' }}>₹{parseFloat(amount).toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>GST Charges ({selectedMethod.gst}%)</span>
          <span style={{ fontWeight: '800', color: '#FF3B30' }}>- ₹{gstAmount.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: '800' }}>Net Payable Amount</span>
          <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--neon-green)' }}>₹{netAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style={{ 
        display: 'flex', gap: '12px', padding: '14px', borderRadius: '16px', 
        background: 'rgba(0, 209, 255, 0.05)', border: '1px solid rgba(0, 209, 255, 0.1)'
      }}>
        <ShieldCheck size={20} color="var(--premium-blue)" />
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          By clicking confirm, you agree that your payout will be processed to the provided {selectedMethod.label} details within 24-48 hours.
        </p>
      </div>

      {error && <div style={{ color: '#FF3B30', fontSize: '13px' }}>{error}</div>}

      <button 
        className="primary_button" 
        onClick={handleSubmit} 
        disabled={loading}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
      >
        {loading ? <div className="loading-spinner" style={{ width: '18px', height: '18px' }} /> : <><ShieldCheck size={18} /> Confirm Withdrawal</>}
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,255,157,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}
      >
        <CheckCircle2 size={48} color="var(--neon-green)" />
      </motion.div>
      <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '12px' }}>Request Submitted</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
        Your withdrawal request for ₹{netAmount.toLocaleString('en-IN')} is being processed. You will receive an alert once it's approved.
      </p>
      <button className="primary_button" onClick={onBack}>Done</button>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
      {step < 4 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : onBack()}
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '10px', color: 'white', cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>Withdrawal</h1>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
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
