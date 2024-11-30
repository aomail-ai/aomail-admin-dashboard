<script setup lang="ts">
    import { writable } from "svelte/store";
    import { putData } from "../../global/fetchData";
    import Header from "../../global/components/Header.svelte";
    import { isAdminAuthenticated } from "../../global/security";
    import { onDestroy, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import NotificationTimer from "../../global/components/NotificationTimer.svelte";
    import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp";

    const blockUser = writable(false);
    const showNotification = writable(false);
    const notificationTitle = writable("");
    const notificationMessage = writable("");
    const notificationType = writable("");
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
                notificationType,
                title,
                message,
            );
        } else {
            displaySuccessPopup(
                showNotification,
                notificationTitle,
                notificationMessage,
                notificationType,
                title,
                message,
            );
        }
        timerId = setTimeout(dismissPopup, 4000);
    }

    const isLoading = writable(true);
    let userId = "";
    let username = "";
    let emailAddress = "";
    let selectedPlan = "";

    const plans = [
        {
            name: "Start",
            plan: "start",
        },
        {
            name: "Premium",
            plan: "premium",
        },
        {
            name: "Enterprise",
            plan: "entreprise",
        },
    ];

    onMount(async () => {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            goto("/");
        } else {
            isLoading.set(false);
            window.addEventListener("keydown", handleKeydown);
        }
    });

    async function handleUpdate() {
        if (!userId && !username && !emailAddress) {
            displayPopup(
                "error",
                "Missing Identifier",
                "Please provide at least one identifier (User ID, Username, or Email Address).",
            );
            return;
        }

        const requestBody = {
            id: userId,
            username: username,
            emailAddress: emailAddress,
            plan: selectedPlan,
            blockUser: $blockUser,
        };

        const result = await putData("admin/update_user_info/", requestBody);

        if (!result.success) {
            displayPopup("error", "Update Error", result.error as string);
        } else {
            displayPopup("success", "Success", "User information updated successfully!");
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        const target = event.target as HTMLInputElement;
        const userIdField = document.getElementById("user-id") as HTMLInputElement;
        const usernameField = document.getElementById("username") as HTMLInputElement;
        const emailField = document.getElementById("email-address") as HTMLInputElement;

        if (event.key === "Tab") {
            event.preventDefault();

            if (target === userIdField) {
                usernameField.focus();
            } else if (target === usernameField) {
                emailField.focus();
            } else {
                userIdField.focus();
            }
        } else if (event.key === "Enter") {
            event.preventDefault();
            handleUpdate();
        }
    }

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
        notificationType={$notificationType}
    />
{/if}
{#if $isLoading}
    <div class="text-center text-gray-600 mt-10">Loading...</div>
{:else}
    <Header />
    <div class="p-6 space-y-6">
        <h1 class="text-3xl font-bold text-center mb-6">Update User Information</h1>

        <!-- User Inputs Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- User ID Input -->
            <div>
                <label for="user-id" class="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <input
                    id="user-id"
                    type="text"
                    bind:value={userId}
                    placeholder="Enter User ID"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                />
            </div>

            <!-- Username Input -->
            <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                    id="username"
                    type="text"
                    bind:value={username}
                    placeholder="Enter Username"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                />
            </div>

            <!-- Email Address Input -->
            <div>
                <label for="email-address" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                    id="email-address"
                    type="email"
                    bind:value={emailAddress}
                    placeholder="Enter Email Address"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                />
            </div>
        </div>

        <!-- Subscription Plan and Block User Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Select Subscription Plan -->
            <div>
                <label for="plan-select" class="block text-sm font-medium text-gray-700 mb-2">
                    Select Subscription Plan
                </label>
                <select
                    id="plan-select"
                    bind:value={selectedPlan}
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                >
                    <option value="" disabled selected>Select a plan</option>
                    {#each plans as { name, plan }}
                        <option value={plan}>{name}</option>
                    {/each}
                </select>
            </div>

            <!-- Block User Toggle with Message -->
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <label for="block-user" class="block text-sm font-medium text-gray-700 mr-4">Block User</label>
                    <input
                        id="block-user"
                        type="checkbox"
                        bind:checked={$blockUser}
                        class="text-blue-600 focus:ring focus:ring-blue-200"
                    />
                </div>

                <!-- Block/Unblock Message -->
                {#if $blockUser}
                    <span class="text-red-600">The user will be blocked</span>
                {:else}
                    <span class="text-green-600">The user will be unblocked</span>
                {/if}
            </div>
        </div>

        <!-- Button to Update Subscription -->
        <button class="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4" on:click={handleUpdate}>
            Update
        </button>
    </div>
{/if}
