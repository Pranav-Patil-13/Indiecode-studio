import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import App from './App.jsx'
import './styles/variables.css'
import './styles/global.css'

// Notify Capacitor that the app is ready as early as possible to prevent rollbacks
if (Capacitor.isNativePlatform()) {
  CapacitorUpdater.notifyAppReady();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
