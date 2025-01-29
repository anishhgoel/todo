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


module.exports = router