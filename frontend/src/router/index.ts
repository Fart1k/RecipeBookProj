import { createRouter, createWebHistory } from "vue-router";
import RecipesView from "../views/RecipesView.vue";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import { currentUser, authReady } from "../services/authenticationsServices";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", redirect: "/recipes" },
        { path: "/recipes", name: "recipes", component: RecipesView, meta: { requiresAuth: true } },
        { path: "/register", name: "register", component: RegisterView, meta: { guestOnly: true } },
        { path: "/login", name: "login", component: LoginView, meta: { guestOnly: true } }
    ]
});

router.beforeEach(async (to) => {
    if (!authReady.value) {
        const { authenticationsServices } = await import("../services/authenticationsServices");
        await authenticationsServices.refresh();
    }

    if (to.meta.requiresAuth && !currentUser.value) return "/login";
    if (to.meta.guestOnly && currentUser.value) return "/recipes";
});

export default router;
