import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description: string;
    assignedBy: mongoose.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId;
    status: 'pending' | 'on progress' | 'on review' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please specify who the task is assigned to'],
        },
        status: {
            type: String,
            enum: ['pending', 'on progress', 'on review', 'completed'],
            default: 'pending',
            required: [true, 'Please provide a status'],
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
