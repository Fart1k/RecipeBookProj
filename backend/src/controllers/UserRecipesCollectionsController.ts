import * as express from "express"
import { db } from "../db.ts"
import Utilities from "./Utilities.ts"
import { v7 as uuidv7 } from "uuid"


const UserRecipesCollectionsController = {
    async create(req: express.Request, res: express.Response) {
        const userWhoUploaded = "11cb8fd0-d70c-11f1-8dc2-901b0eec5991"
        if (!req.body.CollectionName || !req.body.RecipeIds) {
            return res.status(400).send({ error: "Missing parameters. Please review data"})
        }

        const newUserRecipeCollection = {
            id: uuidv7(),
            CollectionName: req.body.CollectionName,
            CollectionDescription: req.body.CollectionDescription,
            UserId: userWhoUploaded,
            RecipeIds: req.body.RecipeIds,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const addedUserRecipeCollection = await db.userRecipesCollection.create(newUserRecipeCollection)

        const collectionWithUser = await db.userRecipesCollection.findByPk(
            addedUserRecipeCollection.id, 
            {
                include: [
                    {
                        model: db.users,
                        as: "User"
                    }
                ]
            }
        )

        return res.location(`${Utilities.getBaseURL(req)}/userrecipescollections/${addedUserRecipeCollection.id}`).status(201).json(collectionWithUser)
    },

    async getAll(req: express.Request, res: express.Response) {
        const collections = await db.userRecipesCollection.findAll()

        return res.status(200).send(collections.map(({ id, CollectionName }: any) => ({ id, CollectionName})))
    },

    async getById(req: express.Request, res: express.Response) {
        const collectionId: string = req.params.ID as string

        const collection = await db.userRecipesCollection.findByPk(collectionId)
        if (!collection) {
            res.status(404).send({error: `Recipe Collection with this ID is not found: ${collectionId}`})
            return null
        }

        return res.status(200).send(collection)
    }
}
export default UserRecipesCollectionsController