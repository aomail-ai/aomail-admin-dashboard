<script setup lang="ts">
    import { writable } from "svelte/store";
    import { postData, putData, deleteData } from "../../global/fetchData";
    import Header from "../../global/components/Header.svelte";
    import { isAdminAuthenticated } from "../../global/security";
    import { onDestroy, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import NotificationTimer from "../../global/components/NotificationTimer.svelte";
    import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp";

    const showNotification = writable(false);
    const notificationTitle = writable("");
    const notificationMessage = writable("");
    const backgroundColor = writable("");
    let timerId: NodeJS.Timeout | null = null;

    function dismissPopup() {
        showNotification.set(false);
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
    }

    function displayPopup(type: "success" | "error", title: string, message: string) {
        if (type === "error") {
            displayErrorPopup(
                showNotification,
                notificationTitle,
                notificationMessage,
                backgroundColor,
                title,
                message,
            );
        } else {
            displaySuccessPopup(
                showNotification,
                notificationTitle,
                notificationMessage,
                backgroundColor,
                title,
                message,
            );
        }
        timerId = setTimeout(dismissPopup, 4000);
    }

    const newAdminUsername = writable("");
    const newAdminPassword = writable("");
    const currentAdminUsername = writable("");
    const currentAdminPassword = writable("");
    const adminIdToDelete = writable("");
    const adminUsernameToDelete = writable("");
    const isLoading = writable(true);

    let showPassword = false;
    let showNewPassword = false;

    const addNewAdmin = async () => {
        const username = $newAdminUsername;
        const password = $newAdminPassword;

        if (username.length < 4) {
            displayPopup("error", "Invalid Username", "Username must be at least 4 characters long.");
            return;
        }
        if (!(8 <= password.length && password.length <= 50)) {
            displayPopup("error", "Invalid Password", "Password must be between 8 and 50 characters long.");
            return;
        }

        const result = await postData("admin/create_superuser/", { username, password });
        if (result.success) {
            displayPopup("success", "Success", "New admin created successfully!");
            newAdminUsername.set("");
            newAdminPassword.set("");
        } else {
            displayPopup("error", "Creation Error", result.error as string);
        }
    };

    const updateCurrentAdmin = async () => {
        const username = $currentAdminUsername;
        const password = $currentAdminPassword;

        if (!username && !password) {
            displayPopup(
                "error",
                "Missing Inputs",
                "Please provide either a username, password, or both to update your account.",
            );
            return;
        }

        if (username && username.length < 4) {
            displayPopup("error", "Invalid Username", "The username must be at least 4 characters long.");
            return;
        }

        if (password && (password.length < 8 || password.length > 50)) {
            displayPopup("error", "Invalid Password", "The password must be between 8 and 50 characters long.");
            return;
        }

        const result = await putData("admin/update_admin_data/", { username, password });

        if (result.success) {
            displayPopup("success", "Success", "Admin details have been updated successfully!");
            currentAdminUsername.set("");
            currentAdminPassword.set("");
        } else {
            displayPopup("error", "Update Error", result.error as string);
        }
    };

    const deleteAdmin = async () => {
        const adminId = $adminIdToDelete;
        const adminUsername = $adminUsernameToDelete;

        if (!adminId && !adminUsername) {
            displayPopup("error", "Missing Information", "Please provide either an Admin ID or Username.");
            return;
        }

        const result = await deleteData("admin/delete_admin/", { id: adminId, username: adminUsername });
        if (result.success) {
            displayPopup("success", "Success", "Admin deleted successfully!");
            adminIdToDelete.set("");
            adminUsernameToDelete.set("");
        } else {
            displayPopup("error", "Deletion Error", result.error as string);
        }
    };

    const togglePasswordVisibility = () => {
        showPassword = !showPassword;
    };

    const toggleNewPasswordVisibility = () => {
        showNewPassword = !showNewPassword;
    };

    function handleKeydown(event: KeyboardEvent) {
        const target = event.target as HTMLInputElement;

        const newAdminUsername = document.getElementById("newAdminUsername") as HTMLInputElement;
        const newAdminPassword = document.getElementById("newAdminPassword") as HTMLInputElement;
        const currentAdminUsername = document.getElementById("currentAdminUsername") as HTMLInputElement;
        const currentAdminPassword = document.getElementById("currentAdminPassword") as HTMLInputElement;
        const deleteAdminId = document.getElementById("adminIdToDelete") as HTMLInputElement;
        const deleteAdminUsername = document.getElementById("adminUsernameToDelete") as HTMLInputElement;

        if (event.key === "Tab") {
            event.preventDefault();

            if (target === newAdminUsername) {
                newAdminPassword.focus();
            } else if (target === newAdminPassword) {
                newAdminUsername.focus();
            } else if (target === currentAdminUsername) {
                currentAdminPassword.focus();
            } else if (target === currentAdminPassword) {
                currentAdminUsername.focus();
            } else if (target === deleteAdminId) {
                deleteAdminUsername.focus();
            } else if (target === deleteAdminUsername) {
                deleteAdminId.focus();
            }
        } else if (event.key === "Enter") {
            event.preventDefault();

            if (target === newAdminUsername || target === newAdminPassword) {
                addNewAdmin();
            } else if (target === currentAdminUsername || target === currentAdminPassword) {
                updateCurrentAdmin();
            } else if (target === deleteAdminId || target === deleteAdminUsername) {
                deleteAdmin();
            }
        }
    }

    onMount(async () => {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            goto("/");
        } else {
            isLoading.set(false);
            window.addEventListener("keydown", handleKeydown);
        }
    });

    onDestroy(() => {
        if (browser) {
            document.removeEventListener("keydown", handleKeydown);
        }
    });
