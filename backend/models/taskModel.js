import mongoose from "mongoose";

const taskScheme = mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: true,
        },
        duedate: {
            type: Number,
            require: true,
        },

    }
);

export const Task = mongoose.model('task', taskScheme);