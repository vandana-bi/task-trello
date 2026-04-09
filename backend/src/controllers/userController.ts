import { Response } from 'express';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

/**
 * @desc    Get all users with role 'user'
 * @route   GET /api/users
 * @access  Private
 */
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