</script>

{#if $showNotification}
    <NotificationTimer
        showNotification={$showNotification}
        notificationTitle={$notificationTitle}
        notificationMessage={$notificationMessage}
        backgroundColor={$backgroundColor}
    />
{/if}
{#if $isLoading}
    <div class="text-center text-gray-600 mt-10">Loading...</div>
{:else}
    <Header />
    <div class="bg-gray-100 min-h-screen p-8">
        <h1 class="text-3xl font-bold text-center mb-6">Admin Management</h1>

        <!-- Admin Management Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <!-- Add New Admin Form -->
            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Add New Admin</h2>
                <label for="newAdminUsername" class="block mb-2">Username:</label>
                <input
                    type="text"
                    id="newAdminUsername"
                    bind:value={$newAdminUsername}
                    class="mt-1 block w-full border rounded-md p-2"
                    placeholder="Enter username"
                />
                <label for="newAdminPassword" class="block mt-4 mb-2">Password:</label>
                <div class="relative items-stretch mt-2 flex">
                    {#if showPassword}
                        <input
                            type="text"
                            id="newAdminPassword"
                            bind:value={$newAdminPassword}
                            class="flex-1 rounded-l-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 sm:text-sm sm:leading-6"
                            placeholder="Enter password"
                        />
                    {:else}
                        <input
                            type="password"
                            id="newAdminPassword"
                            bind:value={$newAdminPassword}
                            class="flex-1 rounded-l-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 sm:text-sm sm:leading-6"
                            placeholder="Enter password"
                        />
                    {/if}
                    <button
                        on:click={togglePasswordVisibility}
                        class="p-2 bg-gray-50 rounded-r-md ring-l-none ring-1 ring-inset ring-gray-300"
                    >
                        {#if !showPassword}
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
                <button
                    on:click={addNewAdmin}
                    class="mt-4 w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                >
                    Create Admin
                </button>
            </div>

            <!-- Update Current Admin Form -->
            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Update Current Admin</h2>
                <label for="currentAdminUsername" class="block mb-2">New Username:</label>
                <input
                    type="text"
                    id="currentAdminUsername"
                    bind:value={$currentAdminUsername}
                    class="mt-1 block w-full border rounded-md p-2"
                    placeholder="Enter new username"
                />
                <label for="currentAdminPassword" class="block mt-4 mb-2">New Password:</label>
                <div class="relative items-stretch mt-2 flex">
                    {#if showNewPassword}
                        <input
                            type="text"
                            id="currentAdminPassword"
                            bind:value={$currentAdminPassword}
                            class="flex-1 rounded-l-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 sm:text-sm sm:leading-6"
                            placeholder="Enter new password"
                        />
                    {:else}
                        <input
                            type="password"
                            id="currentAdminPassword"
                            bind:value={$currentAdminPassword}
                            class="flex-1 rounded-l-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 sm:text-sm sm:leading-6"
                            placeholder="Enter new password"
                        />
                    {/if}
                    <button
                        on:click={toggleNewPasswordVisibility}
                        class="p-2 bg-gray-50 rounded-r-md ring-l-none ring-1 ring-inset ring-gray-300"
                    >
                        {#if !showNewPassword}
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
                <p class="text-gray-600 text-sm mt-2">
                    <em>
                        Note: You can update either the username, the password, or both. If a field is left empty, the
                        current value will remain unchanged.
                    </em>
                </p>
                <button
                    on:click={updateCurrentAdmin}
                    class="mt-4 w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                >
                    Update Admin
                </button>
            </div>

            <!-- Delete Admin Form -->
            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Delete Admin</h2>
                <label for="adminIdToDelete" class="block mb-2">Admin ID (Optional):</label>
                <input
                    type="text"
                    id="adminIdToDelete"
                    bind:value={$adminIdToDelete}
                    class="mt-1 block w-full border rounded-md p-2"
                    placeholder="Enter admin ID"
                />
                <label for="adminUsernameToDelete" class="block mt-4 mb-2">Admin Username (Optional):</label>
                <input
                    type="text"
                    id="adminUsernameToDelete"
                    bind:value={$adminUsernameToDelete}
                    class="mt-1 block w-full border rounded-md p-2"
                    placeholder="Enter admin username"
                />
                <p class="text-gray-600 text-sm mt-2">
                    <em>Note: You only need to provide either Admin ID or Username to delete the account.</em>
                </p>
                <button
                    on:click={deleteAdmin}
                    class="mt-4 w-full bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700"
                >
                    Delete Admin
                </button>
            </div>
        </div>
    </div>
{/if}
