import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './components/home/Home.tsx'
import Header from './components/header/Header.tsx'
import Footer from './components/footer/Footer.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <Home />
    <Footer />
  </StrictMode>,
)
