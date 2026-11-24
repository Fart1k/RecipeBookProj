const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export interface UserRegister {
    UserName: string;
    EmailAddress: string;
    Password: string;
    PasswordConfirmation: string;
}

export const usersServices = {
    async register(user: UserRegister): Promise<void> {
        const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const result = await response.json().catch(() => null);
            throw new Error(result?.error || `Request failed with status ${response.status}`);
        }
    }
};
