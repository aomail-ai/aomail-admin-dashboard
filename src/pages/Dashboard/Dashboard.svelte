<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { getData } from "../../global/fetchData";
    import { goto } from "$app/navigation";
    import { isAdminAuthenticated } from "../../global/security";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faEnvelope, faUsers, faUserShield, faDollarSign, faCoins } from "@fortawesome/free-solid-svg-icons";
    import Header from "../../global/components/Header.svelte";
    import NotificationTimer from "../../global/components/NotificationTimer.svelte";
    import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp";

    interface DashboardData {
        emailCount: number;
        socialApiCount: number;
        userCount: number;
        adminCount: number;
    }

    interface CostsData {
        minTokensOutput: number;
        maxTokensOutput: number;
        minTokensInput: number;
        maxTokensInput: number;
        totalTokensInput: number;
        totalTokensOutput: number;
        totalEstimatedCostInput: number;
        totalEstimatedCostOutput: number;
        totalEstimatedCost: number;
        averageTokensInputPerUser: number;
        averageTokensOutputPerUser: number;
        averageCostInputPerUser: number;
        averageCostOutputPerUser: number;
        averageTotalCostPerUser: number;
    }

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

    const dashboardData = writable<DashboardData | null>(null);
    const costsData = writable<CostsData | null>(null);
    const isLoading = writable(true);

    const fetchDashboardData = async () => {
        const result = await getData("admin/get_dashboard_data");

        if (!result.success) {
            displayPopup("error", "Failed to fetch dashboard data", result.error as string);
        } else {
            dashboardData.set(result.data);
        }
    };

    const fetchCostsInfo = async () => {
        const result = await getData("admin/get_costs_info");

        if (!result.success) {
            displayPopup("error", "Failed to fetch costs data", result.error as string);
        } else {
            costsData.set(result.data.costs);
        }
    };

    onMount(async () => {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            goto("/");
        } else {
            await fetchDashboardData();
            await fetchCostsInfo();
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
    <div class="mt-6 px-6">
        <h1 class="text-4xl font-bold text-gray-900 text-center mb-10">Admin Dashboard</h1>

        <!-- Statistics Cards -->
        {#if $dashboardData && $costsData}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Email Count -->
                <div class="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                    <div class="flex items-center justify-between">
                        <div>
                            <FontAwesomeIcon icon={faEnvelope} class="text-4xl" />
                        </div>
                        <div class="text-right">
                            <p class="text-xl font-semibold">Email{$dashboardData.emailCount > 1 ? "s" : ""}</p>
                            <p class="text-3xl font-bold">{$dashboardData.emailCount}</p>
                        </div>
                    </div>
                </div>

                <!-- Social API Count -->
                <div class="bg-green-500 text-white p-6 rounded-lg shadow-md">
                    <div class="flex items-center justify-between">
                        <div>
                            <FontAwesomeIcon icon={faUsers} class="text-4xl" />
                        </div>
                        <div class="text-right">
                            <p class="text-xl font-semibold">
                                Social API{$dashboardData.socialApiCount > 1 ? "s" : ""} Linked
                            </p>
                            <p class="text-3xl font-bold">{$dashboardData.socialApiCount}</p>
                        </div>
                    </div>
                </div>

                <!-- User Count -->
                <div class="bg-purple-500 text-white p-6 rounded-lg shadow-md">
                    <div class="flex items-center justify-between">
                        <div>
                            <FontAwesomeIcon icon={faUsers} class="text-4xl" />
                        </div>
                        <div class="text-right">
                            <p class="text-xl font-semibold">User{$dashboardData.userCount > 1 ? "s" : ""}</p>
                            <p class="text-3xl font-bold">{$dashboardData.userCount}</p>
                        </div>
                    </div>
                </div>

                <!-- Admin Count -->
                <div class="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
                    <div class="flex items-center justify-between">
                        <div>
                            <FontAwesomeIcon icon={faUserShield} class="text-4xl" />
                        </div>
                        <div class="text-right">
                            <p class="text-xl font-semibold">Admin{$dashboardData.adminCount > 1 ? "s" : ""}</p>
                            <p class="text-3xl font-bold">{$dashboardData.adminCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Costs Information -->
            <div class="mt-10">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Cost Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Total Estimated Cost -->
                    <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md">
                        <div class="flex items-center justify-between">
                            <div>
                                <FontAwesomeIcon icon={faDollarSign} class="text-4xl" />
                            </div>
                            <div class="text-right">
                                <p class="text-xl font-semibold">Total Estimated Cost</p>
                                <p class="text-3xl font-bold">$ {$costsData.totalEstimatedCost.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Average Cost Per User -->
                    <div class="bg-gray-700 text-white p-6 rounded-lg shadow-md">
                        <div class="flex items-center justify-between">
                            <div>
                                <FontAwesomeIcon icon={faDollarSign} class="text-4xl" />
                            </div>
                            <div class="text-right">
                                <p class="text-xl font-semibold">Avg Cost Per User</p>
                                <p class="text-3xl font-bold">$ {$costsData.averageTotalCostPerUser.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Total Tokens Input -->
                    <div class="bg-gray-600 text-white p-6 rounded-lg shadow-md">
                        <div class="flex items-center justify-between">
                            <div>
                                <FontAwesomeIcon icon={faCoins} class="text-4xl" />
                            </div>
                            <div class="text-right">
                                <p class="text-xl font-semibold">Total Tokens Input</p>
                                <p class="text-3xl font-bold">{$costsData.totalTokensInput}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Total Tokens Output -->
                    <div class="bg-gray-600 text-white p-6 rounded-lg shadow-md">
                        <div class="flex items-center justify-between">
                            <div>
                                <FontAwesomeIcon icon={faCoins} class="text-4xl" />
                            </div>
                            <div class="text-right">
                                <p class="text-xl font-semibold">Total Tokens Output</p>
                                <p class="text-3xl font-bold">{$costsData.totalTokensOutput}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {:else}
            <div class="text-center text-gray-600 mt-10">Fetching data...</div>
        {/if}
    </div>
{/if}
