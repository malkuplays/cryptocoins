import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Wallet, Info, 
  CheckCircle2, AlertCircle, ChevronRight,
  ShieldCheck, ArrowRight, Hash, Globe,
  Gem, TrendingUp
} from 'lucide-react';
import { supabase } from '../supabase';
import { useSettings } from '../SettingsContext';

const MiningWithdrawalPortal = ({ user, onBack, onSuccess, onOpenHistory }) => {
  const [step, setStep] = useState(1); // 1: Network, 2: Details, 3: Review, 4: Success
  const [network, setNetwork] = useState(null);
  const [details, setDetails] = useState({});
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { yetcPriceUsd, min_yetc_withdrawal } = useSettings();
  const miningBalance = user?.mining_balance || 0;
  const minAmount = parseFloat(min_yetc_withdrawal || '500');

  const networks = [
    { id: 'TRC20', label: 'Tron (TRC20)', desc: 'Fast & Low Fee', color: '#FF0013' },
    { id: 'BEP20', label: 'BSC (BEP20)', desc: 'Popular & Reliable', color: '#F3BA2F' },
    { id: 'SOLANA', label: 'Solana', desc: 'Ultra Fast', color: '#14F195' },
  ];

  const selectedNetwork = networks.find(n => n.id === network);
  const usdValue = amount ? parseFloat(amount) * yetcPriceUsd : 0;

  const validateStep = () => {
    if (step === 2) {
      if (!amount || parseFloat(amount) < minAmount) return `Minimum withdrawal is ${minAmount} YETC`;
      if (parseFloat(amount) > miningBalance) return "Insufficient mining balance";
      if (!details.address || details.address.length < 10) return "Please enter a valid wallet address";
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
      const { data, error: rpcError } = await supabase.rpc('process_mining_withdrawal', {
        arg_amount: parseFloat(amount),
        arg_usd_value: usdValue,
        arg_wallet: details.address,
        arg_network: network
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

  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ marginBottom: '8px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>Select Network</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Choose the blockchain network for your withdrawal.</p>
      </div>
      
      {networks.map((n) => (
        <motion.button
          key={n.id}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setNetwork(n.id); setStep(2); }}
          className="step-card-v2"
          style={{
            width: '100%', border: `1px solid ${network === n.id ? n.color : 'rgba(255,255,255,0.04)'}`,
            background: network === n.id ? `${n.color}08` : 'var(--bg-card)',
            position: 'relative', overflow: 'hidden', padding: '20px', borderRadius: '20px',
            display: 'flex', alignItems: 'center', gap: '16px', color: 'white', cursor: 'pointer'
          }}
        >
          <div style={{ 
            width: '44px', height: '44px', borderRadius: '12px', background: `${n.color}15`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.color 
          }}>
            <Globe size={22} />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: '16px', fontWeight: '800' }}>{n.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{n.desc}</div>
          </div>
          <ChevronRight size={16} opacity={0.3} />
        </motion.button>
      ))}
    </div>
  );

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '100px', background: `${selectedNetwork.color}15`, marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: '900', color: selectedNetwork.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {selectedNetwork.label}
          </span>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>Withdrawal Details</h3>
      </div>

      <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>MINING BALANCE</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--neon-green)', marginTop: '4px' }}>{miningBalance.toFixed(2)} $YETC</div>
            <div style={{ fontSize: '12px', color: 'var(--premium-blue)', fontWeight: '700' }}>≈ ${(miningBalance * yetcPriceUsd).toFixed(2)} USD</div>
          </div>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0, 255, 157, 0.1)' }}>
            <Gem size={20} color="var(--neon-green)" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>AMOUNT TO WITHDRAW (YETC)</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
              <TrendingUp size={16} />
            </div>
            <input 
              type="number" 
              placeholder={`Min. ${minAmount} YETC`}
              className="premium-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ fontSize: '18px', fontWeight: '800', width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px 16px 16px 48px', color: 'white', outline: 'none' }}
            />
          </div>
          {amount && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
              Est. Value: <span style={{ color: 'var(--neon-green)' }}>${usdValue.toFixed(4)} USD</span>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>RECIPIENT WALLET ADDRESS</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
              <Wallet size={16} />
            </div>
            <input 
              placeholder="0x... or T..."
              className="premium-input"
              value={details.address || ''}
              onChange={(e) => setDetails({ ...details, address: e.target.value })}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px 16px 16px 48px', color: 'white', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF4D4D', fontSize: '13px', fontWeight: '600', padding: '12px', background: 'rgba(255, 77, 77, 0.1)', borderRadius: '12px' }}
        >
          <AlertCircle size={16} /> {error}
        </motion.div>
      )}

      <button className="btn-primary" onClick={handleNext} style={{ width: '100%', marginTop: 'auto', background: 'var(--neon-green)', color: 'black', border: 'none', padding: '18px', borderRadius: '16px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        Review Withdrawal <ArrowRight size={18} />
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>Final Review</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Confirm your mining withdrawal.</p>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Amount</span>
            <span style={{ fontWeight: '800', fontSize: '16px' }}>{parseFloat(amount).toLocaleString()} $YETC</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Platform Fee</span>
            <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--neon-green)' }}>FREE</span>
          </div>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>Total Payout (Est.)</span>
            <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--neon-green)' }}>${usdValue.toFixed(4)}</span>
          </div>
        </div>
        
        <div style={{ padding: '16px 24px', background: 'rgba(255, 255, 255, 0.04)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '4px', letterSpacing: '1px' }}>PAYOUT ADDRESS ({network})</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--premium-blue)', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            {details.address}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', gap: '12px', padding: '16px', borderRadius: '16px', 
        background: 'rgba(0, 209, 255, 0.05)', border: '1px solid rgba(0, 209, 255, 0.1)'
      }}>
        <ShieldCheck size={24} color="var(--premium-blue)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Mined coins withdrawals are processed within <span style={{ color: 'white', fontWeight: '700' }}>12-24 hours</span>. Please ensure your wallet supports the <span style={{ color: 'white', fontWeight: '700' }}>{network}</span> network.
        </p>
      </div>

      {error && <div style={{ color: '#FF4D4D', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

      <button 
        className="btn-primary" 
        onClick={handleSubmit} 
        disabled={loading}
        style={{ width: '100%', height: '56px', background: 'var(--neon-green)', color: 'black', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        {loading ? 'Processing...' : <><ShieldCheck size={20} /> Confirm Withdrawal</>}
      </button>
    </div>
  );

  const renderVerificationRequired = () => (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        style={{ width: '100px', height: '100px', borderRadius: '32px', background: 'rgba(0, 209, 255, 0.1)', border: '1px solid var(--premium-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}
      >
        <ShieldCheck size={54} color="var(--premium-blue)" />
      </motion.div>
      <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>Verification Required</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '40px', lineHeight: '1.6' }}>
        To ensure platform security and prevent abuse, mined coin withdrawals are restricted to <span style={{ color: 'var(--premium-blue)', fontWeight: '700' }}>Verified Users</span> only.
      </p>
      
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '40px', textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--premium-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', color: 'white' }}>1</div>
          <div style={{ fontSize: '14px', color: 'white', fontWeight: '600' }}>Get your Official Verification Badge</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--premium-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', color: 'white' }}>2</div>
          <div style={{ fontSize: '14px', color: 'white', fontWeight: '600' }}>Unlock unlimited mining withdrawals</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--premium-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', color: 'white' }}>3</div>
          <div style={{ fontSize: '14px', color: 'white', fontWeight: '600' }}>Enjoy priority processing (12-24h)</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button className="btn-primary" onClick={onBack} style={{ width: '100%', background: 'var(--premium-blue)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900' }}>Get Verified Now</button>
        <button className="btn-secondary" onClick={onBack} style={{ width: '100%', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '16px', borderRadius: '16px', fontWeight: '700' }}>Maybe Later</button>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {step < 4 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : onBack()}
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px', width: '44px', height: '44px', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          
          {user?.is_verified && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ width: '8px', height: '8px', borderRadius: '50%', background: step === s ? 'var(--neon-green)' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          )}
          
          <div style={{ width: '44px' }} />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={user?.is_verified ? step : 'unverified'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {!user?.is_verified ? renderVerificationRequired() : (
            <>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MiningWithdrawalPortal;
