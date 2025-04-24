import React from "react";
import './display.css'
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Display() {
  const [tasks, setTasks] = useState([])
  const [open, setOpen] = useState(false)
  const [taskName, setTaskName] = useState("")
  const [done, setDone] = useState("created")
  const [error, setError] = useState("")
  const [errorCode, setErrorcode] = useState("")
  const [description, setDescription] = useState("")

  const navigate = useNavigate();

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  }

  const deleteTask = async (taskID) => {

    const response = await fetch(`http://localhost:3000/tasks/${taskID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json()
    const statusCode = response.status;

    if (data.err === 'Unauthorized') {
      localStorage.removeItem('token')
      navigate('/')
    }
    if (data.err == 'Error deleting task') {
      setError(data.err)
      setErrorcode(statusCode)
    }
    if (data.message) {
      navigate('/display')
    }
  }
  const createNewTask = async () => {
    const task = {
      taskname: taskName,
      description:description,
      done: done,
    }
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(task),
    });
    const data = await response.json();

    if (data.err === 'Unauthorized') {
      localStorage.removeItem('token')
      navigate('/')
    }
    if (data.err == 'Error creating task') {
      setError(data.err)
    }
    if (data.message) {
      navigate('/display')
    }
  }
  const updatetask= async (taskID, taskName, done, position ) => {
    if (position == 1){
      done = "created"
    }
    if (position == 2){
      done = "assigned"
    }
    if (position == 3){
      done = "done"
    }
    const task = {
      taskID:taskID,
      taskname: taskName,
      done: done,
    }
    const response = await fetch(`http://localhost:3000/tasks`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(task),
    });
    const data = await response.json();

    if (data.err === 'Unauthorized') {
      localStorage.removeItem('token')
      navigate('/')
    }
    if (data.err == 'Error creating task') {
      setError(data.err)
    }
    if (data.message) {
      navigate('/display')
    }
  }
  useEffect(() => {
    const fetchAllTasks = async () => {
      const tasks = await fetch('http://localhost:3000/tasks',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
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
    navigate('/')
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
          <tbody>
          <tr>
            <td>
              <label htmlFor="createTask-taskname"> Nome da tarefa:</label>
            </td>
            <td>
              <input type="text" placeholder="taskName" className='createTask-name' onChange={handleTaskNameChange} />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="createTask-done">descrição:</label>
            </td>
            <td>
              <input type="text" placeholder="description" className="createTask-description" onChange={handleDescriptionChange}  />
            </td>
          </tr>
          <tr>
            <td>
            {error && <p >{errorCode} - {error}</p>}
            </td>
          </tr>
          </tbody>
        </table>
        <div className='createTask-buttonbox'>
        <button className='cancel-button' onClick={openCreateTask}> Cancel</button>
          <button className='create-button' onClick={createNewTask}> Create</button>
        </div>
      </div>}
      <div className="App">
        <div className='created-task' >
          <div className='created-task-title'>CREATED</div>
          <div className='created-task-list'>
            {tasks.map((task) => {
              if (task.done === "created") {
                return <div className='task-box' key={task.taskID}>
                  <table>
                    <tbody>
                      <tr>
                      <td className="title-td">
                          <p className='task-name'>{task.username} - {task.taskname}</p>
                        </td>
                        <td>
                        </td>
                        <td className="limited-width">
                          <button className='delete-button' onClick={e=>{deleteTask(task.taskID)}} >X</button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                        <p className='description'>{task.description}</p>
                        </td>
                        <td>

                        </td>
                        <td>
                          <button className="update-button" onClick={e => {updatetask(task.taskID, task.taskname,task.done, 2)}}>Start</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
            })}
          </div>
        </div>
        <div className='assigned-task'>
          <div className='assigned-task-title'>ASSIGNED</div>
          <div className='assigned-task-list'>
          {tasks.map((task) => {
              if (task.done === "assigned") {
                return <div className='task-box' key={task.taskID}>
                  <table>
                    <tbody>
                      <tr>
                      <td className="title-td">
                          <p className='task-name'>{task.username} - {task.taskname}</p>
                        </td>
                        <td></td>
                        <td className="limited-width">
                          <button className='delete-button' onClick={e=>{deleteTask(task.taskID)}} >X</button>
                        </td>
                      </tr>
                      <tr>
                      <td>
                        <p className='description'>{task.description}</p>
                        </td>
                        <td >
                          <button className="update-button" onClick={e => {updatetask(task.taskID, task.taskname,task.done, 1)}}>Return</button>
                        </td>
                        <td >
                          <button className="update-button" onClick={e => {updatetask(task.taskID, task.taskname,task.done, 3)}}>Finish</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
            })}
          </div>
        </div>
        <div className='done-task'>
          <div className='done-task-title'>DONE</div>
          <div className='done-task-list'>
          {tasks.map((task) => {
              if (task.done === "done") {
                return <div className='task-box' key={task.taskID}>
                  <table>
                    <tbody>
                      <tr>
                        <td className="title-td">
                          <p className='task-name'>{task.username} - {task.taskname}</p>
                        </td>
                        <td>
                        </td>
                        <td className="limited-width">
                          <button className='delete-button' onClick={e=>{deleteTask(task.taskID)}} >X</button>
                        </td>
                      </tr>
                      <tr>
                      <td>
                        <p className='description'>{task.description}</p>
                        </td>
                        <td>

                        </td>
                        <td>
                          <button className="update-button" onClick={e => {updatetask(task.taskID, task.taskname,task.done, 2)}}>Return</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
            })}
          </div>
        </div>
      </div>
    </div >
  );
}