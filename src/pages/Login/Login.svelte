<script lang="ts">
    import { goto } from "$app/navigation";
    import { API_BASE_URL } from "../../global/const";
    import { onMount } from "svelte";

    let username = "";
    let password = "";
    let hasToken = false;

    onMount(() => {
        const token = localStorage.getItem("adminAccessToken");
        if (token) {
            hasToken = true;
        }
    });

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}admin/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            console.log("response", response);

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();

            localStorage.setItem("adminAccessToken", data.accessToken);

            goto("/dashboard");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const goToDashboard = () => {
        goto("/dashboard");
    };
</script>

<div class="bg-black min-h-screen flex flex-col justify-center py-20 sm:py-32">
    <div class="px-4 sm:px-6 lg:px-8 flex-grow">
        <div class="mx-auto max-w-md px-6 sm:max-w-3xl lg:max-w-7xl lg:px-8">
            <div class="relative overflow-hidden rounded-2xl px-6 py-10 shadow-none sm:px-12 sm:py-20">
                <div class="relative">
                    <div class="sm:text-center">
                        <h2
                            class="mt-2 font-display text-white font-medium text-3xl tracking-tight sm:text-4xl md:text-5xl"
                        >
                            Dashboard
                        </h2>
                        <p class="mx-auto mt-4 text-white max-w-2xl text-lg">
                            This login page is for admin users only.
                        </p>
                    </div>
                    <div class="mt-8">
                        <label for="username" class="block text-white">Username:</label>
                        <input
                            type="text"
                            id="username"
                            bind:value={username}
                            placeholder="Enter your username"
                            class="mt-2 w-full rounded-md border border-gray-300 p-2"
                        />

                        <label for="password" class="block mt-4 text-white">Password:</label>
                        <input
                            type="password"
                            id="password"
                            bind:value={password}
                            placeholder="Enter your password"
                            class="mt-2 w-full rounded-md border border-gray-300 p-2"
                        />

                        <button
                            on:click={handleLogin}
                            class="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {#if hasToken}
        <button
            on:click={goToDashboard}
            class="fixed bottom-4 right-4 p-3 rounded-full bg-gray-600 hover:bg-gray-700 text-white shadow-md"
            title="Go to Dashboard"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-6 h-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-7 0h6"
                />
            </svg>
        </button>
    {/if}
</div>
