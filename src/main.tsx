import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'

import HomePage from './components/homepage/HomePage.tsx'
import Login from './components/login.tsx'

import SignIn from './components/signup_login/SignIn.tsx'
import SignUp from './components/signup_login/SignUp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>

      <Routes>
        <Route path = "/" element = {<SignIn/>}/>    
        <Route path = "/signup" element = {<SignUp/>}/>    
      </Routes>

    </Router>
  
  </StrictMode>,
)

