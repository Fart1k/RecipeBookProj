import type { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { db } from "../db.ts";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token || typeof token !== "string") {
        return res.status(401).send({ error: "You must be logged in" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).send({ error: "JWT secret is not configured" });
    }

    try {
        const decoded = JWT.verify(token, secret, { algorithms: ["HS256"] });

        if (typeof decoded === "string" || !decoded.sub) {
            return res.status(401).send({ error: "Token invalid" });
        }

        res.locals.userId = String(decoded.sub);
        next();
    } catch {
        return res.status(401).send({ error: "Session is either invalid or expired" });
    }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = await db.users.findByPk(res.locals.userId);
    if (!user || user.UserStatus !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin privileges required" });
    }
    next();
};

export { authenticateToken, isAdmin };
