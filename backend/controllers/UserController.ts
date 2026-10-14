import { Request, Response } from "express";
import { db } from "../db.ts";
import Utilities from "./Utilities.ts";
import { v7 as uuidv7 } from "uuid";

const UsersController = {
    async create(req: Request, res: Response) {
        if (
            !req.body.UserName ||
            !req.body.EmailAddress ||
            !req.body.Password ||
            !req.body.PasswordConfirmation
        ) {
            return res.status(400).send({
                error: "Missing parameters, please check your info."
            });
        }
        if(req.body.Password != req.body.PasswordConfirmation)
        {
            return res.status(406)
            .send({error:"Passwords do not match, check your info"})
        }

        const newUser = {
            id: uuidv7(),
            UserName: req.body.UserName,
            EmailAddress: req.body.EmailAddress,
            SignUpDate: Date.now(),
            UserStatus: "unverified",
            PasswordHash: ""
        }

        newUser.PasswordHash = await Utilities.gimmePassword(req.body.Password)

        const result = await db.users.create(newUser)

        return res.location(`${Utilities.getBaseURL(req)}/users/${result.get("id")}`)
            .sendStatus(201)
    }
};

export default UsersController;