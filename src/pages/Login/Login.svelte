<script lang="ts">
    import { goto } from "$app/navigation";
    import { API_BASE_URL } from "../../global/const";
    import { onMount } from "svelte";
    import { isAdminAuthenticated } from "../../global/security";

    let username = "";
    let password = "";
    let tokenValid = false;
    let showPassword = false;
    let errorMessage = "";

    onMount(async () => {
        const token = localStorage.getItem("adminAccessToken");
        if (token) {
            const isAuthenticated = await isAdminAuthenticated();
            if (isAuthenticated) {
                tokenValid = true;
            }
        }
        document.addEventListener("keydown", handleKeyDown);
    });

    const togglePasswordVisibility = () => {
        showPassword = !showPassword;
    };

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}admin/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                errorMessage = data.error as string;
            }

            localStorage.setItem("adminAccessToken", data.accessToken);
            errorMessage = "";

            goto("/dashboard");
        } catch (error) {
            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "An unknown error occurred";
            }
        }
    };

    const goToDashboard = () => {
        goto("/dashboard");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            handleLogin();
        } else if (event.key === "Tab") {
            event.preventDefault();

            const target = document.activeElement as HTMLElement;
            if (!username) {
                (document.getElementById("username") as HTMLElement).focus();
            } else if (!password) {
                (document.getElementById("password") as HTMLElement).focus();
            } else if (target.id === "username") {
                (document.getElementById("password") as HTMLElement).focus();
            } else {
                (document.getElementById("username") as HTMLElement).focus();
            }
        }
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

                        <div class="relative items-stretch mt-2 flex">
                            {#if showPassword}
                                <input
                                    type="text"
                                    id="password"
                                    class="flex-1 rounded-l-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 sm:text-sm sm:leading-6"
                                    bind:value={password}
                                    placeholder="Enter your password"
                                />
                            {:else}
                                <input
                                    type="password"
                                    id="password"
                                    class="flex-1 rounded-l-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 sm:text-sm sm:leading-6"
                                    bind:value={password}
                                    placeholder="Enter your password"
                                />
                            {/if}
                            <button
                                on:click={togglePasswordVisibility}
                                class="p-2 bg-gray-50 rounded-r-md ring-l-none ring-1 ring-inset ring-gray-300"
                            >
                                {#if !showPassword}
                                    <!-- Show Password Icon -->
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-6 h-6"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                        />
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                        />
                                    </svg>
                                {:else}
                                    <!-- Hide Password Icon -->
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-6 h-6"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                        />
                                    </svg>
                                {/if}
                            </button>
                        </div>

                        <!-- Error Message -->
                        {#if errorMessage}
                            <p class="text-red-500 mt-2 text-sm">{errorMessage}</p>
                        {/if}

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

    {#if tokenValid}
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
