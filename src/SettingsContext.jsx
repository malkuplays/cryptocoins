import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const SettingsContext = createContext({ yetcPriceUsd: 10.00 });

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [yetcPriceUsd, setYetcPriceUsd] = useState(10.00);

  useEffect(() => {
    // Fetch price on mount
    const fetchPrice = async () => {
      try {
        const { data } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'yetc_price_usd')
          .single();
        if (data?.value) setYetcPriceUsd(parseFloat(data.value));
      } catch (err) {
        console.error('Failed to fetch YETC price:', err);
      }
    };
    fetchPrice();

    // Listen for real-time changes
    const channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'app_settings',
        filter: 'key=eq.yetc_price_usd'
      }, (payload) => {
        if (payload.new?.value) {
          setYetcPriceUsd(parseFloat(payload.new.value));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <SettingsContext.Provider value={{ yetcPriceUsd }}>
      {children}
    </SettingsContext.Provider>
  );
};
