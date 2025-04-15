import React from "react";
import './register.css'

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }
  const register = async () => {
    const user = {
      username: username,
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
    console.log(data);
  }

  return (
    <div className='app-register'>
      <div className='register'>
        <h2>Formulário de registro</h2>
        <div className='register-form'>
          <label htmlFor="register-username"> User:
            <input type="text" placeholder="Username" className='register-username' onChange={handleUsernameChange} />
          </label>
          <label htmlFor="register-password"> Password:
            <input type="password" placeholder="Password" className='register-password' onChange={handlePasswordChange} />
          </label>
        </div>
        <div className='register-buttonbox'>
          <button className='register-button' >Register</button>
        </div>
        <link href="/" className='return-button' > Return</link>
      </div>
    </div>
  );
}