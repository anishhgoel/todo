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