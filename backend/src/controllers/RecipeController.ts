import * as express from "express"
import { db } from "../db.ts";
import Utilities from "./Utilities.ts";
import { v7 as uuidv7 } from "uuid";
import { error } from "node:console"
import { Op } from "sequelize";

const RecipeController = {
    async create(req: express.Request, res: express.Response) {
        const userId = (req as any).user.id
        if (
            !req.body.RecipeTitle ||
            !req.body.Instructions ||
            !req.body.Ingredients ||
            typeof req.body.IsVisibleToOther !== "boolean"
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            });
        }

        const newRecipe = {
            id: uuidv7(),
            UserId: userId, 
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
        const { search, category } = req.query;
        const whereClause: any = {
            Status: true,
            IsVisibleToOther: true
        };
        if (search) {
            whereClause.RecipeTitle = {
                [Op.iLike]: `%${search}%`
            };
        }
        if (category) {   
            whereClause.Category = category;
        }
        const recipes = await db.recipes.findAll({
            where: whereClause
        });
        console.log("getAll with filters", recipes);
        return res
            .status(200)
            .json(recipes.map(({ id, RecipeTitle }: any) => ({ id, RecipeTitle })));
    },
    async getByID(req: express.Request, res: express.Response) {
        const recipeID: string = req.params.ID as string;
        const recipe = await db.recipes.findByPk(recipeID);
        if (!recipe || !recipe.Status || !recipe.IsVisibleToOther) {
            res.status(404).send({
                error: `Recipe with this ID is not found: ${recipeID}`
            });
            return null;
        }
        return res.status(200).send(recipe);
    },
    async modifyById(req: express.Request, res: express.Response){
        if (!req.params.ID){
            return res.status(400).send({"error":"No ID supplied"})
        }
        
        const recipeToBeModified = await RecipeController.getRecipe(req, res)

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

        await db.recipes.update(modifiedRecipe, { where: {id: req.params.ID} })

        return res.location(`${Utilities.getBaseURL(req)}/recipes/${recipeToBeModified.id}`)
        .status(200)
        .send(modifiedRecipe)
    },
  
    async deleteById(req: express.Request, res: express.Response) {
        const recipeToBeDeleted: any = await RecipeController.getRecipe(req, res);
        if (!recipeToBeDeleted) {
            return;
        }

        await recipeToBeDeleted.destroy();
        return res.status(204).send({ error: "No content." });
    },

    async getRecipe(req: express.Request, res: express.Response) {
        let recipeID: string = req.params.ID as string

        const recipe = await db.recipes.findByPk(recipeID)
        if(!recipe) {
            res.status(404).send({error: `Recipe with this ID is not found. ${recipeID}`})
            return null
        }

        if (recipe.UserId !== (req as any).user.id) {
            res.status(403).send({ error: "Access denied" })
            return null
        }
        return recipe
    }
    
}

export default RecipeController;