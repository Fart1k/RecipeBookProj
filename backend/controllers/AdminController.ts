import { Request, Response } from "express"
import { db } from "../db.ts"

const AdminController = {
    async getAllRecipes(req: Request, res: Response) {
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

    async approveRecipe(req: Request, res: Response) {
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
    }
}

export default AdminController