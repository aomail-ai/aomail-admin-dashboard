import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit()],
    preview: {
        allowedHosts: ["admin.aomail.ai"],
    },
});
