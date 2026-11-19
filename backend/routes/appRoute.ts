import type express from "express";
import RecipeController from "../src/controllers/RecipeController.ts";
import UserController from "../src/controllers/UserController.ts";
import AdminController from "../src/controllers/AdminController.ts"
import UserRecipesCollectionController from "../src/controllers/UserRecipesCollectionsController.ts"
import CommentController from "../src/controllers/CommentController.ts";
import { authenticateToken, isAdmin } from "../src/middleware/auth.ts";

export default (app: express.Application): void => {
 //Recipes routes

  app.route("/recipes")
    .get(RecipeController.getAll)
    .post(RecipeController.create);

  app.route("/recipes/:ID")
    .get(RecipeController.getByID)
    .put(RecipeController.modifyById)
    .delete(RecipeController.deleteById);

//Users Routes

  app.route("/users/register")
    .post(UserController.create);

  app.route("/users/login")
    .post(UserController.login);

  //UserRecipesCollection routes

  app.route("/userrecipescollections/")
    .post(UserRecipesCollectionController.create)
    .get(UserRecipesCollectionController.getAll)
  
  app.route("/userrecipescollections/:ID")
    .get(UserRecipesCollectionController.getById)
    .put(UserRecipesCollectionController.modifyById)
    .delete(UserRecipesCollectionController.deleteById)


  app.route("/recipes/:ID/comments")
    .get(CommentController.getByRecipe)
    .post(authenticateToken, CommentController.create);
 
    //Admin routes

  app.route("/admin/recipestoapprove")
    .get(authenticateToken, isAdmin, AdminController.getAllRecipes);
  
  app.route("/admin/recipestoapprove/:ID")
    .put(authenticateToken, isAdmin, AdminController.approveRecipe);

  app.route("/users/profile")
   .get(authenticateToken, UserController.getProfile)
   .put(authenticateToken, UserController.updateProfile);

  app.route("/users/password")
   .put(authenticateToken, UserController.changePassword);
};