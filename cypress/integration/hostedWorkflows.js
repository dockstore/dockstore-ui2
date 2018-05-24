describe('Dockstore my workflows', function() {
    require('./helper.js')

    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/my-workflows")
    });

    // Ensure tabs are correct for the hosted workflow, try adding a version
    describe('Should be able to register a hosted workflow and add files to it', function() {
      it('Register the workflow', function() {
        // Select the hosted workflow
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

        // Should not be able to publish
        cy
          .get('#publishButton')
          .should('have.class', 'disabled')

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

        // Add a new version with one descriptor
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
        cy.window().then(function (window) {
          cy.document().then((doc) => {
            var editors = doc.getElementsByClassName('ace_editor');
            var wdlDescriptorFile = 'task md5 {\nFile inputFile\ncommand {\n/bin/my_md5sum ${inputFile}\n}\noutput {\nFile value = \"md5sum.txt\"\n}\nruntime {\ndocker: \"quay.io/agduncan94/my-md5sum\"\n}\n}\nworkflow ga4ghMd5 {\nFile inputFile\ncall md5 { input: inputFile=inputFile }\n}';
            window.ace.edit(editors[0]).setValue(wdlDescriptorFile, -1);
          })
        });

        cy
          .get('#saveNewVersionButton')
          .click()

        // Should have a version 0
        cy
          .get('.nav-link')
          .contains('Versions')
          .parent()
          .click()
          .get('table')
          .find('a')
          .contains('0')

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
            .contains('Add File')
            .click()
          cy.window().then(function (window) {
            cy.document().then((doc) => {
              var editors = doc.getElementsByClassName('ace_editor');
              var wdlDescriptorFile = 'task test {\nFile inputFile\ncommand {\n/bin/my_md5sum ${inputFile}\n}\noutput {\nFile value = \"md5sum.txt\"\n}\nruntime {\ndocker: \"quay.io/agduncan94/my-md5sum\"\n}\n}\nworkflow ga4ghMd5 {\nFile inputFile\ncall test { input: inputFile=inputFile }\n}';
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
              var editors = doc.getElementsByClassName('ace_editor');
              var testParameterFile = '{}';
              window.ace.edit(editors[2]).setValue(testParameterFile, -1);
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
            .find('a')
            .contains('1')

          // Should be able to publish
          cy
            .get('#publishButton')
            .should('not.have.class', 'disabled')

          // Try deleting a file (.wdl file)
          cy
            .get('.nav-link')
            .contains('Files')
            .parent()
            .click()
          cy
            .get('#editFilesButton')
            .click()
          cy
            .get('.delete-editor-file')
            .first()
            .click()
          cy
            .get('#saveNewVersionButton')
            .click()

          // Should now only be two ace editors
          cy
            .get('.ace_editor')
            .should('have.length', 2)

          // New version should be added
          cy
            .get('.nav-link')
            .contains('Versions')
            .parent()
            .click()
            .get('table')
            .find('a')
            .contains('2')

          // Try deleting a version
          cy
            .get('.nav-link')
            .contains('Files')
            .parent()
            .click()
          cy
            .get('#deleteVersionButton')
            .click()

          // Version should no longer exist
          cy
            .get('.nav-link')
            .contains('Versions')
            .parent()
            .click()
            .get('table')
            .find('a')
            .should('not.contain', '2')
      });
    });

})
