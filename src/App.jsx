import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login/login.js'
import Register from './pages/register/register.js'
import Display from './pages/display/display.js'

function App() {
  return(
  <Router>
    <Routes>
      <Route path="/"  element={<Login />}>
      
      <Route path="register" element={<Register />}/>

      <Route path="display"  element={<Display />}/>
      </Route>
    </Routes>
  </Router>
  )
}


export default App
