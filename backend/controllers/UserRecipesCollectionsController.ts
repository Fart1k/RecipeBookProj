import { Request, Response } from "express"
import { db } from "../db.ts"
import Utilities from "./Utilities.ts"
import { UUID, UUIDV4 } from "sequelize"

const UserRecipesCollectionsController = {
    async create(req: Request, res: Response) {
        //On vaja kontrollida, kas kasutaja on sisse logitud. 
        //Kui mitte, siis tagasta 403 staatuse.
        const userWhoUploaded = "userId"
        const recipeIdToBeAddedToCollection = ["recipeId"]
        if (
            !req.body.CollectionName ||
            !req.body.RecipeId
        ) {
            return res.status(400).send({ error: "Missing parameters. Please review data"})
        }

        const newUserRecipeCollection = {
            id: UUIDV4,
            CollectionName: req.body.CollectionName,
            CollectionDescription: req.body.CollectionDescription,
            UserId: userWhoUploaded,
            RecipeId: recipeIdToBeAddedToCollection
        }

        const addedUserRecipeCollection = await db.userRecipesCollection.create(newUserRecipeCollection)

        return res.location(`${Utilities.getBaseURL(req)}/usercollections/${addedUserRecipeCollection.id}`).status(201)
    }
}