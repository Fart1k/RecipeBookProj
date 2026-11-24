<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { authReady, currentUser, authenticationsServices } from "./services/authenticationsServices";

const router = useRouter();

onMounted(() => {
    authenticationsServices.refresh();
});

async function logout() {
    await authenticationsServices.logout();
    await router.push("/login");
}
</script>

<template>
    <div>
        <header>
            <h1>RecipeBook</h1>
            <nav>
                <RouterLink to="/recipes">Recipes</RouterLink>
                <RouterLink v-if="!currentUser" to="/register">Register</RouterLink>
                <RouterLink v-if="!currentUser" to="/login">Login</RouterLink>
                <span v-if="currentUser">{{ currentUser.UserName }}</span>
                <button v-if="currentUser" type="button" @click="logout">Logout</button>
            </nav>
        </header>
        <RouterView v-if="authReady" />
    </div>
</template>
