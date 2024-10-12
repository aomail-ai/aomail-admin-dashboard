<script lang="ts">
    import { writable, get } from "svelte/store";
    import { postData } from "../../global/fetchData";
    import Header from "../../global/components/Header.svelte";
    import { isAdminAuthenticated } from "../../global/security";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    interface EmailStats {
        since: {
            join: number;
            today: number;
            monday: number;
            mtd: number;
            ytd: number;
        };
        periods: {
            [key: string]: {
                avg: number;
                min: number;
                max: number;
            };
        };
    }

    interface UserStatistics {
        emailsStats: {
            [key: string]: EmailStats;
        };
        nbTokensInput: number;
        nbTokensOutput: number;
        estimatedCostUser: {
            priceTokensInput: number;
            priceTokensOutput: number;
            total: number;
        };
    }

    const metricLabelTranslations = {
        nbMightRequireAnswer: "Might Require Answer",
        nbEmailsReceived: "Emails Received",
        nbAnswerRequired: "Answer Required",
        nbNoAnswerRequired: "No Answer Required",
        nbHighlyRelevant: "Highly Relevant",
        nbPossiblyRelevant: "Possibly Relevant",
        nbNotRelevant: "Not Relevant",
        nbEmailsImportant: "Important Emails",
        nbEmailsInformative: "Informative Emails",
        nbEmailsUseless: "Useless Emails",
        nbScam: "Scam Emails",
        nbSpam: "Spam Emails",
        nbNewsletter: "Newsletters",
        nbNotification: "Notifications",
        nbMeeting: "Meeting Emails",
        join: "Since Joining",
        today: "Today",
        monday: "Monday",
        mtd: "Month to Date",
        ytd: "Year to Date",
        "24Hours": "24 Hours",
        "7Days": "7 Days",
        "30Days": "30 Days",
        "3Months": "3 Months",
        "6Months": "6 Months",
        "1year": "1 Year",
        "5years": "5 Years",
    } as const;

    const statisticsMetrics: (keyof typeof metricLabelTranslations)[] = [
        "nbEmailsReceived",
        "nbMightRequireAnswer",
        "nbAnswerRequired",
        "nbNoAnswerRequired",
        "nbHighlyRelevant",
        "nbPossiblyRelevant",
        "nbNotRelevant",
        "nbEmailsImportant",
        "nbEmailsInformative",
        "nbEmailsUseless",
        "nbScam",
        "nbSpam",
        "nbNewsletter",
        "nbNotification",
        "nbMeeting",
    ];

    const isLoading = writable(true);

    type MetricKey = keyof typeof metricLabelTranslations;
    type SinceKey = "join" | "today" | "monday" | "mtd" | "ytd";
    const sinceOptions: MetricKey[] = ["join", "today", "monday", "mtd", "ytd"];
    const periodOptions = ["24Hours", "7Days", "30Days", "3Months", "6Months", "1year", "5years"];

    const data = writable<UserStatistics | null>(null);
    const selectedMetric = writable<keyof typeof metricLabelTranslations>(statisticsMetrics[0]);
    const selectedSinceOptions = writable<string[]>([]);
    const selectedPeriodOptions = writable<string[]>([]);
    const userId = writable("");
    const username = writable("");
    const emailAddress = writable("");
    const errorMessage = writable("");

    const fetchStatistics = async () => {
        const emailsStatsParam: Record<string, any> = {};
        const $selectedMetric = get(selectedMetric);

        emailsStatsParam[$selectedMetric] = {
            since: get(selectedSinceOptions),
            periods: {},
        };

        const $selectedPeriodOptions = get(selectedPeriodOptions);
        $selectedPeriodOptions.forEach((period) => {
            emailsStatsParam[$selectedMetric].periods[period] = ["avg", "min", "max"];
        });

        const result = await postData(`admin/search_user_info/`, {
            id: get(userId),
            username: get(username),
            emailAddress: get(emailAddress),
            emailsStatsParam,
        });

        if (!result.success) {
            errorMessage.set(result.error as string);
            data.set(null);
        } else {
            errorMessage.set("");
            data.set(result.data as UserStatistics);
        }
    };

    const handleFetch = () => {
        fetchStatistics();
    };

    onMount(async () => {
        const isAuthenticated = await isAdminAuthenticated();
        if (!isAuthenticated) {
            goto("/");
        } else {
            isLoading.set(false);
        }
    });

    const getTranslation = (key: string) => {
        return metricLabelTranslations[key as keyof typeof metricLabelTranslations] || key;
    };

    let translatedSinceKeys: Record<string, string> = {};

    $: {
        if ($data) {
            for (const key of Object.keys($data.emailsStats)) {
                const since = $data.emailsStats[key].since;
                for (const sinceKey in since) {
                    translatedSinceKeys[sinceKey] = getTranslation(sinceKey as SinceKey);
                }
            }
        }
    }

    function getSinceValue(key: string, sinceKey: string) {
        const emailStats = $data?.emailsStats[key];
        return emailStats?.since[sinceKey as SinceKey] || 0;
    }
