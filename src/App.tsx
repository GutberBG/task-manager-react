import React, { useState, useEffect } from "react";
import Header from "./componentes/Header";
import TaskList from "./componentes/TaskList";
import TaskInput from "./componentes/TaskInput";
import Footer from "./componentes/Footer";
import EmptyState from "./componentes/EmptyState";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const addTask = (newTaskText: string) => {
    const newTask = { text: newTaskText, completed: false };

    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((savedTask) => {
        setTasks([...tasks, savedTask]);
      });
  };

  const deleteTask = (idToDelete: number) => {
    fetch(`http://localhost:3000/tasks/${idToDelete}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setTasks(tasks.filter((task) => task.id !== idToDelete));
        }
      })
      .catch((err) => console.error("Error al borrar:", err));
  };

  const toggleTask = (idToToggle: number) => {
  const taskToUpdate = tasks.find(t => t.id === idToToggle);
  if (!taskToUpdate) return;

  fetch(`http://localhost:3000/tasks/${idToToggle}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      completed: !taskToUpdate.completed
    }),
  })
    .then((res) => res.json())
    .then((updatedTaskFromServer) => {
      const newTasks = tasks.map((task) =>
        task.id === idToToggle ? updatedTaskFromServer : task
      );
      setTasks(newTasks);
    })
    .catch((err) => console.error("Error al actualizar:", err));
};

  return (
    <div className="app-container">
      <Header />
      <TaskInput addTask={addTask} />

      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <TaskList
          tasks={tasks}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
        />
      )}
      
      <Footer total={totalTasks} pending={pendingTasks} />
    </div>
  );
}

export default App;