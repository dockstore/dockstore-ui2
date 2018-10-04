// These tests in the checkerWorkflow directory depend on each other
describe('Checker workflow test from workflows', function() {
    require('../helper.js')
    require('../helperCommands.js')
    beforeEach(function() {
        // Visit the workflows page
        cy.visit(String(global.baseUrl) + "/workflows")
    });


    describe('Should be able to see the checker workflow from a workflow', function() {
        it('visit the tool with a checker workflow and have the correct buttons', function() {
            cy.get('mat-cell')
                .find('a')
                // Grabbing the checker because couldn't figure out how to grab the 'l' workflow, it's not specific enough
                .contains('l/_cwl_checker')
                .should('not.have.attr', 'href', '/workflows/github.com%20A%20l')
                .should('have.attr', 'href', '/workflows/github.com/A/l/_cwl_checker').click()

            // In the checker workflow right now
            // TODO: The version is not set because the checker does not actually have any versions. We should add some.
            cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l/_cwl_checker?tab=info')
            cy.get('#viewCheckerWorkflowButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.goToTab('Launch')
            cy.get('#launchCheckerWorkflow').should('not.be.visible')
            cy.goToTab('Info')
            cy.get('#viewParentEntryButton').should('be.visible').click()

            // In the parent workflow right now
            cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=info')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.goToTab('Launch')
            cy.get('#launchCheckerWorkflow').should('be.visible')
            cy.goToTab('Info')
            cy.get('#viewCheckerWorkflowButton').should('visible').click()

            // In the checker workflow right now
            cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l/_cwl_checker?tab=info')
            cy.get('#viewCheckerWorkflowButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.goToTab('Launch')
            cy.get('#launchCheckerWorkflow').should('not.be.visible')
            cy.goToTab('Info')
            cy.get('#viewParentEntryButton').should('be.visible')
        })
    });
});
