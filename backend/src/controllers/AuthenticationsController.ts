import * as express from "express";
import { db } from "../db.ts";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const AuthenticationsController = {
    async newToken(req: express.Request, res: express.Response) {
        const requiredFields = ["EmailAddress", "Password"];
        const missingFields = requiredFields.filter(field => !req.body?.[field]);

        if (missingFields.length > 0) {
            return res.status(400).send({ error: "Some or all parameters are missing" });
        }

        const { EmailAddress, Password } = req.body;

        if (typeof EmailAddress !== "string" || typeof Password !== "string") {
            return res.status(400).send({ error: "Some or all parameters are invalid" });
        }

        try {
            const user = await db.users.findOne({ where: { EmailAddress } });

            if (!user || !(await bcrypt.compare(Password, user.PasswordHash))) {
                return res.status(401).send({ error: "Some or all parameters are invalid" });
            }

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                return res.status(500).send({ error: "JWT secret is not configured" });
            }

            const token = JWT.sign({}, secret, {
                subject: user.id,
                expiresIn: "1h",
                algorithm: "HS256"
            });

            res.cookie("accessToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 1000,
                path: "/"
            });

            return res.status(200).send({
                message: "Login Successful.",
                user: {
                    id: user.id,
                    UserName: user.UserName,
                    EmailAddress: user.EmailAddress,
                    UserStatus: user.UserStatus
                }
            });
        } catch {
            return res.status(500).send({ error: "Internal server error" });
        }
    },

    async refreshToken(req: express.Request, res: express.Response) {
        const user = await db.users.findByPk(res.locals.userId);
        if (!user) {
            return res.status(401).send({ error: "User who this session belonged to no longer exists" });
        }

        return res.status(200).send({
            id: user.id,
            UserName: user.UserName,
            EmailAddress: user.EmailAddress,
            UserStatus: user.UserStatus
        });
    },

    async invalidateToken(req: express.Request, res: express.Response) {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).send({ message: "You have been logged out." });
    }
};

export default AuthenticationsController;
