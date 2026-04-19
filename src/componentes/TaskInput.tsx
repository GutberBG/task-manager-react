import { useState } from "react";
import "./TaskInput.css";

function TaskInput({ addTask }: { addTask: (task: string) => void }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (text.trim() === "") {
      setError("⚠️ La tarea no puede estar vacía");

      setTimeout(() => setError(""), 2000);
      return;
    }

    addTask(text);
    setText("");
    setError("");
  };

  return (
    <>
    <div className="input-container">
      <input
        type="text"
        placeholder="Escribe una tarea..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Agregar</button>
    </div>
     {error && <p className="error-message">{error}</p>}
     </>
  );
}

export default TaskInput;
