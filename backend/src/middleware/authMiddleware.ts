import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User.js';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token as string, (process.env.JWT_SECRET as string) || 'your_super_secret_key') as any;

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password') as IUser;

            if (!req.user) {
                res.status(401).json({ message: 'Not authorized, user not found' });
                return;
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
