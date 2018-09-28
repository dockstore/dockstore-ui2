describe('Dockstore hosted tools', function() {
    require('./helper.js')

    beforeEach(function() {
      cy.visit(String(global.baseUrl) + "/my-tools")
    });

    function getTool() {
    cy.contains('quay.io/hosted-tool')
      .click()
    cy
      .contains('div .no-wrap', 'ht')
      .should('be.visible')
      .click()
  }

    // Ensure tabs are correct for the hosted tool, try adding a version
    describe('Should be able to register a hosted tool and add files to it', function() {
      it('Register the tool', function() {
        // Select the hosted tool
        getTool()

        // Should not be able to publish (No valid versions)
        cy
          .get('#publishToolButton')
          .should('be.disabled')

        // Should not be able to download zip
        cy
          .get('#downloadZipButton')
          .should('not.be.visible')

        // Check content of the version tab
        cy.goToTab('Versions')
        cy.get('table > tbody')
          .find('tr')
          .should('have.length', 1)

        // Add a new version with one descriptor and dockerfile
        cy.goToTab('Files')
        cy
          .get('#editFilesButton')
          .click()

        cy
          .contains('Add File')
          .click()
        cy.window().then(function (window) {
          cy.document().then((doc) => {
            const editors = doc.getElementsByClassName('ace_editor');
            const dockerfile = `FROM ubuntu:latest`;
            window.ace.edit(editors[0]).setValue(dockerfile, -1);
          })
        });

        cy
          .get('#descriptorFilesTab-link')
          .click()
        cy.wait(500)

        cy
          .get('#descriptorFilesTab')
          .contains('Add File')
          .click()
        cy.window().then(function (window) {
          cy.document().then((doc) => {
            const editors = doc.getElementsByClassName('ace_editor');
            const cwlDescriptor = `cwlVersion: v1.0\nclass: CommandLineTool`;
            window.ace.edit(editors[1]).setValue(cwlDescriptor, -1);
          })
        });

        cy
          .get('#saveNewVersionButton')
          .click()

        // Should have a version 1
        cy.goToTab('Versions')
        cy.get('table')
          .contains('span', /\b1\b/)

        // Should be able to download zip
        cy.goToTab('Info')

        cy
          .get('#downloadZipButton')
          .should('be.visible')

          // Add a new version with a second descriptor and a test json
          cy.goToTab('Files')
          cy
            .get('#editFilesButton')
            .click()
          cy
            .get('#descriptorFilesTab-link')
            .click()
          cy.wait(500)
          cy
            .get('#descriptorFilesTab')
            .contains('Add File')
            .click()
          cy.window().then(function (window) {
            cy.document().then((doc) => {
              const editors = doc.getElementsByClassName('ace_editor');
              const cwlDescriptor = `cwlVersion: v1.0\nclass: CommandLineTool`;
              window.ace.edit(editors[2]).setValue(cwlDescriptor, -1);
            })
          });

          cy
            .get('#testParameterFilesTab-link')
            .click()
          cy.wait(500)
          cy
            .get('#testParameterFilesTab')
            .contains('Add File')
            .click()
          cy.window().then(function (window) {
            cy.document().then((doc) => {
              const editors = doc.getElementsByClassName('ace_editor');
              const testParameterFile = '{}';
              window.ace.edit(editors[3]).setValue(testParameterFile, -1);
            })
          });

          cy
            .get('#saveNewVersionButton')
            .click()

          // Should have a version 2
          cy.goToTab('Versions')
          cy.get('table')
            .contains('span', /\b2\b/)

          // Should be able to publish
          cy
            .get('#publishButton')
            .should('not.be.disabled')

          // Try deleting a file (.cwl file)
          cy.goToTab('Files')
          cy
            .get('#editFilesButton')
            .click()
          cy
            .get('#descriptorFilesTab-link')
            .click()
          cy.wait(500)
          cy
            .get('#descriptorFilesTab')
            .find('.delete-editor-file')
            .first()
            .click()
          cy
            .get('#saveNewVersionButton')
            .click()

          // Should now only be three ace editors
          cy
            .get('.ace_editor')
            .should('have.length', 3)

          // New version should be added
          cy.goToTab('Versions')
            .get('table')
            .contains('span', /\b3\b/)

          // Delete a version
          cy
            .get('table')
            .find('.deleteVersionButton')
            .first()
            .click()

          // Version should no longer exist
          cy.goToTab('Files')
          cy.get('table')
            .find('a')
            .should('not.contain', '1')
      });
    });

})
