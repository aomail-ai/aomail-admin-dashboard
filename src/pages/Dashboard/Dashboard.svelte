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
    import { formatFloat, formatInteger } from "../../global/formatters";

    interface DashboardData {
        email: {
            count: number;
            avgPerUser: number;
        };
        avgRulesPerUser: number;
        avgCreatedCategoriesPerUser: number;
        socialApiCount: {
            imap: number;
            microsoft: number;
            google: number;
            total: number;
        };
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
        const result = await getData("admin/get_costs_info/");

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
        notificationType={$notificationType}
    />
{/if}
{#if $isLoading}
    <div class="text-center text-gray-600 mt-10">Loading...</div>
{:else}
    <Header />
    <div class="mt-6 px-6">
        <h1 class="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        <!-- Statistics Cards -->
        {#if $dashboardData && $costsData}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Email and Related Stats -->
                <div class="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                    <div class="space-y-4">
                        <!-- Email Count -->
                        <div class="flex items-center justify-between">
                            <div>
                                <FontAwesomeIcon icon={faEnvelope} class="text-4xl" />
                            </div>
                            <div class="text-right">
                                <p class="text-xl font-semibold">Email{$dashboardData.email.count > 1 ? "s" : ""}</p>
                                <p class="text-3xl font-bold">{formatInteger($dashboardData.email.count)}</p>
                            </div>
                        </div>
                        <!-- Average Emails Per User -->
                        <div class="flex items-center justify-between">
                            <p class="text-lg">Avg Emails/User</p>
                            <p class="text-2xl font-semibold">{formatFloat($dashboardData.email.avgPerUser)}</p>
                        </div>
                    </div>
                </div>

                <!-- Social API Count Section -->
                <div class="bg-green-500 text-white p-6 rounded-lg shadow-md">
                    <div class="flex flex-col space-y-4">
                        <!-- Social APIs Linked -->
                        <div class="flex items-center justify-between">
                            <div>
                                <FontAwesomeIcon icon={faUsers} class="text-4xl" />
                            </div>
                            <div class="text-right">
                                <p class="text-xl font-semibold">Social APIs Linked</p>
                                <p class="text-3xl font-bold">{formatInteger($dashboardData.socialApiCount.total)}</p>
                            </div>
                        </div>
                        <!-- IMAP API Count -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <img class="w-5 h-5" src="/other.svg" alt="Aomail logo" />
                                <p class="text-xl font-semibold">IMAP</p>
                            </div>
                            <div class="text-right">
                                <p class="text-3xl font-bold">
                                    {formatInteger($dashboardData.socialApiCount.imap)}
                                </p>
                            </div>
                        </div>
                        <!-- Microsoft API Count -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <img src="/microsoft.svg" alt="Aomail logo" />
                                <p class="text-xl font-semibold">Microsoft (Oauth)</p>
                            </div>
                            <div class="text-right">
                                <p class="text-3xl font-bold">
                                    {formatInteger($dashboardData.socialApiCount.microsoft)}
                                </p>
                            </div>
                        </div>
                        <!-- Google API Count -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <img src="/google.svg" alt="Aomail logo" />
                                <p class="text-xl font-semibold">Google (Oauth)</p>
                            </div>
                            <div class="text-right">
                                <p class="text-3xl font-bold">{formatInteger($dashboardData.socialApiCount.google)}</p>
                            </div>
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
                            <p class="text-3xl font-bold">{formatInteger($dashboardData.userCount)}</p>
                        </div>
                    </div>
                    <!-- Average Rules Per User -->
                    <div class="flex items-center justify-between">
                        <p class="text-lg">Avg Rules/User</p>
                        <p class="text-2xl font-semibold">{formatFloat($dashboardData.avgRulesPerUser)}</p>
                    </div>
                    <!-- Average Created Categories Per User -->
                    <div class="flex items-center justify-between">
                        <p class="text-lg">Avg Created Categories/User</p>
                        <p class="text-2xl font-semibold">{formatFloat($dashboardData.avgCreatedCategoriesPerUser)}</p>
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
                            <p class="text-3xl font-bold">{formatInteger($dashboardData.adminCount)}</p>
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
                                <p class="text-3xl font-bold">{formatFloat($costsData.totalEstimatedCost, "$")}</p>
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
                                <p class="text-3xl font-bold">{formatFloat($costsData.averageTotalCostPerUser, "$")}</p>
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
                                <p class="text-3xl font-bold">{formatInteger($costsData.totalTokensInput)}</p>
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
                                <p class="text-3xl font-bold">{formatInteger($costsData.totalTokensOutput)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {:else}
            <div class="text-center text-gray-600 mt-10">No data available</div>
        {/if}
    </div>
{/if}
