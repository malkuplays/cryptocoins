import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const DEFAULT_PLANS = [
  { 
    id: 'starter',
    name: 'Starter Mover', 
    price: 1000, 
    power: 0.5, 
    period: '30 Days',
    features: ['0.5 $YETC / Hour', 'Basic Dashboard', 'Email Support']
  },
  { 
    id: 'pro',
    name: 'Pro Miner', 
    price: 2999, 
    power: 2.0, 
    period: '90 Days',
    features: ['2.0 $YETC / Hour', 'Advanced Analytics', 'Priority Support', 'Early Listing Access']
  },
  { 
    id: 'whale',
    name: 'Whale Staker', 
    price: 6999, 
    power: 6.0, 
    period: '365 Days',
    features: ['6.0 $YETC / Hour', 'VIP Community', '24/7 Personal Support', 'Max Staking Period']
  }
];

const SettingsContext = createContext({
  yetcPriceUsd: 10.00,
  miningRates: {
    whale:   { min: 60, max: 80 },
    pro:     { min: 40, max: 60 },
    starter: { min: 30, max: 50 },
  },
  plans: DEFAULT_PLANS
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [yetcPriceUsd, setYetcPriceUsd] = useState(10.00);
  const [miningRates, setMiningRates] = useState({
    whale:   { min: 60, max: 80 },
    pro:     { min: 40, max: 60 },
    starter: { min: 30, max: 50 },
  });
  const [plans, setPlans] = useState(DEFAULT_PLANS);

  const applySettings = (rows) => {
    const map = {};
    rows.forEach(r => { map[r.key] = r.value; });

    if (map.yetc_price_usd) setYetcPriceUsd(parseFloat(map.yetc_price_usd));

    // Update mining rates using consolidated keys
    setMiningRates(prev => ({
      whale: {
        min: map.whale_min ? parseInt(map.whale_min) : prev.whale.min,
        max: map.whale_max ? parseInt(map.whale_max) : prev.whale.max,
      },
      pro: {
        min: map.pro_min ? parseInt(map.pro_min) : prev.pro.min,
        max: map.pro_max ? parseInt(map.pro_max) : prev.pro.max,
      },
      starter: {
        min: map.starter_min ? parseInt(map.starter_min) : prev.starter.min,
        max: map.starter_max ? parseInt(map.starter_max) : prev.starter.max,
      },
    }));

    // Dynamically update plan prices if present in DB
    setPlans(prev => prev.map(plan => {
      const dbPriceKey = `${plan.id}_price_inr`;
      if (map[dbPriceKey]) {
        return { ...plan, price: parseInt(map[dbPriceKey]) };
      }
      return plan;
    }));
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data } = await supabase.from('app_settings').select('key, value');
        if (data) applySettings(data);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchAll();

    const channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'app_settings'
      }, (payload) => {
        if (payload.new?.key && payload.new?.value) {
          applySettings([payload.new]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <SettingsContext.Provider value={{ yetcPriceUsd, miningRates, plans }}>
      {children}
    </SettingsContext.Provider>
  );
};

