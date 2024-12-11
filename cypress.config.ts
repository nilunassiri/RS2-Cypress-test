import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    chromeWebSecurity: false,
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,ts}"
  },
})