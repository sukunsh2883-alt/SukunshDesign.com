import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely suppress benign browser ResizeObserver cycle limitation warnings
if (typeof window !== 'undefined') {
  const resizeObserverErrorMsgs = [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications'
  ];
  
  const errorHandler = (event: ErrorEvent) => {
    if (resizeObserverErrorMsgs.some(msg => event.message && event.message.includes(msg))) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  };

  window.addEventListener('error', errorHandler, true);

  const origOnError = window.onerror;
  window.onerror = (msg, url, line, col, error) => {
    if (typeof msg === 'string' && resizeObserverErrorMsgs.some(m => msg.includes(m))) {
      return true;
    }
    if (origOnError) return origOnError(msg, url, line, col, error);
    return false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
