import { Request, Response } from 'express';
import Task from '../models/Task.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

/**
 * @desc    Create a new task
 * @route   POST /api/tasks/create
 * @access  Private (Assumed for now)
 */
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {

        const { title, description, assignedTo, status } = req.body;

        // assignedBy comes from the logged-in user (req.user)
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const assignedBy = req.user._id;

        const task = await Task.create({
            title,
            description,
            assignedBy,
            assignedTo,
            status: status || 'pending',
        });

        res.status(201).json(task);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Private
 */
export const getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find()
            .populate('assignedBy', 'name email')
            .populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedBy', 'name email')
            .populate('assignedTo', 'name email');

        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, assignedTo, status } = req.body;

        const task = await Task.findById(req.params.id);

        if (task) {
            task.title = title || task.title;
            task.description = description || task.description;
            task.assignedTo = assignedTo || task.assignedTo;
            task.status = status || task.status;

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
