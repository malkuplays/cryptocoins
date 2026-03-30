import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Mail, Phone, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase';
import { triggerHaptic } from '../telegram';

const ProfileSetup = ({ user, onComplete }) => {
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    dob: '',
    email: '',
    whatsapp_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.email || !formData.whatsapp_number) {
      setError('All fields are required.');
      triggerHaptic('notification_error');
      return;
    }

    setLoading(true);
    triggerHaptic('impact');

    try {
      const { data, error: dbError } = await supabase
        .from('players')
        .update({
          name: formData.name,
          dob: formData.dob,
          email: formData.email,
          whatsapp_number: formData.whatsapp_number,
          profile_completed: true,
          is_onboarded: true
        })
        .eq('id', user.id)
        .select()
        .single();

      if (dbError) throw dbError;
      
      triggerHaptic('notification_success');
      onComplete(data);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '16px 16px 16px 44px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    marginBottom: '16px'
  };

  const iconStyle = {
    position: 'absolute',
    left: '16px',
    top: '16px',
    color: 'var(--text-muted)'
  };

  return (
    <div className="container" style={{ padding: 'calc(env(safe-area-inset-top) + 20px) 24px env(safe-area-inset-bottom)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
             <div className="icon-box-v2" style={{ border: 'none', background: 'transparent' }}>
                <User size={48} className="glow-text-green" />
             </div>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', marginBottom: '8px' }}>
            Complete <span style={{ color: 'var(--neon-green)' }}>Profile</span>
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
            Your payment is approved! We just need a few details to finalize your account setup.
          </p>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            
            <div style={{ position: 'relative' }}>
              <User size={20} style={iconStyle} />
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                style={inputStyle}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Calendar size={20} style={iconStyle} />
              <input 
                type="date" 
                required
                style={{...inputStyle, paddingLeft: '44px', color: formData.dob ? 'white' : 'var(--text-muted)'}}
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Mail size={20} style={iconStyle} />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                style={inputStyle}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Phone size={20} style={iconStyle} />
              <input 
                type="tel" 
                placeholder="WhatsApp Number" 
                required
                style={inputStyle}
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
              />
            </div>

            {error && (
              <div style={{ color: '#ff3b30', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <motion.button 
              type="submit"
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              disabled={loading}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}
            >
              {loading ? 'Saving...' : 'Finish Setup'} <ChevronRight size={20} />
            </motion.button>
          </form>

        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;
