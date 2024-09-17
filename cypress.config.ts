import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: '1ya4vj',
  viewportHeight: 1080,
  viewportWidth: 1920,
  defaultCommandTimeout: 30000,
  requestTimeout: 30000,
  experimentalMemoryManagement: true,
  retries: {
    runMode: 0,
    openMode: 0,
  },
  userAgent: 'Dockstore/Testing',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
  return require('./cypress/plugins/index.ts')(on, config)
},
baseUrl: 'http://localhost:4200',
specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
},
})
