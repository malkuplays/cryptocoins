import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const SettingsContext = createContext({
  yetcPriceUsd: 10.00,
  miningRates: {
    whale:   { min: 60, max: 80 },
    pro:     { min: 40, max: 60 },
    starter: { min: 30, max: 50 },
  }
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [yetcPriceUsd, setYetcPriceUsd] = useState(10.00);
  const [miningRates, setMiningRates] = useState({
    whale:   { min: 60, max: 80 },
    pro:     { min: 40, max: 60 },
    starter: { min: 30, max: 50 },
  });

  const applySettings = (rows) => {
    const map = {};
    rows.forEach(r => { map[r.key] = r.value; });

    if (map.yetc_price_usd) setYetcPriceUsd(parseFloat(map.yetc_price_usd));

    setMiningRates(prev => ({
      whale: {
        min: map.whale_min_per_hour ? parseInt(map.whale_min_per_hour) : prev.whale.min,
        max: map.whale_max_per_hour ? parseInt(map.whale_max_per_hour) : prev.whale.max,
      },
      pro: {
        min: map.pro_min_per_hour ? parseInt(map.pro_min_per_hour) : prev.pro.min,
        max: map.pro_max_per_hour ? parseInt(map.pro_max_per_hour) : prev.pro.max,
      },
      starter: {
        min: map.starter_min_per_hour ? parseInt(map.starter_min_per_hour) : prev.starter.min,
        max: map.starter_max_per_hour ? parseInt(map.starter_max_per_hour) : prev.starter.max,
      },
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

    // Real-time listener for any setting change
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
    <SettingsContext.Provider value={{ yetcPriceUsd, miningRates }}>
      {children}
    </SettingsContext.Provider>
  );
};
