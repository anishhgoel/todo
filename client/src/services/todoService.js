// client/src/services/todoService.js

import axios from 'axios';

const API_URL = '/api/todos';

// Fetch all todos
export const getTodos = () => {
  return axios.get(API_URL);
};

// Create a new todo
export const createTodo = (todoData) => {
  return axios.post(API_URL, todoData);
};

// Update (PATCH) a todo by ID
export const updateTodo = (id, updatedFields) => {
  return axios.patch(`${API_URL}/${id}`, updatedFields);
};

// Delete a todo by ID
export const deleteTodo = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};