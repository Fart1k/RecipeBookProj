import { Request, Response } from "express";
import { db } from "../db.ts";
import { v7 as uuidv7 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserController = {
    async create(req: Request, res: Response) {
        if (
            !req.body.Username ||
            !req.body.Email ||
            !req.body.Password ||
            !req.body.UserType
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            });
        }

        try {
        
            const existingUser = await db.users.findOne({ where: { Email: req.body.Email } });
            if (existingUser) {
                return res.status(400).send({ error: "Email is already in use" });
            }

            const hashedPassword = await bcrypt.hash(req.body.Password, 10);
            const userId = uuidv7();
            const credentialId = uuidv7();

            
            const newUser = await db.users.create({
                id: userId,
                Username: req.body.Username,
                Email: req.body.Email,
                PasswordHash: hashedPassword,
                CredentialId: credentialId
            });

           
            await db.credential.create({
                id: credentialId,
                Userid: userId,
                UserType: req.body.UserType 
            });

            return res.status(201).json({
                message: "User registered successfully",
                userId: newUser.id,
                username: newUser.Username
            });
        } catch (error) {
            console.error("Registration error:", error);
            return res.status(500).send({ error: "Internal server error" });
        }
    },

    async login(req: Request, res: Response) {
        if (!req.body.Email || !req.body.Password) {
            return res.status(400).send({
                error: "Email and password are required"
            });
        }

        try {
            const user = await db.users.findOne({ where: { Email: req.body.Email } });
            if (!user) {
                return res.status(401).send({ error: "Invalid email or password" });
            }

            const isPasswordValid = await bcrypt.compare(req.body.Password, user.PasswordHash);
            if (!isPasswordValid) {
                return res.status(401).send({ error: "Invalid email or password" });
            }

            const credential = await db.credential.findOne({ where: { Userid: user.id } });
            const userType = credential ? credential.UserType : "User";

        
            const token = jwt.sign(
                { id: user.id, email: user.Email, role: userType },
                process.env.JWT_SECRET || "your_jwt_secret_key",
                { expiresIn: "24h" }
            );

            return res.status(200).send({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    username: user.Username,
                    email: user.Email,
                    role: userType
                }
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

export default UserController;