import { Express } from "express";
import RecipeController from "../controllers/RecipeController";
import UserController from "../controllers/UserController";
import AdminController from "../controllers/AdminController"

export default (app: Express): void => {
 
  app.route("/recipes")
    .get(RecipeController.getAll)
    .post(RecipeController.create);

  app.route("/recipes/:ID")
    .get(RecipeController.getByID)
    .put(RecipeController.modifyById)
    .delete(RecipeController.deleteById);
  
  app.route("/users/register")
    .post(UserController.create);

  app.route("/users/login")
    .post(UserController.login);

  app.route("/admin/recipes")
    .get(AdminController.getAllRecipes);
};