<script setup lang="ts">
    import { writable } from "svelte/store";
    import { postData, putData, deleteData } from "../../global/fetchData";
    import Header from "../../global/components/Header.svelte";
    import { isAdminAuthenticated } from "../../global/security";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    const newAdminUsername = writable("");
    const newAdminPassword = writable("");
    const currentAdminUsername = writable("");
    const currentAdminPassword = writable("");
    const adminIdToDelete = writable("");
    const adminUsernameToDelete = writable("");

    const errorMessage = writable("");
    const successMessage = writable("");
    const isLoading = writable(true);

    const addNewAdmin = async () => {
        const username = $newAdminUsername;
        const password = $newAdminPassword;

        if (username.length < 4) {
            errorMessage.set("Username must be at least 4 characters long.");
            successMessage.set("");
            return;
        }
        if (!(8 <= password.length && password.length <= 50)) {
            errorMessage.set("Password must be between 8 and 50 characters long.");
            successMessage.set("");
            return;
        }

        const result = await postData("admin/create_superuser", { username, password });
        if (result.success) {
            successMessage.set("New admin created successfully!");
            errorMessage.set("");
            newAdminUsername.set("");
            newAdminPassword.set("");
        } else {
            errorMessage.set(result.error || "Failed to create new admin.");
            successMessage.set("");
        }
    };

    const updateCurrentAdmin = async () => {
        const username = $currentAdminUsername;
        const password = $currentAdminPassword;

        if (username.length < 4) {
            errorMessage.set("Username must be at least 4 characters long.");
            successMessage.set("");
            return;
        }
        if (!(8 <= password.length && password.length <= 50)) {
            errorMessage.set("Password must be between 8 and 50 characters long.");
            successMessage.set("");
            return;
        }

        const result = await putData("admin/update_admin_data/", { username, password });
        if (result.success) {
            successMessage.set("Admin details updated successfully!");
            errorMessage.set("");
            currentAdminUsername.set("");
            currentAdminPassword.set("");
        } else {
            errorMessage.set(result.error || "Failed to update admin details.");
            successMessage.set("");
        }
    };

    const deleteAdmin = async () => {
        const adminId = $adminIdToDelete;
        const adminUsername = $adminUsernameToDelete;

        if (!adminId && !adminUsername) {
            errorMessage.set("Please provide either an Admin ID or Username.");
            successMessage.set("");
            return;
        }

        const result = await deleteData("admin/delete_admin", { id: adminId, username: adminUsername });
        if (result.success) {
            successMessage.set("Admin deleted successfully!");
            errorMessage.set("");
            adminIdToDelete.set("");
            adminUsernameToDelete.set("");
        } else {
            errorMessage.set(result.error || "Failed to delete admin.");
            successMessage.set("");
        }
    };

    onMount(async () => {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            goto("/");
        } else {
            isLoading.set(false);
        }
    });
</script>

{#if $isLoading}
    <div class="text-center text-gray-600 mt-10">Loading...</div>
{:else}
    <Header />
    <div class="bg-gray-100 min-h-screen p-8">
        <h1 class="text-3xl font-bold text-center mb-6">Admin Management</h1>

        <!-- Messages for errors and success -->
        {#if $errorMessage}
            <div class="mt-4 bg-red-100 text-red-600 text-center p-3 rounded-md">
                <p>{$errorMessage}</p>
            </div>
        {/if}
        {#if $successMessage}
            <div class="mt-4 bg-green-100 text-green-600 text-center p-3 rounded-md">
                <p>{$successMessage}</p>
            </div>
        {/if}

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
                <input
                    type="password"
                    id="newAdminPassword"
                    bind:value={$newAdminPassword}
                    class="mt-1 block w-full border rounded-md p-2"
                    placeholder="Enter password"
                />
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
                <input
                    type="password"
                    id="currentAdminPassword"
                    bind:value={$currentAdminPassword}
                    class="mt-1 block w-full border rounded-md p-2"
                    placeholder="Enter new password"
                />
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
