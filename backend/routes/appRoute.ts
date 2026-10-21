import { Express } from "express";
import RecipeController from "../controllers/RecipeController";
import UserController from "../controllers/UserController";
import AdminController from "../controllers/AdminController"
import UserRecipesCollectionController from "../controllers/UserRecipesCollectionsController"

export default (app: Express): void => {
 
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
};