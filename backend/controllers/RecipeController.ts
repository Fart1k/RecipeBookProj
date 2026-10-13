import { Request, Response } from "express";
import { db } from "../db.ts";
import Utilities from "../Utilities.ts";
import { v7 as uuidv7 } from "uuid";
import { READCOMMITTED } from "sequelize/lib/table-hints";

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
            Recipename: req.body.RecipeTitle,
            RecipeInstruction: req.body.Instructions,
            RecipeIngredients: req.body.Ingredients,
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
        .send(
            recipes.map
            (
                ({ id, Recipename }) => ({ id, Recipename })
            )
        );
    },
    async getByID(req: Request, res: Response){
        const recipeID: string = req.params.Id
        console.log(recipeId)
        const recipe = await db.recipe.findByPk(recipeID)
        if(!recipe){
            res.status(404).send({
                error: `Game with this ID is not found ${recipeID}`
            })
            return null;
        }
        return recipe;

    }

};

export default RecipeController;