import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'

import HomePage from './components/homepage/HomePage.tsx'
import Login from './components/login.tsx'
import Prova from './components/prova.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path = "/" element = {<HomePage/>}/>    
      </Routes>
      <Routes>
        <Route path = "/login" element = {<Login/>}/>    
      </Routes>
    </Router>
  
  </StrictMode>,
)

