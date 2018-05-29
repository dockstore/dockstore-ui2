describe('Dockstore my workflows', function() {
    require('./helper.js')

    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/my-workflows")
    });

    describe('Should contain extended Workflow properties', function() {
        it('visit another page then come back', function() {
            cy.get('a#home-nav-button').click()
            cy.contains('Browse Tools')
            cy.get('a#my-workflows-nav-button').click()

        });
        it('Should contain the extended properties', function() {
            cy.contains('github.com')
            // Apparently you need to click the accordion in order for the other components inside
            // to become click-able
            cy
                .get('accordion')
                .click()
            cy.contains('github.com/A')
                .parentsUntil('accordion-group')
                .contains('Unpublished')
                .should('be.visible')
                .click()
            cy.contains('github.com/A')
                .parentsUntil('accordion-group')
                .contains('div .no-wrap', /\bg\b/)
                .should('be.visible').click()
            cy.contains('GitHub')
            cy.contains('https://github.com/A/g')
        });
    });

    describe('Look at an invalid workflow', function() {
        it('Invalid workflow should not be publishable', function() {
            cy.visit(String(global.baseUrl) + "/my-workflows/github.com/A/g")
            cy
                .get('#publishButton')
                .should('have.class', 'disabled')
            cy
                .get('#refreshButton')
                .should('not.have.class', 'disabled')
        });

    });

    describe('Look at a published workflow', function() {
        it('Look at each tab', function() {
            cy.visit(String(global.baseUrl) + "/my-workflows/github.com/A/l")
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
