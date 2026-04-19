import React, { useState, useEffect } from "react";
import Header from "./componentes/Header";
import TaskList from "./componentes/TaskList";
import TaskInput from "./componentes/TaskInput";
import Footer from "./componentes/Footer";
import EmptyState from "./componentes/EmptyState";
import Login from "./componentes/Login";
import "./App.css";


interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [message, setMessage] = useState("");

  
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
  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const testPrivateApi = async () => {
    try {
      const res = await fetch("http://localhost:3000/private", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message || "Acceso denegado");
    } catch (err) {
      setMessage("Error al conectar");
    }
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <div className="user-controls">
        <button className="test-btn" onClick={testPrivateApi} title="Probar API Privada">
          🛡️
        </button>
        <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
      </div>
      {message && <div className="api-message">{message}</div>}
      
      <div className="input-section">
        <Header />
        <TaskInput addTask={addTask} />
      </div>

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