import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Info, AlertTriangle, CheckCircle, ArrowLeft, Clock,
  MessageCircle, Sparkles, Megaphone
} from 'lucide-react';
import { supabase } from '../supabase';

const Notifications = ({ user, onBack }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAllNotifications();
    }
  }, [user?.id]);

  const fetchAllNotifications = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Personal Alerts
      const { data: alerts, error: alertsError } = await supabase
        .from('alerts')
        .select('id, message, created_at')
        .eq('player_id', user.id);

      // 2. Fetch Global Notifications
      const { data: globalNotifs, error: globalError } = await supabase
        .from('global_notifications')
        .select('id, title, message, type, created_at');

      if (alertsError) throw alertsError;
      if (globalError) throw globalError;

      // 3. Combine and Format
      const combined = [
        ...(alerts || []).map(a => ({
          ...a,
          title: 'Direct Message',
          type: 'personal',
          icon: <MessageCircle size={18} color="#FF6B6B" />
        })),
        ...(globalNotifs || []).map(g => ({
          ...g,
          icon: getGlobalIcon(g.type)
        }))
      ];

      // 4. Sort by Date
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setNotifications(combined);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getGlobalIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} color="var(--neon-green)" />;
      case 'warning': return <AlertTriangle size={18} color="#FFB900" />;
      case 'info': 
      default: return <Megaphone size={18} color="var(--premium-blue)" />;
    }
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="container" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '10px', color: 'white', cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>Portal News</h1>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>STAY UPDATED</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-center" style={{ height: '300px' }}
          >
            <div className="loading-spinner" />
          </motion.div>
        ) : notifications.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ 
              textAlign: 'center', padding: '60px 20px', 
              background: 'rgba(255,255,255,0.02)', borderRadius: '24px',
              border: '1px dashed rgba(255,255,255,0.1)'
            }}
          >
            <Bell size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Quiet in here...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No notifications to show right now. Check back later!</p>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            variants={containerVariants} initial="hidden" animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {notifications.map((notif) => (
              <motion.div 
                key={notif.id}
                variants={itemVariants}
                style={{ 
                  padding: '16px', borderRadius: '20px',
                  background: notif.type === 'personal' ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 255, 255, 0.02))' : 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                {notif.type === 'personal' && (
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: '#FF6B6B' 
                  }} />
                )}
                
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {notif.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'white' }}>{notif.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        <Clock size={10} />
                        {getTimeAgo(notif.created_at)}
                      </div>
                    </div>
                    
                    <p style={{ 
                      fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)', 
                      margin: 0, wordBreak: 'break-word' 
                    }}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
