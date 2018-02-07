describe('Dockstore Tool Details', function() {
    require('./helper.js')
    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/containers/quay.io/A2/a")
        cy.visit(String(global.baseUrl) + "/containers/quay.io%2FA2%2Fa")
        cy
            .get('tab')
            .should('have.length', 7)
    });

    it('Change tab to labels', function() {
        cy
            .get('.nav-link')
            .contains('Labels')
            .parent()
            .click()
    });

    it('Change tab to versions', function() {
        cy
            .get('.nav-link')
            .contains('Versions')
            .parent()
            .click()
    });

    describe('Change tab to files', function() {
        beforeEach(function() {
            cy
                .get('.nav-link')
                .contains('Files')
                .parent()
                .click()
        });

        it('Should have Dockerfile tab selected', function() {
            cy
                .get('.nav-link')
                .contains('Dockerfile')
                .parent()
                .click()
                .should("have.class", "active")

            it('Should have content in file viewer', function() {
                cy
                    .get(".hljs.yaml")
                    .should("be.visible")
            });
        });

        describe('Change tab to Descriptor files', function() {
            beforeEach(function() {
                cy
                    .get('.nav-link')
                    .contains('Descriptor Files')
                    .parent()
                    .click()
            });

            it('Should have content in file viewer', function() {
                cy
                    .get(".hljs.yaml")
                    .should("be.visible")
            });
        });

        describe('Change tab to Test Parameters', function() {
            beforeEach(function() {
                cy
                    .get('.nav-link')
                    .contains('Test Parameter Files')
                    .parent()
                    .click()
            });

            it('Should not have content in file viewer', function() {
                cy
                    .get(".hljs.yaml")
                    .should("not.be.visible")
                cy
                    .contains('A Test Parameter File associated with this Docker container, descriptor type and version could not be found.')
            });
        });
    });
})