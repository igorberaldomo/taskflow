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


    if (data.message) {

      localStorage.setItem('token', data.token)
      navigate('/display')
      //{ replace: true , state:{token: data.token}}
    }
    else {

      setError(data.err)
    }
  }

  return (

    <div className='App-login'>
      <div className='login'>
        <h2 className='title'> Login page</h2>
        <div className='login-form'>
          <table>
            <tbody>
              <tr>
                <td><label htmlFor="login-username"> User:</label></td>
                <td>
                  <input type="text" placeholder="Username" className='login-username' onChange={handleUsernameChange} />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="login-password"> Password:</label>
                </td>
                <td>
                  <input type="password" placeholder="Password" className='login-password' onChange={handlePasswordChange} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='login-buttonbox'>
          <a href="/register">
            <button className='register-button'>Register</button>
          </a>
          <button className='login-button' onClick={login} >Login</button>

        </div>
        <div className="error">
          {error && <p >{error}</p>}
        </div>
      </div>
    </div>
  )
}