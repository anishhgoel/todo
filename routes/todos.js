const express = require('express')
const router = express.Router()
const todo_model = require('../models/todo')

router.get('/', async(req, res)=>{
    try{
        const todos = await todo_model.find()
        res.json(todos)
    } catch(error){
        res.status(500).json({error: 'Failed to fetch todos'})
    }
});



router.get('/:id', async(req, res)=>{
    try {
        const todos = await todo_model.findById(req.params.id)
        if (!todos){
            return res.status(400).json({error: "to-do id does not exist"})
        }
        res.json(todos);
    } catch(error){
        console.error("Error fetching by id", error);
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid to-do ID' }); // 400 Bad Request for invalid IDs
          }
        res.status(500).json({ error: 'Failed to fetch to-do' }); // 500 Internal Server Error
    }
})



router.post('/', async(req, res)=>{
    try{
        const {title, description}= req.body
        const newTodo = new todo_model({
            title,
            description
        })
        const savedTodo = await newTodo.save()
        res.status(201).json(savedTodo);
    }
    catch(error){
        console.error("Error creating todo:", error)
        res.status(400).json({error: "Failed to create to-do"});
    }
});

module.exports = router