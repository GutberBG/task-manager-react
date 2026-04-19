import "./TaskCard.css";

//define como los props deberian lucir
type TaskCardProps = {
  id: number;
  text: string;
  completed: boolean;
  onDelete: () => void;
  onToggle: () => void;
};

function TaskCard({ id, text, completed, onDelete, onToggle }: TaskCardProps) {
  return (
    <div className={`task-card ${completed ? "completed" : ""}`}>
      <div className="card-header">
        <span className="task-id">#{id}</span>
        <button className="delete-btn" onClick={onDelete} aria-label="Eliminar tarea">
          ✕
        </button>
      </div>
      <div className="card-body">
        <p className="task-text">{text}</p>
      </div>
      <div className="card-footer">
        <label className="checkbox-container">
          <input 
            type="checkbox" 
            checked={completed} 
            onChange={onToggle} 
          />
          <span className="checkmark"></span>
          <span className="status-text">{completed ? "Completada" : "Pendiente"}</span>
        </label>
      </div>
    </div>
  );
}


export default TaskCard;
