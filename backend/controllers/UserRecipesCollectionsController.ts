import * as express from "express"
import { db } from "../db.ts"
import Utilities from "./Utilities.ts"
import { v7 as uuidv7 } from "uuid"


const UserRecipesCollectionsController = {
    async create(req: express.Request, res: express.Response) {
        const userWhoUploaded = "11cb8fd0-d70c-11f1-8dc2-901b0eec5991"
        if (!req.body.CollectionName || !req.body.RecipeId) {
            return res.status(400).send({ error: "Missing parameters. Please review data"})
        }

        const starterJson = `{"RecipeIDs":"${req.body.RecipeId}"}`
        const recipeIdToBeAddedToCollection = JSON.parse(starterJson)

        const newUserRecipeCollection = {
            id: uuidv7(),
            CollectionName: req.body.CollectionName,
            CollectionDescription: req.body.CollectionDescription,
            UserId: userWhoUploaded,
            RecipeIds: recipeIdToBeAddedToCollection
        }

        const addedUserRecipeCollection = await db.userRecipesCollection.create(newUserRecipeCollection)

        return res.location(`${Utilities.getBaseURL(req)}/userrecipescollections/${addedUserRecipeCollection.id}`).status(201)
    }
}
export default UserRecipesCollectionsController