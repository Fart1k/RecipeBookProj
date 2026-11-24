<script setup lang="ts">
import { ref } from "vue";
import { usersServices } from "../services/usersServices";

const emit = defineEmits<{ registered: [] }>();
const UserName = ref("");
const EmailAddress = ref("");
const Password = ref("");
const PasswordConfirmation = ref("");
const error = ref("");
const saving = ref(false);

async function register() {
    saving.value = true;
    error.value = "";

    try {
        await usersServices.register({
            UserName: UserName.value,
            EmailAddress: EmailAddress.value,
            Password: Password.value,
            PasswordConfirmation: PasswordConfirmation.value
        });
        emit("registered");
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Registration failed";
    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <section>
        <h2>Register</h2>
        <form @submit.prevent="register">
            <label for="username">Username</label>
            <input id="username" v-model.trim="UserName" required />

            <label for="email">Email address</label>
            <input id="email" v-model.trim="EmailAddress" type="email" required />

            <label for="password">Password</label>
            <input id="password" v-model="Password" type="password" required />

            <label for="password-confirmation">Confirm password</label>
            <input id="password-confirmation" v-model="PasswordConfirmation" type="password" required />

            <p v-if="error" role="alert">{{ error }}</p>
            <button type="submit" :disabled="saving">{{ saving ? "Registering" : "Register" }}</button>
        </form>
    </section>
</template>
