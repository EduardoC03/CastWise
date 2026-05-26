import 'leaflet/dist/leaflet.css';
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Mock window.storage for standard browser environment
if (!window.storage) {
  window.storage = {
    get: async (key) => {
      const val = localStorage.getItem(key);
      return val ? { value: val } : null;
    },
    set: async (key, val) => {
      localStorage.setItem(key, val);
    },
    delete: async (key) => {
      localStorage.removeItem(key);
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
