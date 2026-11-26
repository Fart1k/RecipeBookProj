import * as express from "express";
import { db } from "../db.ts";
import { v7 as uuidv7 } from "uuid";

const CommentController = {
    async create(req: express.Request, res: express.Response) {
        const userId = (req as any).user?.id;
        const recipeId = req.params.ID as string;
        const { rating, commentText } = req.body;
        
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: Missing user token" });
        }
        if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating is required and must be between 1 and 5" });
        }

        const recipe = await db.recipes.findByPk(recipeId);
        if (!recipe || !recipe.Status || !recipe.IsVisibleToOther) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        const newComment = await db.sequelize.transaction(async transaction => {
            const [commentList] = await db.commentList.findOrCreate({
                where: { UserId: userId },
                defaults: {
                    id: uuidv7(),
                    UserId: userId
                },
                transaction
            })

            await db.users.update({CommentsListId: commentList.id}, {where: {id: userId}, transaction})

            const comment = await db.comment.create({
                id: uuidv7(),
                Author: userId,
                RecipeId: recipeId,
                CommentListId: commentList.id,
                Rating: rating,
                CommentBody: commentText || ""
            }, {transaction})

            const comments = await db.comment.findAll({ where: {RecipeId: recipeId}, transaction })

            const ratings = comments
                                .map(comment => comment.Rating)
                                .filter(rating => rating !== null)

            const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length

            await recipe.update({ RatingOverall: Number(averageRating.toFixed(1)) }, {transaction})
        })

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