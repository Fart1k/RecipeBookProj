<script setup lang="ts">
import { ref } from "vue"
import {createRouter, createWebHistory} from "vue-router"
import RecipesView from "./views/RecipesView.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
    path: "/",
    redirect: "/recipes"
  },
  {
    path: "/recipes",
    name: "recipes",
    component: RecipesView
  },
]
})
export default router

</script>

<template>
  <div>
    <header>
      <h1>RECIPEAPP</h1>
      <nav>
        <!--Validate that user is logged in here, block off any routelinks that unlogged inuser shouldnt have access to-->
        <RouterLink to="/recipes">Recipes</RouterLink>
        <RouterLink to="/users">Users</RouterLink>
      </nav>
    </header>
  </div>
</template>

<style scoped></style>
