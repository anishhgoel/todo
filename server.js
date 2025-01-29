const express = require('express');
const mongoose = require('mongoose')

const app = express();
const PORT = 3000;


mongoose.connect('mongodb://localhost:27017/tasksdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res)=>{
    res.send("Hello from to do app api")
});

app.listen(PORT,() => {
  console.log(`Server listening on port :${PORT}`);
});


