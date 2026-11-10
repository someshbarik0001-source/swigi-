import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initDefaultDeviceLocation } from './utils/deviceLocation';

// Initialize device location by default at SRM University AP
initDefaultDeviceLocation();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


