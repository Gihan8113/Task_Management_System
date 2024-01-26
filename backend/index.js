import express, { request, response } from "express";
import {PORT, mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import { Task } from "./models/taskModel.js";

const app = express();

app.use(express.json());

app.get('/', (request,response) => {
    console.log(request)
    return response.status(234).send('welcome to task management system');
});

// route for save new task (CREATE)

app.post('/tasks', async (request,response) => {
    try {
        if(
            !request.body.title ||
            !request.body.description ||
            !request.body.duedate
        ) {
            return response.status.send({
                message: 'Send all required fields: title,description,duedate',
            });
        }
        const newTask = {
            title:request.body.title,
            description:request.body.description,
            duedate:request.body.duedate,
        };

        const task = await Task.create(newTask);
        return response.status(201).send(task);

    }catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
}

);

// Route for get all tasks from database (READ)
app.get('/tasks', async (request,response) => {
    try {
        const tasks = await Task.find({});

        return response.status(200).json(tasks);

    }catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
}    
);

// Route for get one tasks from database with its id (READ)
app.get('/tasks/:id', async (request,response) => {
    try {
        const {id} = request.params;
        const task = await Task.findById(id);

        return response.status(200).json(task);

    }catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
}    
);

// Route for update task (UPDATE)
app.put('/tasks/:id',async (request,response) => {
    try {
        if(
            !request.body.title ||
            !request.body.description ||
            !request.body.duedate
        ){
            return response.status.send({
                message: 'Send all required fields: title,description,duedate',
            });   

        }

        const {id} = request.params;
        const result = await Task.findByIdAndUpdate(id,request.body);

        if (!result){
            return response.status(404).json({message:'Task not found'})
        }

        return response.status(200).send({message:'Task updated sucessfully'});
    }catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
})

// Route for Delete task (DELETE)
app.delete('/tasks/:id',async(request,response) => {
    try{
        const {id} = request.params;
        const result = await Task.findByIdAndDelete(id);

        if (!result){
            return response.status(404).json({message:'Task not found'})
        }

        return response.status(200).send({message:'Task deleted sucessfully'});

    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});

    }
});



mongoose
    .connect(mongoDBURL)
    .then(() =>{
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listeing to port: ${PORT}`);
        });
    })
    .catch((error) =>{
        console.log(error);
    });