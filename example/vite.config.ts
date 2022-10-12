import { defineConfig } from 'vite'
import WebConfig from 'vite-plugin-web-config'

export default defineConfig({
  plugins: [
    WebConfig({
      proxy: [['/test', 'http://localhost:3000']],
    }),
  ],
})
