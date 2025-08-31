// Cache busting utilities
export const getCacheBustingUrl = (url) => {
  const timestamp = Date.now();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${timestamp}`;
};

export const clearBrowserCache = () => {
  // Force reload without cache
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
  
  // Clear localStorage
  localStorage.clear();
  sessionStorage.clear();
};

export const getAppVersion = () => {
  return process.env.REACT_APP_VERSION || Date.now().toString();
};