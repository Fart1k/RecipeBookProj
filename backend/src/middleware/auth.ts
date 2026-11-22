import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from "../db.ts"

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({error: "Unauthenticated request: Missing token"});
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({error: "JWT Secret is not configured"});
    }

    let decoded;
    try {
        decoded = jwt.verify(token, jwtSecret);
    }
    catch (error) {
        return res.status(401).json({error: "Invalid or expired token"});
    }

    if (typeof decoded === "string" || !decoded.id || !decoded.role) {
        return res.status(401).json({error: "Invalid token"});
    }

    try {
        const user = await db.users.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({error: "User not found"});
        }

        if (user.UserStatus !== "verified") {
            return res.status(403).json({error: "Account is not active"});
        }

        (req as any).user = decoded;
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({error: "Internal server error"});
    }

    next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin privileges required" });
    }
    
    next();
};