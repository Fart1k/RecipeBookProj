import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ error: 'Unauthenticated request: Missing token' });
    }

    const jwtSecret = process.env.JWT_SECRET
    if(!jwtSecret) {
        return res.status(500).json({ error: "JWT Secret is not configured" })
    }

    try {
        const user = jwt.verify(token, jwtSecret)

        if (typeof user === "string" || !user.id || !user.role) {
            return res.status(401).json({ error: "Invalid token" })
        }

        (req as any).user = user
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }

    next()
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin privileges required" });
    }
    
    next();
};