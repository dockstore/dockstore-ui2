describe('Dockstore hosted tools', function() {
    require('./helper.js')

    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/my-tools")
    });

    // Ensure tabs are correct for the hosted tool, try adding a version
    describe('Should be able to register a hosted tool and add files to it', function() {
      it('Register the tool', function() {
        // Select the hosted tool
        cy
          .contains('quay.io/hosted-tool')
          .invoke('width').should('be.gt', 0)
        cy
          .get('accordion')
          .click()
        cy
          .contains('quay.io/hosted-tool')
          .click()
        cy
          .contains('ht')
          .click()

        // Should not be able to publish (No valid versions)
        cy
          .get('#publishToolButton')
          .should('have.class', 'disabled')

        // Check content of the version tab
        cy
          .get('.nav-link')
          .contains('Versions')
          .parent()
          .click()
          .get('table > tbody')
          .find('tr')
          .should('have.length', 1)

        // Add a new version with one descriptor and dockerfile
        cy
          .get('.nav-link')
          .contains('Files')
          .parent()
          .click()
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
            const cwlDescriptor = `#!/usr/bin/env cwl-runner cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []`;
            window.ace.edit(editors[1]).setValue(cwlDescriptor, -1);
          })
        });

        cy
          .get('#saveNewVersionButton')
          .click()

        // Should have a version 1
        cy
          .get('.nav-link')
          .contains('Versions')
          .parent()
          .click()
          .get('table')
          .contains('span', /\b1\b/)

          // Add a new version with a second descriptor and a test json
          cy
            .get('.nav-link')
            .contains('Files')
            .parent()
            .click()
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
              const cwlDescriptor = `#!/usr/bin/env cwl-runner cwlVersion: v1.0 class: CommandLineTool baseCommand: echo inputs: message: type: string inputBinding: position: 1 outputs: []`;
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
          cy
            .get('.nav-link')
            .contains('Versions')
            .parent()
            .click()
            .get('table')
            .contains('span', /\b2\b/)

          // Should be able to publish
          cy
            .get('#publishButton')
            .should('not.have.class', 'disabled')

          // Try deleting a file (.cwl file)
          cy
            .get('.nav-link')
            .contains('Files')
            .parent()
            .click()
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
          cy
            .get('.nav-link')
            .contains('Versions')
            .parent()
            .click()
            .get('table')
            .contains('span', /\b3\b/)

          // Delete a version
          cy
            .get('table')
            .find('.deleteVersionButton')
            .first()
            .click()

          // Version should no longer exist
          cy
            .get('.nav-link')
            .contains('Versions')
            .parent()
            .click()
            .get('table')
            .find('a')
            .should('not.contain', '1')
      });
    });

})
