describe('Dockstore hosted workflows', function() {
    require('./helper.js')

    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/my-workflows")
    });

    function getWorkflow() {
      cy.contains('dockstore.org/A')
        .click()
      cy.contains('dockstore.org/A')
          .parentsUntil('accordion-group')
          .contains('div .no-wrap', /hosted/)
          .should('be.visible').click()
  }

    // Ensure tabs are correct for the hosted workflow, try adding a version
    describe('Should be able to register a hosted workflow and add files to it', function() {
      it('Register the workflow', function() {
        // Select the hosted workflow
        getWorkflow();

        // Should not be able to publish (No valid versions)
        cy
          .get('#publishButton')
          .should('be.disabled')

        // Check content of the info tab
        cy
          .contains('Mode: HOSTED')

        // Should not be able to download zip
        cy
          .get('#downloadZipButton')
          .should('not.be.visible')

        // Check content of the version tab
        // 1 row saying no records
        cy.goToTab('Versions')
          .get('table > tbody')
          .find('tr')
          .should('have.length', 1)

        // Add a new version with one descriptor
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
            const wdlDescriptorFile = `task md5 { File inputFile command { /bin/my_md5sum \${inputFile} } output { File value = \"md5sum.txt\" } runtime { docker: \"quay.io/agduncan94/my-md5sum\" } } workflow ga4ghMd5 { File inputFile call md5 { input: inputFile=inputFile } }`;
            window.ace.edit(editors[0]).setValue(wdlDescriptorFile, -1);
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
            .contains('Add File')
            .click()
          cy.window().then(function (window) {
            cy.document().then((doc) => {
              const editors = doc.getElementsByClassName('ace_editor');
              const wdlDescriptorFile = `task test { File inputFile command { /bin/my_md5sum \${inputFile} } output { File value = \"md5sum.txt\" } runtime { docker: \"quay.io/agduncan94/my-md5sum\" } } workflow ga4ghMd5 { File inputFile call test { input: inputFile=inputFile } }`;
              window.ace.edit(editors[1]).setValue(wdlDescriptorFile, -1);
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
              window.ace.edit(editors[2]).setValue(testParameterFile, -1);
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

          // Try deleting a file (.wdl file)
          cy.goToTab('Files')
          cy
            .get('#editFilesButton')
            .click()
          cy
            .get('.delete-editor-file')
            .first()
            .should('be.visible')
            .click()
          cy
            .get('#saveNewVersionButton')
            .click()

          // Should now only be two ace editors
          cy
            .get('.ace_editor')
            .should('have.length', 2)

          // New version should be added
          cy.goToTab('Versions')
          cy.get('table')
          .contains('span', /\b3\b/)

          // Delete a version
          cy
            .get('table')
            .find('.deleteVersionButton')
            .first()
            .click()

          // Version should no longer exist
          cy.goToTab('Versions')
          cy.get('table')
            .find('a')
            .should('not.contain', '1')
      });
    });

})
