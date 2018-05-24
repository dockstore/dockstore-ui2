describe('Dockstore my workflows', function() {
    require('./helper.js')

    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/my-workflows")
    });

    // Ensure tabs are correct for the hosted workflow, try adding a version
    describe('Should be able to register a hosted workflow and add files to it', function() {
      it('Register the workflow', function() {
          cy.wait(500)
          cy
              .contains('dockstore.org')
              .parent()
              .parent()
              .should('be.visible')
              .click()
          cy
              .get('accordion')
              .contains('hosted-workflow')
              .click()
          // Check content of the info tab
          cy
              .contains('Mode: HOSTED')

          // Check content of the version tab
          cy
              .get('.nav-link')
              .contains('Versions')
              .parent()
              .click()
              .get('table > tbody')
              .find('tr')
              .should('have.length', 2)
          // Add a new version
          cy
              .get('.nav-link')
              .contains('Files')
              .parent()
              .click()
          cy
              .get('#deleteVersionButton')
              .should('be.disabled')
          cy
              .get('#editFilesButton')
              .click()
          cy
              .contains('Add File')
              .click()

          // Versions tab should include new version
          // Should be able to publish and unpublish
          // Add a new version with a test parameter file
      });
    });

})
