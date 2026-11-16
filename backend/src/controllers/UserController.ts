import * as express from "express";
import { db } from "../db.ts";
import { v7 as uuidv7 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserController = {
    async create(req: express.Request, res: express.Response) {
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
            const existingUser = await db.users.findOne({ where: { Email: req.body.Email } as any });
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
            } as any);

            await db.credential.create({
                id: credentialId,
                Userid: userId,
                UserType: req.body.UserType 
            } as any);

            return res.status(201).json({
                message: "User registered successfully",
                userId: newUser.id,
                username: newUser.UserName
            });
        } catch (error) {
            console.error("Registration error:", error);
            return res.status(500).send({ error: "Internal server error" });
        }
    },

    async login(req: express.Request, res: express.Response) {
        if (!req.body.Email || !req.body.Password) {
            return res.status(400).send({
                error: "Email and password are required"
            });
        }

        try {
            const user = await db.users.findOne({ where: { Email: req.body.Email } as any});
            if (!user) {
                return res.status(401).send({ error: "Invalid email or password" });
            }

            const isPasswordValid = await bcrypt.compare(req.body.Password, user.PasswordHash);
            if (!isPasswordValid) {
                return res.status(401).send({ error: "Invalid email or password" });
            }

            const credential = await db.credential.findOne({ where: { Userid: user.id } as any });
            const userType = credential ? credential.UserType : "User";

            const token = jwt.sign(
                { id: user.id , email: (user as any).Email, role: userType } ,
                process.env.JWT_SECRET || "your_jwt_secret_key",
                { expiresIn: "24h" }
            );

            return res.status(200).send({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    username: user.UserName,
                    email: (user as any).Email,
                    role: userType
                }
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).send({ error: "Internal server error" });
        }
    }, 
    async getProfile(req: express.Request, res: express.Response) {
        try {
            const userId = (req as any).user.id;
            const user = await db.users.findByPk(userId, {
                attributes: { exclude: ['PasswordHash'] }
            });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch profile" });
        }
    },
    async updateProfile(req: express.Request, res: express.Response) {
        try {
            const userId = (req as any).user.id;
            const { username, email } = req.body;

            const user: any = await db.users.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            await user.update({ Username: username, Email: email });
            return res.status(200).json({ message: "Profile updated successfully", user });
        } catch (error) {
            return res.status(500).json({ error: "Failed to update profile" });
        }
    },
    async changePassword(req: express.Request, res: express.Response) {
        try {
            const userId = (req as any).user.id;
            const { currentPassword, newPassword } = req.body;

            const user: any = await db.users.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.PasswordHash);
            if (!isMatch) {
                return res.status(400).json({ error: "Incorrect current password" });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await user.update({ PasswordHash: hashedPassword });
            return res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            console.error("Change password error:", error);
            return res.status(500).json({ error: "Failed to change password" });
        }
    }
};

export default UserController;