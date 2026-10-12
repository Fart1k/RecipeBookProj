import {Request ,response} from "express";
import {db} from "../db.ts"
import Utitlites from "../Utilites.ts";
import { v7 as uuidv7} from "uuid";

export const create = async (req: Request, res: Response) =>{
    if(
        !req.body.RecipeTitle ||
        !req.body.Instructions ||
        !req.body.Ingredients ||
        !req.body.ImageUrl ||
        !req.body.RatingOverall 


    ){
return res.status(400).send(
    {
        error: "Missing parameters, please review data"
    }
)
    }
    const newRecipe = {
        id: uuidv7(),
        Recipename:req.body.RecipeTitle,
        RecipeInstruction:req.body.Instructions,
        RecipeIngredients:req.body.Ingredients,
        ImageURL: req.body.ImageURL,
        RatingOverall:req.body.RatingOverall 
    }
    const createdGame = await db.recipe.create(newRecipe)

    return res
}