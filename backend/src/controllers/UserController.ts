import * as express from "express";
import { db } from "../db.ts";
import bcrypt from "bcrypt";
import { v7 as uuidv7 } from "uuid";

const UserController = {
    async create(req: express.Request, res: express.Response) {
        const requiredFields = ["UserName", "EmailAddress", "Password", "PasswordConfirmation"];
        const missingFields = requiredFields.filter(field => !req.body?.[field]);

        if (missingFields.length > 0) {
            return res.status(400).send({
                error: "Missing parameters, please review data",
                missing: missingFields
            });
        }

        if (typeof req.body.UserName !== "string" ||
            typeof req.body.EmailAddress !== "string" ||
            typeof req.body.Password !== "string" ||
            typeof req.body.PasswordConfirmation !== "string") {
            return res.status(400).send({ error: "Some or all parameters are invalid" });
        }

        if (req.body.Password !== req.body.PasswordConfirmation) {
            return res.status(406).send({ error: "Passwords do not match, please check your info." });
        }

        try {
            const existingUser = await db.users.findOne({
                where: { EmailAddress: req.body.EmailAddress }
            });

            if (existingUser) {
                return res.status(409).send({ error: "Email is already in use" });
            }

            const passwordHash = await bcrypt.hash(req.body.Password, 10);
            const result = await db.users.create({
                id: uuidv7(),
                UserName: req.body.UserName,
                EmailAddress: req.body.EmailAddress,
                PasswordHash: passwordHash,
                UserStatus: "unverified"
            });

            return res.status(201).send({
                id: result.id,
                UserName: result.UserName,
                EmailAddress: result.EmailAddress,
                UserStatus: result.UserStatus
            });
        } catch {
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

export default UserController;
