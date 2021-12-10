import { defineConfig } from "vite"

export default defineConfig({
    build: {
        // for webview
        cssTarget: 'chrome61'
    }
})