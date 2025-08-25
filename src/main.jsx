import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // This should be the ONLY CSS import here
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)