import * as express from "express"
import { db } from "../db.ts"

const AdminController = {
    async getAllRecipesToApprove(req: express.Request, res: express.Response) {
        try {
            const recipes = await db.recipes.findAll({
                where: {
                    Status: false
                }
            })

            return res.status(200).send(
                recipes.map((recipe: any) => ({
                    id: recipe.id,
                    title: recipe.RecipeTitle,
                    status: recipe.Status
                }))
            )
        }
        catch (error) {
            console.log(`Error: ${error}`)

            return res.status(500).send({error: "Failed to get recipes"})
        }
    },

    async approveRecipe(req: express.Request, res: express.Response) {
        try {
            const recipeID: string = req.params.ID as string
            const recipe = await db.recipes.findByPk(recipeID)

            if(!recipe) {
                return res.status(404).send({error: `Recipe with this ID was not found: ${recipeID}`})
            }

            recipe.Status = true
            await recipe.save()
            return res.status(200).send({message: `Recipe with ID: ${recipeID} status has changed to TRUE`})
        }
        catch (error) {
            return res.status(500).send({error: `Failed to update recipe status`})
        }
    },

    async rejectRecipe(req: express.Request, res:express.Response) {
        try {
            const recipeId = req.params.ID as string
            const recipe = await db.recipes.findByPk(recipeId)

            if (!recipe) {
                return res.status(404).json({error: `Recipe with this id was not found: ${recipeId}`})
            }

            recipe.Status = false
            await recipe.save()
            return res.status(200).json({message: "Recipe rejected successfully"})
        }
        catch (error) {
            return res.status(500).json({error: "Internal server error"})
        }
    },

    async getAllUsers(req: express.Request, res: express.Response) {
        try {
            const users = await db.users.findAll({
                attributes: {
                    exclude: ["PasswordHash"]
                }
            })

            return res.status(200).json(users)
        }   
        catch (error) {
            return res.status(500).json({error: "Internal server error"})
        }
    },

    async getById(req: express.Request, res: express.Response) {
        try {
            const userId = req.params.ID as string

            const user = await db.users.findByPk(userId, {
                attributes: {
                    exclude: ["PasswordHash"]
                }
            })

            if (!user) {
                return res.status(404).json({error: `User with this ID was not found: ${userId}`})
            }

            return res.status(200).json(user)
        }
        catch(error) {
            res.status(500).json({error: "Internal server error"})
        }
    },

    async banUser(req: express.Request, res: express.Response) {
        try {
            const userId = req.params.ID as string

            if (userId === (req as any).user.id) {
                return res.status(400).json({error: "You cannot ban yourself"})
            }

            const user = await db.users.findByPk(userId)

            if(!user) {
                return res.status(404).json({error: `User with this ID was not found: ${userId}`})
            }

            user.UserStatus = "banned"
            await user.save()

            return res.status(200).json({message: "User banned successfully"})
        }
        catch (error) {
            return res.status(500).json({error: "Internal server error"})
        }
    },

    async getAllRecipes(req: express.Request, res: express.Response) {
        try {
            const recipes = await db.recipes.findAll()
            return res.status(200).json(recipes)
        }
        catch (error) {
            return res.status(500).json({error: "Internal server error"})
        }
    }
}

export default AdminController