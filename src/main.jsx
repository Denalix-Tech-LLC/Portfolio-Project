import React from 'react'
import ReactDOM from 'react-dom/client'

// Self-hosted variable fonts (no external request → faster, private, offline-safe).
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
