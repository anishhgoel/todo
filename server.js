const express = require('express');
const mongoose = require('mongoose')
const todoRoutes = require('./routes/todos')

const app = express();
app.use(express.json());
const PORT =  process.env.PORT || 3000;



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://anishgoel:Q9FSlaDdAFljiecr@cluster0.98q7u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)  // using Mongoose to connect
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


