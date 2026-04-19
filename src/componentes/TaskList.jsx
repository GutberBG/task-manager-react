import TaskCard from "./TaskCard";

function TaskList({ tasks, deleteTask, toggleTask }) {
  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          text={task.text}
          completed={task.completed}
          onDelete={() => deleteTask(task.id)} 
          onToggle={() => toggleTask(task.id)}
        />
      ))}
    </div>
  );
}

export default TaskList;