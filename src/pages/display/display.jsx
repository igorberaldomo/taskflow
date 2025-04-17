import React from "react";
import './display.css'
import { useState, useEffect } from "react";

export default function Display() {
  const [tasks, setTasks] = useState([])
  const [open, setOpen] = useState(false)
  const [taskName, setTaskName] = useState("")
  const [done, setDone] = useState("")
  const [username, setUsername] = useState("")

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }
  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  }
  const handleDoneChange = (event) => {
    setDone(event.target.value);
  }

  const createNewTask = async () => {
    const task = {
      name: taskName,
      done: done,
      username: username
    }
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    const data = await response.json();
    console.log(data);
  }

  useEffect(() => {
    const fetchAllTasks = async () => {
      const tasks = await fetch('http://localhost:3000/tasks')
      const tasksJson = await tasks.json()

      setTasks(tasksJson)
    }

    fetchAllTasks()
  })

  const openCreateTask = () => {
    setOpen(!open)
  }

  const logout = async () => {
    setTasks([])
  }

  return (
    <div>
      <header className="App-header">
        <button className='newTask-button' onClick={openCreateTask}>New task</button>
        <a href="/">
          <button className='logout-button' onClick={logout}>Logout</button>
        </a>
      </header>
      {open && <div className="Createtask">
        <h2>Nova tarefa</h2>
        <table>
          <tr>
            <td>
              <label htmlFor="createTask-name"> Nome da tarefa:</label>
            </td>
            <td>
              <input type="text" placeholder="Name" className='createTask-name' onChange={handleTaskNameChange} />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="createTask-usename"> Nome do usuario:</label>
            </td>
            <td>
              <input type="text" placeholder="Username" className='createTask-username' onChange={handleUsernameChange} />
            </td>
          </tr>
          <tr>
          <td>
            <label htmlFor="createTask-done">Status:</label>
          </td>
          <td>
            <select name="Done" id="Done" className='createTask-done' onChange={handleDoneChange}>
              <option value="criado"> Criado</option>
              <option value="em andamento"> Em andamento</option>
              <option value="finalizado"> Finalizado</option>
            </select>
          </td>
          </tr>
        </table>
        <div className='createTask-buttonbox'>
          <button className='create-button' onClick={createNewTask}> Create</button>
          <button className='cancel-button' onClick={openCreateTask}> Cancel</button>
        </div>
      </div>}
      <div className="App">
        <div className='created-task' >
          <div className='created-task-title'>CREATED</div>
          <div className='created-task-list'>
            {tasks.map((task) => {
              if (task.done === "created") {
                return <div className='task-item'>{task.name}</div>
              }
            })}
          </div>
        </div>
        <div className='assigned-task'>
          <div className='assigned-task-title'>ASSIGNED</div>
          <div className='assigned-task-list'>
            {tasks.map((task) => {
              if (task.done === "assigned") {
                return <div className='task-item'>{task.name}</div>
              }
            })}
          </div>
        </div>
        <div className='done-task'>
          <div className='done-task-title'>DONE</div>
          <div className='done-task-list'>
            {tasks.map((task) => {
              if (task.done === "done") {
                return <div className='task-item'>{task.name}</div>
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}