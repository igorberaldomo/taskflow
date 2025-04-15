import React from "react";
import './display.css'
import { useState, useEffect } from "react";
import CreateTask from "../../component/createTask/createTask";
export default function Display() {
  const [tasks, setTasks] = useState([])
  const [open , setOpen] = useState(false)

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
        {{if (open) {
          <CreateTask />
        }}}
        <link href='/'className='logout-button' onClick={logout} >Logout</link>
      </header>
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