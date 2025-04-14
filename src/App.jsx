import React from 'react'
import './App.css'
import { useState } from 'react'



function App() {
  const [page, setPage] = useState("login")

  function changePage(page) {
    setPage(page)
  }
  
  if (page == "logged") {
    return (
      <div>
        <header className="App-header">
          <button className='logged-button' onClick={() => changePage("createTask")} >New task</button>
          <button className='logged-button' onClick={() => changePage("login")} >Logout</button>
        </header>
        <div className="App">
          <div className='created-task' >
            <div className='created-task-title'>CREATED</div>
            <div className='created-task-list'></div>
          </div>
          <div className='assigned-task'>
            <div className='assigned-task-title'>ASSIGNED</div>
            <div className='assigned-task-list'></div>
          </div>
          <div className='done-task'>
            <div className='done-task-title'>DONE</div>
            <div className='done-task-list'></div>
          </div>
        </div>
      </div>
    )
  }
  if (page == "login"){
    return (
      <div className='App-login'>
        <div className='login'>
          <div className='login-form'>
          <label htmlFor="login-username"> User:
          <input type="text" placeholder="Username" className='login-username' />
          </label>
          <label htmlFor="login-password"> Password:
          <input type="password" placeholder="Password" className='login-password'/>
          </label>
          </div>
          <div className='login-buttonbox'>
          <button className='login-button' onClick={() => changePage("logged")}>Login</button>
          <button className='login-button' onClick={() => changePage("register")} >Register</button>
          </div>
        </div>

      </div>
    )
  }
  if (page == "register"){
    return (
      <div className='app-register'>
        <div className='register'>
          <h2>Formulário de registro</h2>
          <div className='register-form'>
          <label htmlFor="register-username"> User:
          <input type="text" placeholder="Username" className='register-username' />
          </label>
          <label htmlFor="register-password"> Password:
          <input type="password" placeholder="Password" className='register-password'/>
          </label>
          </div>
          <div className='register-buttonbox'>
          <button className='register-button' >Register</button>
          </div>
          <button className='return-button' onClick={() => changePage("login")} >return</button>
        </div>
      </div>
    )
  }
  if (page == "createTask"){
    return (
      <div className='app-createTask'>
        <div className='createTask'>
          <h2>Nova tarefa</h2>
          <label htmlFor="createTask-name"> Nome da tarefa:
          <input type="text" placeholder="Name" className='createTask-name' />
          </label>
          <label htmlFor="createTask-usename"> Nome do usuario:
            <input type="text" placeholder="Username" className='createTask-username' />
          </label>
          <div className='createTask-ajustablebox'>
          <label htmlFor="createTask-done">
            Status: 
            <select name="Done" id="Done" className='createTask-done'>
              <option value="criado"> Criado</option>
              <option value="em andamento"> Em andamento</option>
              <option value="finalizado"> Finalizado</option>
            </select>
          </label>
          </div>
          <div className='createTask-buttonbox'>
          <button className='create-button' >Create</button>
          <button className='return-button' onClick={() => changePage("logged")} >Return</button>
          </div>

        </div>
        

      </div>
    )
  }
}


export default App
