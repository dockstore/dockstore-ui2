describe('Dockstore my workflows', function() {
    require('./helper.js')

    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/my-workflows")
    });

    describe('Should contain extended Workflow properties', function() {
        it('visit another page then come back', function() {
            cy.get('a').contains('Workflows').click()
            cy.contains('GitHub')
            cy.get('a').contains('My Workflows').click()

        });
        it('Should contain the extended properties', function() {
            cy
                .get('accordion')
                .get('.panel')
                .children(':nth-child(2)')
                .contains('a', 'g')
                .click()
            cy.contains('GitHub')
            cy.contains('https://github.com/A/g')
        });
    });

    describe('Look at an invalid workflow', function() {
        it('Invalid workflow should not be publishable', function() {
            cy
                .get('#publishButton')
                .should('have.class', 'disabled')
            cy
                .get('#refreshButton')
                .should('not.have.class', 'disabled')
        });

        it('Only Info and Labels tab should be enabled', function() {
            cy
                .get('.nav-link')
                .contains('Info')
                .parent()
                .should('have.class', 'active')
                .and('not.have.class', 'disabled')
            cy
                .get('.nav-link')
                .contains('Labels')
                .parent()
                .should('not.have.class', 'disabled')
            cy
                .get('.nav-link')
                .contains('Versions')
                .parent()
                .should('have.class', 'disabled')
            cy
                .get('.nav-link')
                .contains('Files')
                .parent()
                .should('have.class', 'disabled')
            cy
                .get('.nav-link')
                .contains('Tools')
                .parent()
                .should('have.class', 'disabled')
            cy
                .get('.nav-link')
                .contains('DAG')
                .parent()
                .should('have.class', 'disabled')
        });
    });

    describe('Look at a published workflow', function() {
        it('Look at each tab', function() {
            cy
                .get('accordion')
                .children(':nth-child(1)')
                .find('a')
                .contains('l')
                .first()
                .click()
            cy
                .get('.nav-link')
                .contains('Info')
                .parent()
                .should('have.class', 'active')
                .and('not.have.class', 'disabled')
            cy
                .get('.nav-link')
                .contains('Labels')
                .parent()
                .should('not.have.class', 'disabled')
            cy
                .get('.nav-link')
                .contains('Versions')
                .parent()
                .should('not.have.class', 'disabled')
            cy
                .get('.nav-link')
                .contains('Files')
                .parent()
                .should('not.have.class', 'disabled')
            cy
                .get('.nav-link')
                .contains('Tools')
                .parent()
                .should('not.have.class', 'disabled')
            cy
                .get('.nav-link')
                .contains('DAG')
                .parent()
                .should('not.have.class', 'disabled')

            cy
                .get('#publishButton')
                .should('contain', 'Unpublish')
                .click()
                .should('contain', 'Publish')
                .click()
                .should('contain', 'Unpublish')
        });
    });
})