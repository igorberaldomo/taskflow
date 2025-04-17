import React from "react";
import './createTask.css'
import { useState, useEffect } from "react";


export default function CreateTask() {
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
    const openCreateTask = () => {
        setOpen(!open)
      }
    return (
        <div className='app-createTask'>
            <div className='createTask'>
                <h2>Nova tarefa</h2>
                <label htmlFor="createTask-name"> Nome da tarefa:
                    <input type="text" placeholder="Name" className='createTask-name' onChange={handleTaskNameChange} />
                </label>
                <br />
                <label htmlFor="createTask-usename"> Nome do usuario:
                    <input type="text" placeholder="Username" className='createTask-username' onChange={handleUsernameChange} />
                </label>
                <div className='createTask-ajustablebox'>
                    <label htmlFor="createTask-done">
                        Status:
                        <select name="Done" id="Done" className='createTask-done' onChange={handleDoneChange}>
                            <option value="criado"> Criado</option>
                            <option value="em andamento"> Em andamento</option>
                            <option value="finalizado"> Finalizado</option>
                        </select>
                    </label>
                </div>
                <div className='createTask-buttonbox'>
                    <button className='create-button' onClick={createNewTask}> Create</button>
                    <button className='return-button' onClick={openCreateTask}> Cancel</button>
                </div>

            </div>


        </div>
    );
}