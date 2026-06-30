import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Inspector from 'vite-plugin-react-inspector'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        Inspector(),
    ],
})