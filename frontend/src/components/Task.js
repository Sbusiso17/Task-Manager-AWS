```javascript
import React from 'react';

const Task = ({ task, onUpdate, onDelete }) => {
  const handleToggle = () => {
    onUpdate(task.id, { ...task, completed: !task.completed });
  };

  return (
    
      
      
        {task.title}
      
      <button
        onClick={() => onDelete(task.id)}
        className="px-2 py-1 text-red-500 hover:text-red-700"
      >
        Delete
      
    
  );
};

export default Task;
```
