import { Request, Response } from "express"
import { db } from "../db.ts"

const AdminController = {
    async getAllRecipes(req: Request, res: Response) {
        try {
            const recipes = await db.recipes.findAll()

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
    }
}

export default AdminController