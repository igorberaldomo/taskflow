import React from "react";
import './register.css'
import { useState, useEffect } from "react";

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }
  const register = async () => {
    const user = {
      name: username,
      password: password
    }
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();

    if (data.name && data.password) {
      navigate('/display')
    }
    else{
      setError(data.err)
    }
  }

  return (
    <div className='app-register'>
      <div className='register'>
        <h2 className="title">Formulário de registro</h2>
        <div className='register-form'>
          <table>
            <tr>
              <td>
              <label htmlFor="register-username"> User:</label>
              </td>
              <td>
              <input type="text" placeholder="Username" className='register-username' onChange={handleUsernameChange} />
              </td>
            </tr>
            <tr>
              <td>
              <label htmlFor="register-password"> Password:</label>
              </td>
              <td>
              <input type="password" placeholder="Password" className='register-password' onChange={handlePasswordChange} />
              </td>
            </tr>
          </table>
        </div>

        <div className='register-buttonbox'>
          <button className='register-button' onClick={register}>Register</button>

        <a href="/">
          <button className='return-button'>Return</button>
        </a>
        </div>
        <div className="error">
        {error && <p >error: {error}</p>}
        </div>
      </div>
    </div>
  );
}