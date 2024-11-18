```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';

const API_URL = process.env.REACT_APP_API_URL;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/tasks`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/api/tasks`, {
        title: newTask
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
      setError(null);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${taskId}`, updates);
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data : task
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  if (loading) return Loading tasks...;
  if (error) return Error: {error};

  return (
    
      Task Manager
      
      
        
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border rounded"
          />
          
            Add
          
        
      

      
        {tasks.map(task => (
          
        ))}
      
    
  );
};

export default TaskList;
```
