import * as express from "express"
import { db } from "../db.ts"

const AdminController = {
    async getAllRecipes(req: express.Request, res: express.Response) {
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
            const recipe: any = await db.recipes.findByPk(recipeID)

            if(!recipe) {
                return res.status(404).send({error: `Recipe with this ID was not found: ${recipeID}`})
            }

            recipe.Status = true
            await recipe.save()

            return res.status(200).send({success: `Recipe with ID: ${recipeID} status has changed to TRUE`})
        }
        catch (error) {
            console.log(error)

            return res.status(500).send({error: `Failed to update recipe status`})
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
    }
}

export default AdminController