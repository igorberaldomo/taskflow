import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import login from './pages/login/login.js'
import register from './pages/register/register.js'
import display from './pages/display/display.js'

function App() {
  <Router>
    <Switch>
      <Route path="/" Component={login}>
        <Login />
      </Route>
      <Route path="/register" Component={register}>
        <Register />
      </Route>
      <Route path="/display" Component={display}>
        <Display />
      </Route>
    </Switch>
  </Router>
}


export default App
