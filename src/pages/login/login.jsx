import React from "react";
import './login.css'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';



export default function Login() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const login = async () => {
    const user = {
      name: username,
      password: password
    }
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    console.log(data)
    if (data.name && data.password) {
      navigate('/display')
    }
    else{
      setError(data.message)
    }
  }
  
  return (
    <div className='App-login'>
      <div className='login'>
        <h2> Login page</h2>
        <div className='login-form'>
          <label htmlFor="login-username"> User:
            <input type="text" placeholder="Username" className='login-username' onChange={handleUsernameChange} />
          </label>
          <label htmlFor="login-password"> Password:
            <input type="password" placeholder="Password" className='login-password' onChange={handlePasswordChange} />
          </label>
        </div>
        <div className='login-buttonbox'>

          <button className='login-button' onClick={login} >Login</button>

          <a href="/register">
            <button className='login-button'>Register</button>
          </a>
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  )
}