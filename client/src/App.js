import React, { useState, useEffect } from 'react';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './services/todoService';

// Material UI imports
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [error, setError] = useState(null);

  // Holds the todo currently being edited (or null if none)
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setError(null);
      const response = await getTodos();
      setTodos(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch todos');
    }
  };

  // Create a new todo
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await createTodo({
        title: newTitle,
        description: newDescription,
      });
      setTodos([...todos, response.data]);
      setNewTitle('');
      setNewDescription('');
    } catch (err) {
      console.error(err);
      setError('Failed to create todo');
    }
  };

  // Toggle completed status
  const handleToggleComplete = async (todo) => {
    try {
      setError(null);
      const updated = await updateTodo(todo._id, {
        completed: !todo.completed,
      });
      setTodos(
        todos.map((t) => (t._id === todo._id ? updated.data : t))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to update todo');
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      setError(null);
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete todo');
    }
  };

  // Save the updated title/description
  const handleSaveUpdate = async () => {
    if (!editingTodo) return;
    try {
      setError(null);
      const updated = await updateTodo(editingTodo._id, {
        title: editingTodo.title,
        description: editingTodo.description,
      });
      setTodos((prev) =>
        prev.map((t) => (t._id === editingTodo._id ? updated.data : t))
      );
      // Close the dialog
      setEditingTodo(null);
    } catch (err) {
      console.error(err);
      setError('Failed to update todo');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        To-Do App
      </Typography>

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* CREATE NEW TODO FORM */}
      <Box
        component="form"
        onSubmit={handleCreateTodo}
        sx={{
          mb: 4,
          p: 2,
          border: '1px solid #ccc',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Create a New Todo
        </Typography>
        <TextField
          label="Title"
          variant="outlined"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          sx={{ mr: 2, mb: 2 }}
        />
        <TextField
          label="Description"
          variant="outlined"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          sx={{ mr: 2, mb: 2 }}
        />
        <Box>
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Add Todo
          </Button>
        </Box>
      </Box>

      {/* TODO LIST */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Todo List
      </Typography>
      {todos.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No todos found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Task #</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todos.map((todo) => (
                <TableRow key={todo._id}>
                  <TableCell>{todo.task_number}</TableCell>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell>{todo.description}</TableCell>
                  <TableCell>
                    {todo.completed ? (
                      <Chip label="Completed" color="success" />
                    ) : (
                      <Chip label="Not Completed" color="warning" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => setEditingTodo(todo)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleToggleComplete(todo)}
                      sx={{ mr: 1 }}
                    >
                      {todo.completed
                        ? 'Mark Incomplete'
                        : 'Mark Complete'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteTodo(todo._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* EDIT DIALOG (Modal) */}
      <Dialog
        open={Boolean(editingTodo)}
        onClose={() => setEditingTodo(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          {editingTodo && (
            <>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                value={editingTodo.title}
                onChange={(e) =>
                  setEditingTodo((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                value={editingTodo.description}
                onChange={(e) =>
                  setEditingTodo((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTodo(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;