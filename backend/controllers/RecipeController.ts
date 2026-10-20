import { Request, Response } from "express";
import { db } from "../db.ts";
import Utilities from "./Utilities.ts";
import { v7 as uuidv7 } from "uuid";
import { error } from "node:console"

const RecipeController = {
    async create(req: Request, res: Response) {
        if (
            !req.body.RecipeTitle ||
            !req.body.Instructions ||
            !req.body.Ingredients ||
            !req.body.ImageUrl ||
            !req.body.RatingOverall
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            });
        }

        const newRecipe = {
            id: uuidv7(),
            RecipeTitle: req.body.RecipeTitle,
            Instruction: req.body.Instructions,
            Ingredients: req.body.Ingredients,
            ImageURL: req.body.ImageUrl,
            RatingOverall: req.body.RatingOverall
        };

        const createdRecipe = await db.recipe.create(newRecipe);

        return res.status(201).json(createdRecipe);
    },

    async getAll(req: Request, res: Response) {
        const recipes = await db.recipe.findAll();
        console.log("getAll", recipes);
        return res
        .status(200)
        .send(recipes.map(({ id, RecipeTitle }: any) => ({ id, RecipeTitle })))
    },
    async getByID(req: Request, res: Response) {
        const recipeID: string = req.params.ID as string;
        console.log(recipeID);
        const recipe = await db.recipe.findByPk(recipeID);
        if (!recipe) {
            res.status(404).send({
                error: `Recipe with this ID is not found: ${recipeID}`
            });
            return null;
        }
        return res.status(200).send(recipe);
    },
    async modifyById(req: Request, res:Response){
        const recipeToBeModified = await this.getByID(req,res)
        if (!recipeToBeModified){
            return
        }
        if (
            !req.body.RecipeTitle ||
            !req.body.Instructions ||
            !req.body.Ingredients ||
            !req.body.ImageUrl ||
            !req.body.RatingOverall
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            });
        }
        recipeToBeModified.RecipeTitle = req.body.RecipeTitle;
        recipeToBeModified.Instruction = req.body.Instructions;
        recipeToBeModified.Ingredients = req.body.Ingredients;
        recipeToBeModified.ImageURL = req.body.ImageUrl;
        recipeToBeModified.RatingOverall = req.body.RatingOverall;

        await recipeToBeModified.save();

        return res.location(`${Utilities.getBaseURL(req)}/games/${recipeToBeModified.id}`)
        .status(201)
        .send(recipeToBeModified)
    },
  
    async deleteById(req: Request, res: Response) {
        const recipeToBeDeleted: any = await this.getByID(req, res);
        if (!recipeToBeDeleted) {
            return;
        }

        await recipeToBeDeleted.destroy();
        return res.status(204).send({ error: "No content." });
    }
    
}

export default RecipeController;