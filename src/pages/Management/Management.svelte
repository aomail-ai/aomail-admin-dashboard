<script setup lang="ts">
    import { writable } from "svelte/store";
    import { postData, putData, deleteData } from "../../global/fetchData";
    import Header from "../../global/components/Header.svelte";
    import { isAdminAuthenticated } from "../../global/security";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
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

        const result = await postData("admin/create_superuser", { username, password });
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

        if (username.length < 4) {
            displayPopup("error", "Invalid Username", "Username must be at least 4 characters long.");
            return;
        }
        if (!(8 <= password.length && password.length <= 50)) {
            displayPopup("error", "Invalid Password", "Password must be between 8 and 50 characters long.");
            return;
        }

        const result = await putData("admin/update_admin_data/", { username, password });
        if (result.success) {
            displayPopup("success", "Success", "Admin details updated successfully!");
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

        const result = await deleteData("admin/delete_admin", { id: adminId, username: adminUsername });
        if (result.success) {
            displayPopup("success", "Success", "Admin deleted successfully!");
            adminIdToDelete.set("");
            adminUsernameToDelete.set("");
        } else {
            displayPopup("error", "Deletion Error", result.error as string);
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
