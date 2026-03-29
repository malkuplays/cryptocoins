// Helper to interface with the Telegram WebApp SDK
export const getTelegramUser = () => {
  const tg = window.Telegram?.WebApp;
  if (!tg) return { id: 'mock_user_123', username: 'guest_user' }; // For testing in browser
  
  return tg.initDataUnsafe?.user || { id: 'mock_user_123', username: 'guest_user' };
};

export const expandTelegramApp = () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.expand();
    tg.ready();
    tg.enableClosingConfirmation();
  }
};

export const setHeaderColor = (color) => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.setHeaderColor(color);
  }
};
