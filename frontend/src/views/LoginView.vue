<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authenticationsServices } from "../services/authenticationsServices";

const router = useRouter();
const EmailAddress = ref("");
const Password = ref("");
const error = ref("");
const submitting = ref(false);

async function login() {
    submitting.value = true;
    error.value = "";

    try {
        await authenticationsServices.login(EmailAddress.value, Password.value);
        await router.push("/recipes");
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Login failed";
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <main>
        <section>
            <h2>Login</h2>
            <form @submit.prevent="login">
                <label for="login-email">Email address</label>
                <input id="login-email" v-model.trim="EmailAddress" type="email" required />

                <label for="login-password">Password</label>
                <input id="login-password" v-model="Password" type="password" required />

                <p v-if="error" role="alert">{{ error }}</p>
                <button type="submit" :disabled="submitting">{{ submitting ? "Logging in" : "Login" }}</button>
            </form>
        </section>
    </main>
</template>
