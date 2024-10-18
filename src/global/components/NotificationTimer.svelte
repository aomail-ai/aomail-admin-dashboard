<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    export let showNotification: boolean;
    export let notificationTitle: string;
    export let notificationMessage: string;
    export let notificationType: string;

    let showNotificationInternal: boolean = false;
    let timerId: NodeJS.Timeout | null = null;

    let notificationClass: string;

    $: {
        if (notificationType === "success") {
            notificationClass = `pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-green-200/[.89] border border-green-400`;
        } else {
            notificationClass = `pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-red-200/[.89] border border-red-400`;
        }
    }

    const showPopupWithTimer = () => {
        showNotificationInternal = true;
        timerId = setTimeout(() => {
            dismissPopup();
        }, 4000);
    };

    const dismissPopup = () => {
        showNotificationInternal = false;
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
    };

    $: if (showNotification) {
        showPopupWithTimer();
    }

    onMount(() => {
        if (showNotification) {
            showPopupWithTimer();
        }
    });
</script>

<div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
    style="z-index: 51"
>
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        {#if showNotificationInternal}
            <div class={notificationClass} transition:fade={{ duration: 300 }}>
                <div class="p-4">
                    <div class="flex items-start">
                        <div class="ml-3 w-0 flex-1 pt-0.5">
                            <p class="text-sm font-medium text-gray-900">{notificationTitle}</p>
                            <p class="mt-1 text-sm text-gray-900">{notificationMessage}</p>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
