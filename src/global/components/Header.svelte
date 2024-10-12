<script lang="ts">
    const logout = () => {
        localStorage.clear();
    };
</script>

<header class="sticky inset-x-0 top-0 z-50 bg-white border-b border-gray-200">
    <nav class="flex items-center justify-between p-6 lg:px-8 relative">
        <a href="/" class="absolute top-1/2 transform -translate-y-1/2">
            <img class="h-12 w-auto" src="/logo-aomail-name.png" alt="Aomail logo" />
        </a>

        <div class="flex flex-1 justify-center space-x-8">
            <a href="/dashboard" class="text-sm font-semibold leading-6 text-gray-900 rounded-md hover:bg-gray-100 p-2">
                Dashboard
            </a>
            <a
                href="/management"
                class="text-sm font-semibold leading-6 text-gray-900 rounded-md hover:bg-gray-100 p-2"
            >
                Management
            </a>
            <a
                href="/search-user-info"
                class="text-sm font-semibold leading-6 text-gray-900 rounded-md hover:bg-gray-100 p-2"
            >
                Search User Info
            </a>
        </div>
        <button
            class="flex items-center justify-center p-2 text-red-600 hover:text-red-800 absolute right-6"
            on:click={logout}
            title="Logout"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v9m6.364-3.636a9 9 0 1 1-12.728 0" />
            </svg>
            <span class="ml-2 text-sm font-semibold leading-6">Logout</span>
        </button>
    </nav>
</header>
