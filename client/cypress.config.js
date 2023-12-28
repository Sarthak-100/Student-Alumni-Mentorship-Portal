const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'hyi64h',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});