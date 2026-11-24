import { ref } from "vue";

export interface UserSummary {
    id: string;
    UserName: string;
    EmailAddress: string;
    UserStatus: string;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const currentUser = ref<UserSummary | null>(null);
export const authReady = ref(false);

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        }
    });

    if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
}

export const authenticationsServices = {
    async login(EmailAddress: string, Password: string) {
        const result = await request<{ user: UserSummary }>("/authentication", {
            method: "POST",
            body: JSON.stringify({ EmailAddress, Password })
        });
        currentUser.value = result.user;
        return result.user;
    },

    async refresh() {
        try {
            const user = await request<UserSummary>("/authentication/current");
            currentUser.value = user;
            return user;
        } catch {
            currentUser.value = null;
            return null;
        } finally {
            authReady.value = true;
        }
    },

    async logout() {
        await request<{ message: string }>("/authentication", { method: "DELETE" });
        currentUser.value = null;
    }
};
