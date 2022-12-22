import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: '1ya4vj',
  viewportHeight: 900,
  viewportWidth: 1440,
  defaultCommandTimeout: 45000,
  requestTimeout: 45000,
  retries: {
    runMode: 3,
    openMode: 0,
  },
  userAgent: 'Dockstore/Testing',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
  return require('./cypress/plugins/index.js')(on, config)
},
baseUrl: 'http://localhost:4200',
specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
},
})
