import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n/config'; // Import i18n configuration

// Load Google Maps API dynamically with async loading for better performance
const loadGoogleMapsApi = () => {
  const STORAGE_KEY_USER_MAPS = 'time-traveller-user-maps-key';
  const savedMapsKey = localStorage.getItem(STORAGE_KEY_USER_MAPS);
  const mapsApiKey = savedMapsKey || import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (mapsApiKey) {
    const script = document.createElement('script');
    // Add loading=async parameter and marker library for AdvancedMarkerElement support
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places,marker&loading=async`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
};

loadGoogleMapsApi();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);