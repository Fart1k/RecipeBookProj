import type express from "express";
import RecipeController from "../controllers/RecipeController.ts";
import UserController from "../controllers/UserController.ts";
import AuthenticationsController from "../controllers/AuthenticationsController.ts";
import AdminController from "../controllers/AdminController.ts";
import UserRecipesCollectionController from "../controllers/UserRecipesCollectionsController.ts";
import CommentController from "../controllers/CommentController.ts";
import { authenticateToken, isAdmin } from "../middleware/auth.ts";

export default (app: express.Application): void => {
    app.route("/recipes")
        .get(RecipeController.getAll)
        .post(authenticateToken, RecipeController.create);

    app.route("/recipes/:ID")
        .get(RecipeController.getByID)
        .put(authenticateToken, RecipeController.modifyById)
        .delete(authenticateToken, RecipeController.deleteById);

    app.route("/users/register")
        .post(UserController.create);

    app.route("/authentication")
        .post(AuthenticationsController.newToken)
        .delete(AuthenticationsController.invalidateToken);

    app.get("/authentication/current", authenticateToken, AuthenticationsController.refreshToken);

    app.route("/authentication/:id")
        .put(authenticateToken, AuthenticationsController.refreshToken);

    app.route("/userrecipescollections/")
        .post(authenticateToken, UserRecipesCollectionController.create)
        .get(UserRecipesCollectionController.getAll);

    app.route("/userrecipescollections/:ID")
        .get(UserRecipesCollectionController.getById)
        .put(authenticateToken, UserRecipesCollectionController.modifyById)
        .delete(authenticateToken, UserRecipesCollectionController.deleteById);

    app.route("/recipes/:ID/comments")
        .get(CommentController.getByRecipe)
        .post(authenticateToken, CommentController.create);

    app.route("/admin/recipestoapprove")
        .get(authenticateToken, isAdmin, AdminController.getAllRecipes);

    app.route("/admin/recipestoapprove/:ID")
        .put(authenticateToken, isAdmin, AdminController.approveRecipe);
};
