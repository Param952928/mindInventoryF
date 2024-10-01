import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TaskApp.css";

function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/task/fetch");
      setTasks(res.data.task);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const createTask = async () => {
    try {
      console.log("newTask: ", newTask);
      const res = await axios.post(
        "http://localhost:5000/api/v1/task/create",
        newTask
      );
      console.log("res --------> ", res.data);
        //   setTasks([...tasks, res.data.task]);
    fetchTasks();
      setShowModal(false);
      setNewTask({ title: "", description: "", completed: false });
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const updateTask = async (id, completed) => {
    try {
        console.log("update : ",`http://localhost:5000/api/v1/task/update/${id}`)
      const res = await axios.put(`http://localhost:5000/api/v1/task/update/${id}`, {
        completed,
      });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      console.log("url : ", `http://localhost:5000/api/v1/task/delete/${id}`);
      await axios.delete(`http://localhost:5000/api/v1/task/delete/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="task-app">
      <h1>Task Management Application</h1>

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        Create Task
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            ></textarea>
            <button className="btn btn-success" onClick={createTask}>
              Add Task
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.completed ? "Yes" : "No"}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => updateTask(task._id, !task.completed)}
                >
                  {task.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskApp;
