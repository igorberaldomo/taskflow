import React from "react";
import './display.css'

export default function Display() {
    return (
        <div>
        <header className="App-header">
          <button className='newTask-button' onClick={() => changePage("createTask")} >New task</button>
          <button className='logout-button' onClick={() => changePage("login")}  >Logout</button>
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
    );
}