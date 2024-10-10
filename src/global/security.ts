import { API_BASE_URL } from "./const";
import { redirect } from "@sveltejs/kit";

interface AuthResponse {
    isAdmin: boolean;
}

interface RefreshTokenResponse {
    accessToken: string;
}

export async function isAdminAuthenticated(): Promise<boolean> {
    const accessToken = localStorage.getItem("adminAccessToken");
    if (!accessToken) {
        return false;
    }

    try {
        const requestOptions: RequestInit = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await fetchWithToken(`${API_BASE_URL}is_admin/`, requestOptions);
        if (!response) {
            return false;
        }

        const data: AuthResponse = await response.json();
        return data.isAdmin;
    } catch (error) {
        return false;
    }
}

export async function fetchWithToken(url: string, options: RequestInit = {}): Promise<Response | void> {
    try {
        const accessToken = localStorage.getItem("adminAccessToken");

        if (!options.headers) {
            options.headers = {};
        }

        if (accessToken) {
            (options.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
        } else {
            return;
        }

        let response = await fetch(url, options);

        if (response.status === 401) {
            const refreshResponse = await fetch(`${API_BASE_URL}token/refresh/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ accessToken: accessToken }),
            });

            if (refreshResponse.ok) {
                const refreshData: RefreshTokenResponse = await refreshResponse.json();
                const newAccessToken = refreshData.accessToken;
                localStorage.setItem("adminAccessToken", newAccessToken);
                (options.headers as Record<string, string>)["Authorization"] = `Bearer ${newAccessToken}`;
                response = await fetch(url, options);
            } else {
                redirect(401, "/");
            }
        }

        return response;
    } catch (error) {
        return;
    }
}
