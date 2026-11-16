import * as express from "express";
import { db } from "../db.ts";
import { v7 as uuidv7 } from "uuid";

const CommentController = {
    async create(req: express.Request, res: express.Response) {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: Missing user token" });
        }
        const recipeId = req.params.ID as string;
        const { rating, commentText } = req.body;
        if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating is required and must be between 1 and 5" });
        }
        const recipe = await db.recipes.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        const newComment = await db.comment.create({
            id: uuidv7(),
            RecipeId: recipeId ,
            UserId: userId,
            Rating: rating,
            CommentText: commentText || ""
        } as any);
        return res.status(201).json(newComment);
    },
    async getByRecipe(req: express.Request, res: express.Response) {
        const recipeId = req.params.ID;
        const comments = await db.comment.findAll({
            where: { RecipeId: recipeId },
            include: [
                {
                    model: db.users,
                    as: "User",
                    attributes: ["id", "username"] 
                }
            ]
        });
        return res.status(200).json(comments);
    }
};
export default CommentController;