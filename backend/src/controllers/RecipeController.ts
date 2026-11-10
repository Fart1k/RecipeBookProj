import * as express from "express"
import { db } from "../db.ts";
import Utilities from "./Utilities.ts";
import { v7 as uuidv7 } from "uuid";
import { error } from "node:console"

const RecipeController = {
    async create(req: express.Request, res: express.Response) {
        if (
            !req.body.RecipeTitle ||
            !req.body.Instructions ||
            !req.body.Ingredients ||
            req.body.IsVisibleToOther
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            });
        }

        const newRecipe = {
            id: uuidv7(),
            RecipeTitle: req.body.RecipeTitle,
            Instructions: req.body.Instructions,
            Ingredients: req.body.Ingredients,
            IsVisibleToOther: req.body.IsVisibleToOther,
            Status: false
        };

        const createdRecipe = await db.recipes.create(newRecipe);

        return res.status(201).json(createdRecipe);
    },

    async getAll(req: express.Request, res: express.Response) {
        const recipes = await db.recipes.findAll({
            where: {
                Status: true
            }
        });
        console.log("getAll", recipes);
        return res
        .status(200)
        .send(recipes.map(({ id, RecipeTitle }: any) => ({ id, RecipeTitle })))
    },
    async getByID(req: express.Request, res: express.Response) {
        const recipeID: string = req.params.ID as string;
        console.log(recipeID);
        const recipe = await db.recipes.findByPk(recipeID);
        if (!recipe) {
            res.status(404).send({
                error: `Recipe with this ID is not found: ${recipeID}`
            });
            return null;
        }
        return res.status(200).send(recipe);
    },
    async modifyById(req: express.Request, res: express.Response){
        if (!req.params.id){
            return res.status(400).send({"error":"No ID supplied"})
        }
        
        const recipeToBeModified = await this.getRecipe(req,res)

        if (!recipeToBeModified) {
            return
        }

        const modifiedRecipe = {
            RecipeTitle: req.body.RecipeTitle,
            Instructions: req.body.Instructions,
            Ingredients: req.body.Ingredients,
            IsVisibleToOther: req.body.IsVisibleToOther,
            ImageUrl: req.body.ImageUrl || null
        }

        await db.recipes.update(modifiedRecipe, { where: {id: req.params.id} })

        return res.location(`${Utilities.getBaseURL(req)}/recipes/${recipeToBeModified.id}`)
        .status(200)
        .send(modifiedRecipe)
    },
  
    async deleteById(req: express.Request, res: express.Response) {
        const recipeToBeDeleted: any = await this.getByID(req, res);
        if (!recipeToBeDeleted) {
            return;
        }

        await recipeToBeDeleted.destroy();
        return res.status(204).send({ error: "No content." });
    },

    async getRecipe(req: express.Request, res: express.Response) {
        let recipeID: string = req.params.id as string

        const recipe = await db.recipes.findByPk(recipeID)
        if(!recipe) {
            res.status(404).send({error: `Recipe with this ID is not found. ${recipeID}`})
            return null
        }
        return recipe
    }
    
}

export default RecipeController;