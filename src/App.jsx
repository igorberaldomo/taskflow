import React from 'react'
import './App.css'
import { useState } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import login from './pages/login/login'
import register from './pages/register/register'
import display from './pages/display/display'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000'
})

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
