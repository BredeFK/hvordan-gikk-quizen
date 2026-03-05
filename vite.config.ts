import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-confetti'],
                    'vendor-mui': ['@mui/material', '@mui/system', '@emotion/react', '@emotion/styled'],
                    'vendor-charts': ['@mui/x-charts'],
                    'vendor-radix': ['@radix-ui/themes', '@radix-ui/react-icons', '@radix-ui/react-tooltip'],
                    'vendor-datepicker': ['react-datepicker', 'date-fns'],
                }
            }
        }
    }
})
