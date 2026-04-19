import "./TaskCard.css";

//define como los props deberian lucir
type TaskCardProps = {
  text: string;
  completed: boolean;
  onDelete: () => void;
  onToggle: () => void;
};

function TaskCard({ text, completed, onDelete, onToggle }: TaskCardProps) {
  return (
    <li className={`task-item ${completed ? "completed" : ""}`}>
      <span onClick={onToggle} style={{ cursor: "pointer" }}>
        {text}
      </span>

      <button onClick={onDelete}>❌</button>
    </li>
  );
}

export default TaskCard;
