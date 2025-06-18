import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Development mode logging
if (import.meta.env.DEV) {
  console.log('🚀 Development mode enabled - using Netlify functions for API calls');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
