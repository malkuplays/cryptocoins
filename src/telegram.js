// Helper to interface with the Telegram WebApp SDK
export const getTelegramUser = () => {
  const tg = window.Telegram?.WebApp;
  if (!tg) return { id: 'mock_user_123', username: 'guest_user' }; // For testing in browser
  
  return tg.initDataUnsafe?.user || { id: 'mock_user_123', username: 'guest_user' };
};

export const expandTelegramApp = () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    // Removed closing confirmation on user request
    // Force full-screen by calling expand again after a short delay
    setTimeout(() => {
      tg.expand();
    }, 500);
    // Set theme parameters
    if (tg.setHeaderColor) tg.setHeaderColor('#0B0B0F');
    if (tg.setBackgroundColor) tg.setBackgroundColor('#0B0B0F');
  }
};

export const triggerHaptic = (style = 'light') => {
  const tg = window.Telegram?.WebApp;
  if (tg?.HapticFeedback) {
    if (style === 'impact') tg.HapticFeedback.impactOccurred('medium');
    else if (style === 'notification_success') tg.HapticFeedback.notificationOccurred('success');
    else if (style === 'selection') tg.HapticFeedback.selectionChanged();
    else tg.HapticFeedback.impactOccurred('light');
  }
};

export const setHeaderColor = (color) => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.setHeaderColor(color);
  }
};
