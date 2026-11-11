import type express from "express";
import RecipeController from "../src/controllers/RecipeController.ts";
import UserController from "../src/controllers/UserController.ts";
import AdminController from "../src/controllers/AdminController.ts"
import UserRecipesCollectionController from "../src/controllers/UserRecipesCollectionsController.ts"

export default (app: express.Application): void => {
 
  //Recipes routes
  app.route("/recipes")
    .get(RecipeController.getAll)
    .post(RecipeController.create);

  app.route("/recipes/:ID")
    .get(RecipeController.getByID)
    .put(RecipeController.modifyById)
    .delete(RecipeController.deleteById);

  //Users routes
  app.route("/users/register")
    .post(UserController.create);

  app.route("/users/login")
    .post(UserController.login);

  //Admin routes
  app.route("/admin/recipestoapprove")
    .get(AdminController.getAllRecipes);
  
  app.route("/admin/recipestoapprove/:ID")
    .put(AdminController.approveRecipe)

  //UserRecipesCollection routes
  app.route("/userrecipescollections/")
    .post(UserRecipesCollectionController.create)
    .get(UserRecipesCollectionController.getAll)
  
  app.route("/userrecipescollections/:ID")
    .get(UserRecipesCollectionController.getById)
};