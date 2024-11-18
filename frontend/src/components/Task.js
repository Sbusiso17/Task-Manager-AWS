import React from 'react';

const Task = ({ task, onUpdate, onDelete }) => {
  const handleToggle = () => {
    onUpdate(task.id, { ...task, completed: !task.completed });
  };

  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div 
        onClick={handleToggle} 
        className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
      >
        {task.title}
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="px-2 py-1 text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
};

export default Task;

```
