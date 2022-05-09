import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
  plugins: [vue()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      "@": path.resolve(__dirname, './src')
    }
  },
  define: {
    'process.env': process.env
  },
  // build:{
  //   outDir: "dist"
  // },
})
