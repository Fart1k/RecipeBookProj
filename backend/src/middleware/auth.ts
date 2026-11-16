import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ error: 'Unauthenticated request: Missing token' });
    }
    jwt.verify(token, process.env.JWT_SECRET || 'a7bcb73e7e0540506fc45aed4054c6da5175160c1b772fe52b3747d9e5291469', (err: any, user: any) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }    
        (req as any).user = user;
        next();
    });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin privileges required" });
    }
    
    next();
};