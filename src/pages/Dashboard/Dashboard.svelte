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
                        <!-- Microsoft API Count -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <!-- Microsoft Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                                </svg>
                                <p class="text-xl font-semibold">Microsoft</p>
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
                                <!-- Google Icon -->
                                <svg
                                    class="h-5 w-5"
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M23.4392061,12.2245191 C23.4392061,11.2412519 23.3594198,10.5237252 23.1867481,9.77963359 L11.9587786,9.77963359 L11.9587786,14.2176183 L18.5493435,14.2176183 C18.4165191,15.3205191 17.6989924,16.9814656 16.104458,18.0975573 L16.0821069,18.2461374 L19.6321832,20.9963359 L19.8781374,21.0208855 C22.1369771,18.9347176 23.4392061,15.8652824 23.4392061,12.2245191"
                                        fill="#4285F4"
                                    ></path>
                                    <path
                                        d="M11.9587786,23.9175573 C15.1876031,23.9175573 17.898229,22.8545038 19.8781374,21.0208855 L16.104458,18.0975573 C15.094626,18.8018015 13.7392672,19.2934351 11.9587786,19.2934351 C8.79636641,19.2934351 6.11230534,17.2073588 5.15551145,14.3239695 L5.01526718,14.3358779 L1.32384733,17.1927023 L1.27557252,17.3269008 C3.24210687,21.2334046 7.28152672,23.9175573 11.9587786,23.9175573"
                                        fill="#34A853"
                                    ></path>
                                    <path
                                        d="M5.15551145,14.3239695 C4.90305344,13.5798779 4.75694656,12.7825649 4.75694656,11.9587786 C4.75694656,11.1349008 4.90305344,10.3376794 5.14222901,9.59358779 L5.13554198,9.4351145 L1.3978626,6.53239695 L1.27557252,6.59056489 C0.465068702,8.21166412 0,10.0320916 0,11.9587786 C0,13.8854656 0.465068702,15.7058015 1.27557252,17.3269008 L5.15551145,14.3239695"
                                        fill="#FBBC05"
                                    ></path>
                                    <path
                                        d="M11.9587786,4.62403053 C14.2043359,4.62403053 15.719084,5.59401527 16.5828092,6.40461069 L19.9578321,3.10928244 C17.8850382,1.18259542 15.1876031,0 11.9587786,0 C7.28152672,0 3.24210687,2.68406107 1.27557252,6.59056489 L5.14222901,9.59358779 C6.11230534,6.71019847 8.79636641,4.62403053 11.9587786,4.62403053"
                                        fill="#EB4335"
                                    ></path>
                                </svg>
                                <p class="text-xl font-semibold">Google</p>
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
