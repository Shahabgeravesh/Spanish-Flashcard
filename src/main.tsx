import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/themes.css'
import './styles/base.css'
import './index.css'
import App from './App.tsx'
import './App.css'
import './styles/hub.css'
import './styles/flashcard.css'
import './styles/stories.css'
import './styles/responsive.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
