import React from "react";
import 'login.css'

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);  
      }
    
      const handlePasswordChange = (event) => {
        setPassword(event.target.value);  
      }
    return (
        <div className='App-login'>
        <div className='login'>
          <h2> Login page</h2>
          <div className='login-form'>
          <label htmlFor="login-username"> User:
          <input type="text" placeholder="Username" className='login-username' onChange={handleUsernameChange}/>
          </label>
          <label htmlFor="login-password"> Password:
          <input type="password" placeholder="Password" className='login-password' onChange={handlePasswordChange}/>
          </label>
          </div>
          <div className='login-buttonbox'>
          <button className='login-button' onClick={() => changePage("loged")}>Login</button>
          <button className='login-button' onClick={() => changePage("register")} >Register</button>
          </div>
        </div>
      </div>
    )
}