</script>

{#if $isLoading}
    <div class="text-center text-gray-600 mt-10">Loading...</div>
{:else}
    <Header />
    <div class="p-6 space-y-6">
        <h1 class="text-3xl font-semibold text-gray-800">User Statistics Dashboard</h1>

        {#if $errorMessage}
            <div class="text-red-600 font-semibold mt-4">
                {#if $errorMessage}{$errorMessage}{/if}
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

        <!-- Metric and Time Options Section -->
        <div class="p-6 bg-gray-100 rounded-lg shadow-lg space-y-6">
            <h2 class="text-xl font-semibold">Filters</h2>

            <!-- Metric Selection -->
            <div>
                <label for="metric-select" class="block text-sm font-medium text-gray-700 mb-2">Select Metric</label>
                <select
                    id="metric-select"
                    bind:value={$selectedMetric}
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                >
                    {#each statisticsMetrics as metric}
                        <option value={metric}>{metricLabelTranslations[metric]}</option>
                    {/each}
                </select>
            </div>

            <!-- Since Options -->
            <div>
                <span class="block text-sm font-medium text-gray-700 mb-2">Select Since</span>
                <div class="flex flex-wrap gap-4">
                    {#each sinceOptions as option}
                        <label class="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                bind:group={$selectedSinceOptions}
                                value={option}
                                class="text-blue-600 focus:ring focus:ring-blue-200"
                            />
                            <span>{metricLabelTranslations[option]}</span>
                            <!-- No more TypeScript error here -->
                        </label>
                    {/each}
                </div>
            </div>

            <!-- Period Options -->
            <div>
                <span class="block text-sm font-medium text-gray-700 mb-2">Select Period</span>
                <div class="flex flex-wrap gap-4">
                    {#each periodOptions as option}
                        <label class="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                bind:group={$selectedPeriodOptions}
                                value={option}
                                class="text-blue-600 focus:ring focus:ring-blue-200"
                            />
                            <span>{option}</span>
                        </label>
                    {/each}
                </div>
            </div>

            <!-- Button to Fetch Statistics -->
            <button class="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700" on:click={handleFetch}>
                Fetch Statistics
            </button>
        </div>

        <!-- Statistics Display Section -->
        <h2 class="text-xl font-semibold">Statistics</h2>

        {#if $data}
            <ul>
                {#each Object.keys($data.emailsStats) as key}
                    {#if Object.keys($data.emailsStats[key].since).length > 0 || Object.keys($data.emailsStats[key].periods).length > 0}
                        <li>
                            <strong>{getTranslation(key)}:</strong>
                            <ul class="pl-4 list-disc">
                                <!-- Since Section (Displayed only if since options are selected) -->
                                {#if $selectedSinceOptions.length > 0}
                                    {#if Object.keys($data.emailsStats[key].since).length > 0}
                                        <li>Since:</li>
                                        <ul class="pl-4">
                                            {#each Object.keys($data.emailsStats[key].since) as sinceKey}
                                                {#if $selectedSinceOptions.includes(sinceKey)}
                                                    <li>
                                                        {getTranslation(sinceKey)}: {getSinceValue(key, sinceKey)}
                                                    </li>
                                                {/if}
                                            {/each}
                                        </ul>
                                    {/if}
                                {/if}

                                <!-- Periods Section (Displayed only if period options are selected) -->
                                {#if $selectedPeriodOptions.length > 0}
                                    <li>Periods:</li>
                                    <ul class="pl-4">
                                        {#each Object.keys($data.emailsStats[key].periods) as periodKey}
                                            {#if $selectedPeriodOptions.includes(periodKey)}
                                                <li>
                                                    {getTranslation(periodKey)}:
                                                    <ul class="pl-4 list-disc">
                                                        <li>Avg: {$data.emailsStats[key].periods[periodKey].avg}</li>
                                                        <li>Min: {$data.emailsStats[key].periods[periodKey].min}</li>
                                                        <li>Max: {$data.emailsStats[key].periods[periodKey].max}</li>
                                                    </ul>
                                                </li>
                                            {/if}
                                        {/each}
                                    </ul>
                                {/if}
                            </ul>
                        </li>
                    {/if}
                {/each}
            </ul>

            <!-- Token Usage Display Section with Icons -->
            <div class="mt-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Token Usage</h3>
                <div class="flex items-center space-x-4">
                    <!-- Input Tokens with Icon -->
                    <div class="flex items-center">
                        <span>
                            <strong>Input Tokens:</strong>
                            {$data.nbTokensInput}
                        </span>
                    </div>

                    <!-- Output Tokens with Icon -->
                    <div class="flex items-center">
                        <span>
                            <strong>Output Tokens:</strong>
                            {$data.nbTokensOutput}
                        </span>
                    </div>

                    <!-- Estimated Cost with Icon -->
                    <div class="flex items-center">
                        <span>
                            <strong>Total Cost:</strong>
                            ${$data.estimatedCostUser.total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        {:else}
            <p>No data available.</p>
        {/if}
    </div>
{/if}
