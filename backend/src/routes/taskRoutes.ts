import express from 'express';
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
} from '../controllers/taskControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/create', createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);

export default router;
