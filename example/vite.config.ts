import { defineConfig } from 'vite'
import WebConfig from 'vite-plugin-web-config'

export default defineConfig({
  base: '/demo/',
  plugins: [WebConfig()],
})
