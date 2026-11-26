import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db.ts";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

    const token = bearerToken || req.cookies?.accessToken;
    if (!token || typeof token !== "string") {
        return res.status(401).json({error: "Unauthenticated request: Missing token"});
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({error: "JWT Secret is not configured"});
    }

    let decoded;
    try {
        decoded = jwt.verify(token, jwtSecret, {algorithms: ["HS256"]});
    } 
    catch {
        return res.status(401).json({error: "Invalid or expired token"});
    }

    if (typeof decoded === "string") {
        return res.status(401).json({error: "Invalid token"});
    }

    const userId = typeof decoded.id === "string" ? decoded.id : decoded.sub;
    if (!userId || typeof userId !== "string") {
        return res.status(401).json({error: "Invalid token"});
    }

    try {
        const user = await db.users.findByPk(userId);
        if (!user) {
            return res.status(401).json({error: "User not found"});
        }

        if (user.UserStatus !== "verified") {
            return res.status(403).json({error: "Account is not active"});
        }

        const credential = await db.credential.findByPk(user.CredentialId);
        if (!credential) {
            return res.status(500).json({error: "User role was not found"});
        }

        (req as any).user = {
            id: user.id,
            email: user.EmailAddress,
            role: credential.UserType
        };

        res.locals.userId = user.id;
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
        return res.status(403).json({
            error: "Access denied. Admin privileges required"
        });
    }

    next();
};