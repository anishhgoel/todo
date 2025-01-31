const express = require('express');
const mongoose = require('mongoose')
const todoRoutes = require('./routes/todos')
require('dotenv').config();


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });



app.use('/api/todos', todoRoutes)


app.get('/', (req, res) => {
    res.send('Hello from the To-Do App API!');
  });
  

app.listen(PORT,() => {
  console.log(`Server listening on port :${PORT}`);
});


