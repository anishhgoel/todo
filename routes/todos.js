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
        let nextTaskNumber = 1;

        const highestTaskNumberDoc = await todo_model.findOne().sort({ task_number: -1 }).limit(1);

        if (highestTaskNumberDoc) { // Check if a document with task_number exists
            nextTaskNumber = highestTaskNumberDoc.task_number + 1;
        }

       
        const newTodo = new todo_model({
            title : title,
            description : description,
            task_number : nextTaskNumber,
        });

        const savedTodo = await newTodo.save()
        res.status(201).json(savedTodo);
    }
    catch(error){
        console.error("Error creating todo:", error)
        res.status(400).json({error: "Failed to create to-do"});
    }
});




router.patch('/:id', async(req, res)=>{
    try{

    const {title, description, completed} = req.body
    const updatedTodo = await todo_model.findByIdAndUpdate(
        req.params.id,
        {title, description, completed},
        {new: true, runValidators : true}
    );
    if (!updatedTodo){
        return res.status(400).json({error :  "To-do item not found"
        })
    }
    res.json(updatedTodo)
} catch(error){
    console.error("Error updating todo", error)
    if (error.name === 'CastError' && error.kind === 'ObjectId'){
        return res.status(400).json({ error: 'Invalid to-do ID' });
    }
    res.status(500).json({error: "Failed to update- to-do"})
}

});



router.delete('/:id', async(req, res)=>{
    try{
        const deletedTodo = await todo_model.findByIdAndDelete(req.params.id)
        if (!deletedTodo){
            return res.status(400).json({error : "To-do item not found"})
        }
        res.status(204).end();
    } catch (error){
        console.error("Error deleting todo", error)
        if (error.name === 'CastError' && error.kind === 'ObjectId'){
            return res.status(400).json({ error: 'Invalid to-do ID' });
        }
        res.status(500).json({ error: 'Failed to delete to-do' });
    }
})





module.exports = router