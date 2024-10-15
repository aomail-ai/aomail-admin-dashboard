<script setup lang="ts">
    import { writable } from "svelte/store";
    import { putData } from "../../global/fetchData";
    import Header from "../../global/components/Header.svelte";
    import { isAdminAuthenticated } from "../../global/security";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    const errorMessage = writable("");
    const successMessage = writable("");
    const isLoading = writable(true);
    const userId = writable("");
    const username = writable("");
    const emailAddress = writable("");
    const selectedPlan = writable("");

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
        }
    });

    async function handleUpdate() {
        errorMessage.set("");
        successMessage.set("");

        if (!$userId && !$username && !$emailAddress) {
            errorMessage.set("Please provide at least one identifier (User ID, Username, or Email Address).");
            return;
        }

        const requestBody = {
            id: $userId || undefined,
            username: $username || undefined,
            emailAddress: $emailAddress || undefined,
            plan: $selectedPlan,
        };

        const result = await putData("admin/update_user_info/", requestBody);

        if (!result.success) {
            errorMessage.set(result.error as string);
        } else {
            successMessage.set("User information updated successfully");
        }
    }
</script>

{#if $isLoading}
    <div class="text-center text-gray-600 mt-10">Loading...</div>
{:else}
    <Header />
    <div class="p-6 space-y-6">
        <h1 class="text-3xl font-semibold text-gray-800">Update User Subscription</h1>

        {#if $errorMessage}
            <div class="text-red-600 font-semibold mt-4">
                {$errorMessage}
            </div>
        {/if}

        {#if $successMessage}
            <div class="text-green-600 font-semibold mt-4">
                {$successMessage}
            </div>
        {/if}

        <!-- User Inputs Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- User ID Input -->
            <div>
                <label for="user-id" class="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <input
                    id="user-id"
                    type="text"
                    bind:value={$userId}
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
                    bind:value={$username}
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
                    bind:value={$emailAddress}
                    placeholder="Enter Email Address"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                />
            </div>
        </div>

        <!-- Subscription Plan Selection -->
        <div>
            <label for="plan-select" class="block text-sm font-medium text-gray-700 mb-2">
                Select Subscription Plan
            </label>
            <select
                id="plan-select"
                bind:value={$selectedPlan}
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            >
                <option value="" disabled selected>Select a plan</option>
                {#each plans as { name, plan }}
                    <option value={plan}>{name}</option>
                {/each}
            </select>
        </div>

        <!-- Button to Update Subscription -->
        <button class="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4" on:click={handleUpdate}>
            Update Subscription
        </button>
    </div>
{/if}
