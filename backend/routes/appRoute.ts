import { Express } from "express";
import RecipeController from "../controllers/RecipeController";
import UserController from "../controllers/UserController";

export default (app: Express): void => {
  app.route("/recipes")
    .get(RecipeController.getAll)
    .post(RecipeController.create);

  app.route("/recipes/:id")
    .get(RecipeController.getById)
    .put(RecipeController.updateById)
    .delete(RecipeController.deleteById);

  app.route("/users")
    .get(UserController.getAll)
    .post(UserController.create);

  app.route("/users/:id")
    .get(UserController.getById)
    .put(UserController.updateById)
    .delete(UserController.deleteById);
};