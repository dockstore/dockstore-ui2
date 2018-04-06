describe('Checker workflow test from tools', function() {
    require('./helper.js')

    beforeEach(function() {
        // Visit the search-containers page
        cy.visit(String(global.baseUrl) + "/search-containers")
    });


    describe('Should be able to see the checker workflow from a tool', function() {
        it('visit the tool with a checker workflow and have the correct buttons', function() {
            cy.get('tbody')
                .children('tr')
                .find('a')
                .contains('b3')
                .should('not.have.attr', 'href', '/containers/quay.io%20A2%20b3')
                .should('have.attr', 'href', '/containers/quay.io/A2/b3').click()

            // In the parent tool right now
            cy.url().should('eq', 'http://localhost:4200/containers/quay.io/A2/b3:latest?tab=info')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.get('#launchCheckerWorkflow').should('be.visible')
            cy.get('#viewCheckerWorkflowButton').should('visible').click()

            // In the checker workflow right now
            cy.url().should('eq', 'http://localhost:4200/workflows/github.com/A2/b3/_cwl_checker:latest?tab=info')
            cy.get('#viewCheckerWorkflowButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.get('#launchCheckerWorkflow').should('not.be.visible')
            cy.get('#viewParentEntryButton').should('be.visible').click()

            // In the parent tool right now
            // Accidentically allow the uri "tools" to work
            cy.url().should('eq', 'http://localhost:4200/tools/quay.io/A2/b3:latest?tab=info')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.get('#launchCheckerWorkflow').should('be.visible')
            cy.get('#viewCheckerWorkflowButton').should('visible')
        })
    });
});
