import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";

function Task({ taskName, taskProps, updateTask }) {
  const taskProgressRef = React.useRef(true);
  const timerRef = React.useRef(0);
  React.useEffect(() => {
    taskProgressRef.current = taskProps.isInProgress;
    console.log("taskName", taskName, " ? ", taskProps.isInProgress);
  });

  React.useEffect(() => {
    console.log("Effect Ran for task", taskName);
    let timerId;
    timerId = setInterval(() => {
      taskProgressRef.current &&
        updateTask(taskName, { totalTime: timerRef.current++ });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  function pauseOrResume() {
    // clear ID to stop timer or restart tim eby set inprogress to true
    taskProgressRef.current = !taskProgressRef.current;
    updateTask(taskName, { isInProgress: taskProgressRef.current });
  }

  return (
    <section className="task">
      <span>{taskName}</span>
      <button onClick={pauseOrResume}>
        {taskProps.isInProgress ? "pause" : "resume"}
      </button>
      <span>{taskProps.totalTime}</span>
    </section>
  );
}

function TaskList({ taskList, updateTask }) {
  return Object.entries(taskList).map(([taskName, taskProps]) => (
    <Task
      key={taskName}
      updateTask={updateTask}
      taskName={taskName}
      taskProps={taskProps}
    />
  ));
}

export default function App() {
  const [name, setName] = useState("");
  const [taskList, setTaskList] = useState({});

  function addTask() {
    if (!name) return;
    let task = {
      [name]: {
        isInProgress: true,
        totalTime: 0,
      },
    };

    setTaskList((tasks) => {
      for (let taskProps of Object.values(tasks)) {
        taskProps.isInProgress = false;
      }
      return Object.assign({}, tasks, task);
    });
  }

  function updateTask(name, propUpdate) {
    Object.entries(taskList).forEach(([taskName, taskProps]) => {
      if (name === taskName) {
        const task = {
          [name]: { ...taskProps, ...propUpdate },
        };
        setTaskList((tasks) => {
          return Object.assign({}, tasks, task);
        });
      }
    });
  }

  return (
    <div style={{ margin: 20 }}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={addTask}>Add Task</button>
      <TaskList taskList={taskList} updateTask={updateTask} />
    </div>
  );
}
