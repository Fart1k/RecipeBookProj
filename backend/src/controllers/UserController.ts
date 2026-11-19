import * as express from "express";
import { db } from "../db.ts";
import { v7 as uuidv7 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserController = {
    async create(req: express.Request, res: express.Response) {
        if (
            !req.body.UserName ||
            !req.body.EmailAddress ||
            !req.body.Password
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            });
        }

        try {
            const existingUser = await db.users.findOne({ where: { EmailAddress: (req.body.EmailAddress).trim().toLowerCase() } });
            if (existingUser) {
                return res.status(400).send({ error: "Email is already in use" });
            }

            const credential = await db.credential.findOne({ where: {UserType: "user"} })
            if (!credential) {
                return res.status(404).send({ error: "Default user role not found"})
            }

            const hashedPassword = await bcrypt.hash(req.body.Password, 10);

            const newUser = await db.users.create({
                id: uuidv7(),
                UserName: req.body.UserName,
                EmailAddress: req.body.EmailAddress,
                PasswordHash: hashedPassword,
                UserStatus: "verified",
                CredentialId: credential.id
            })

            return res.status(201).json({
                message: "User registered successfully",
                userId: newUser.id,
                username: newUser.UserName
            });
        }
        catch (error) {
            console.error("Registration error:", error);
            return res.status(500).send({ error: "Internal server error" });
        }
    },

    async login(req: express.Request, res: express.Response) {
        if (!req.body.EmailAddress || !req.body.Password) {
            return res.status(400).send({
                error: "Email and password are required"
            });
        }

        try {
            const user = await db.users.findOne({ where: { EmailAddress: (req.body.EmailAddress).trim().toLowerCase() } });
            if (!user) {
                return res.status(401).send({ error: "User not found" });
            }

            const isPasswordValid = await bcrypt.compare(req.body.Password, user.PasswordHash);
            if (!isPasswordValid) {
                return res.status(401).send({ error: "Invalid password" });
            }

            if(user.UserStatus !== "verified") {
                return res.status(403).send({ error: "Account is not active"})
            }

            const credential = await db.credential.findByPk(user.CredentialId);
            if(!credential) {
                return res.status(500).send({ error: "User role was not found" })
            }

            const jwtSecret = process.env.JWT_SECRET
            if (!jwtSecret) {
                return res.status(500).send({ error: "JWT secret is not configured" })
            }

            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.EmailAddress, 
                    role: credential.UserType 
                },
                jwtSecret,
                { expiresIn: "24h" }
            );

            return res.status(200).send({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    username: user.UserName,
                    email: user.EmailAddress,
                    role: credential.UserType
                }
            });
        } 
        catch (error) {
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

export default UserController;